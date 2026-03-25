import pandas as pd
from datetime import date
from scipy.optimize import brentq

class XIRREngine:
    @staticmethod
    def calculate_xirr(transactions_df: pd.DataFrame, current_value: float = 0.0) -> float:
        """
        Calculates the true annualized XIRR percentage from a DataFrame of transactions.
        Maps SIPs/purchases as negative cash flows and the current portfolio value as positive today.
        """
        if transactions_df.empty and current_value <= 0:
            return 0.0
            
        cash_flows = []
        
        # Iterate over rows
        for _, row in transactions_df.iterrows():
            tx_date = row['date']
            if isinstance(tx_date, pd.Timestamp):
                tx_date = tx_date.date()
                
            amount = float(row['amount'])
            tx_type = row.get('transaction_type', '').lower()
            
            # Map purchases/SIPs as negative, redemptions as positive
            if 'purchase' in tx_type or 'sip' in tx_type or 'buy' in tx_type:
                cash_flows.append((tx_date, -abs(amount)))
            elif 'redemption' in tx_type or 'sell' in tx_type or 'withdrawal' in tx_type:
                cash_flows.append((tx_date, abs(amount)))
            
        # Add current value as a positive cash flow today
        cash_flows.append((date.today(), abs(current_value)))
        
        # Sort by date
        cash_flows.sort(key=lambda x: x[0])
        
        # We need at least one positive and one negative cash flow to compute XIRR
        pos = any(cf[1] > 0 for cf in cash_flows)
        neg = any(cf[1] < 0 for cf in cash_flows)
        
        if not pos or not neg:
            return 0.0
            
        d0 = cash_flows[0][0]
        
        def npv(r):
            sum_npv = 0.0
            for d, cf in cash_flows:
                days = (d - d0).days
                # Avoid complex numbers for invalid rates < -100%
                if r <= -1.0:
                    return float('inf')
                sum_npv += cf / ((1.0 + r) ** (days / 365.0))
            return sum_npv
            
        try:
            # Brentq finds a root of npv(r) = 0 in the given bracket
            result = brentq(npv, -0.9999, 1000.0)
            return result * 100.0 # Return as percentage
        except ValueError:
            # Fallback if brentq fails (e.g. root not in bracket)
            return 0.0
