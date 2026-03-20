import logging
from datetime import date
from typing import Dict, Any
from fastapi import UploadFile

from services.pdf_parser_service import PDFParserService
from services.market_data_service import MarketDataService
from utils.math_utils import calculate_xirr

logger = logging.getLogger(__name__)

class XrayService:
    @staticmethod
    async def analyze_portfolio(file: UploadFile) -> Dict[str, Any]:
        """
        Analyzes a mutual fund portfolio PDF to extract XIRR and Cost of Bad Advice.
        """
        # 1. Parse File securely in memory
        cams_data = await PDFParserService.parse_cams_statement(file)
        
        # 2. Fetch required market AMFI data
        amfi_data = await MarketDataService.fetch_amfi_data()
        
        transactions = cams_data.transactions
        if not transactions:
            return {"error": "No recognizable mutual fund transactions found in this document."}
            
        all_dates = []
        all_amounts = []
        
        total_invested = 0.0
        current_invested_regular = 0.0
        scheme_units = {}
        
        for t in transactions:
            abs_amt = abs(t.amount)
            scheme = t.scheme_name or "Unknown Scheme"
            
            # CAMS heuristics: if units are positive, it's a purchase. 
            # In XIRR, a purchase (money out) is a negative cash flow.
            if t.units > 0: 
                all_dates.append(t.date)
                all_amounts.append(-abs_amt)
                total_invested += abs_amt
            elif t.units < 0: 
                # Redemption: money in, positive cash flow
                all_dates.append(t.date)
                all_amounts.append(abs_amt)
            
            # If units == 0 (like dividends/taxes), we simply record the cash outflow/inflow appropriately if applicable, 
            # but usually they are 0-sum on units. We'll skip adding to total_invested to avoid inflating it.
                
            scheme_units[scheme] = scheme_units.get(scheme, 0.0) + t.units

        # Remove negligible unit anomalies (dust units)
        scheme_units = {k: v for k, v in scheme_units.items() if v > 0.01}

        current_value = 0.0
        details = []
        
        for scheme_name, units in scheme_units.items():
            nav = 0.0
            is_regular = False
            s_name_lower = scheme_name.lower()
            
            # 1. Identifying Regular funds via names
            if "direct" in s_name_lower or "dir" in s_name_lower:
                is_regular = False
            elif "regular" in s_name_lower or "reg" in s_name_lower:
                is_regular = True
            else:
                # If neither is explicitly stated, assume Regular to be conservative in the X-Ray
                is_regular = True

            # 2. Match AMFI NAV
            matched_amfi = None
            for amfi_name, data in amfi_data.items():
                if amfi_name in s_name_lower or s_name_lower in amfi_name:
                    matched_amfi = data
                    break
                    
            if matched_amfi:
                nav = matched_amfi["nav"]
            else:
                # Fallback to last known NAV in the statement
                scheme_txns = [t for t in transactions if t.scheme_name == scheme_name and t.nav > 0]
                if scheme_txns:
                    nav = sorted(scheme_txns, key=lambda x: x.date)[-1].nav

            val = units * nav
            current_value += val
            
            if is_regular:
                current_invested_regular += val
                
            details.append({
                "scheme_name": scheme_name,
                "units": round(units, 4),
                "current_nav": nav,
                "current_value": round(val, 2),
                "is_regular": is_regular
            })
            
        # Add current value as final inflow for XIRR on today's date
        all_dates.append(date.today())
        all_amounts.append(current_value)
        
        xirr = 0.0
        try:
            xirr = calculate_xirr(all_dates, all_amounts)
        except Exception as e:
            logger.error(f"XIRR Calculation failed: {e}")
            
        # Cost of Bad Advice: Assumed 10 year compound cost difference.
        # Direct plans often save ~0.75% per year over regular plans (distributor commission).
        assumed_market_return = 0.12 # 12% benchmark
        regular_return = assumed_market_return - 0.0075 # 11.25%
        years = 10
        
        fv_direct_equivalent = current_invested_regular * ((1 + assumed_market_return) ** years)
        fv_regular_stays = current_invested_regular * ((1 + regular_return) ** years)
        cost_of_bad_advice = fv_direct_equivalent - fv_regular_stays

        return {
            "investor_name": cams_data.investor_name,
            "pan": cams_data.pan,
            "total_invested": round(total_invested, 2),
            "current_value": round(current_value, 2),
            "xirr_percentage": round(xirr * 100, 2),
            "regular_funds_ratio_percentage": round((current_invested_regular / current_value) * 100, 2) if current_value else 0.0,
            "cost_of_bad_advice_10_yrs": round(cost_of_bad_advice, 2),
            "scheme_details": details
        }
