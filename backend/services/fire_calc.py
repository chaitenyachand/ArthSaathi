from typing import Dict, Any, List

class FIRECalc:
    """
    Financial Independence, Retire Early (FIRE) Simulation Engine.
    Handles exact mathematical calculations for achieving a financial corpus.
    """
    
    @staticmethod
    def calculate_fire_roadmap(current_age: float, 
                               target_age: float, 
                               current_corpus: float, 
                               target_corpus: float, 
                               expected_cagr: float, 
                               inflation_rate: float,
                               life_events: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Takes the user's current age, target retirement age, current corpus, inflation rate,
        expected CAGR (as a decimal e.g. 0.12 for 12%), and the target FIRE corpus.
        Calculates the exact SIP required starting today to hit the goal, and returns 
        a month-by-month roadmap for frontend charting.
        """
        
        if target_age <= current_age:
            raise ValueError("Target retirement age must be greater than current age.")
            
        years_to_invest = target_age - current_age
        total_months = int(years_to_invest * 12)
        
        # Monthly rate of return (geometric)
        # (1 + CAGR)^(1/12) - 1 is mathematically precise, alternatively simple CAGR/12.
        # Often Indian MF SIP calculators use simple nominal monthly rate: r = CAGR / 12
        # We will use the mathematically precise geometric rate.
        monthly_rate = (1 + expected_cagr) ** (1/12) - 1
        
        if life_events is None:
            life_events = []
            
        future_target_corpus = target_corpus * ((1 + inflation_rate) ** years_to_invest)
        
        # Calculate FV of massive cash flow hits
        total_fv_events = 0.0
        for event in life_events:
            evt_cost = event.get('cost', 0.0)
            evt_years = event.get('years_from_now', 0.0)
            if evt_years <= years_to_invest:
                total_fv_events += evt_cost * ((1 + expected_cagr) ** (years_to_invest - evt_years))
                
        future_target_corpus += total_fv_events
        
        # Calculate the future value of the CURRENT corpus
        future_current_corpus = current_corpus * ((1 + expected_cagr) ** years_to_invest)
        
        # Required gap to hit via SIP
        gap = future_target_corpus - future_current_corpus
        
        if gap <= 0:
            required_sip = 0.0
        else:
            # Future Value of Annuity formula (assuming beginning of month investments - Annuity Due)
            # FV = SIP * [ ((1+r)^n - 1) / r ] * (1+r)
            if monthly_rate > 0:
                annuity_factor = (((1 + monthly_rate) ** total_months) - 1) / monthly_rate
                required_sip = gap / (annuity_factor * (1 + monthly_rate))
            else:
                required_sip = gap / total_months

        # Generate month-by-month roadmap for charting
        roadmap_data: List[Dict[str, Any]] = []
        running_corpus = current_corpus
        total_invested = current_corpus
        
        for month in range(1, total_months + 1):
            # Beginning of month: deposit SIP
            if required_sip > 0:
                running_corpus += required_sip
                total_invested += required_sip
                
            # End of month: apply growth
            running_corpus *= (1 + monthly_rate)
            
            # APPLY LIFE EVENTS AT EXACT MONTH
            for event in life_events:
                evt_cost = event.get('cost', 0.0)
                evt_years = event.get('years_from_now', 0.0)
                if int(evt_years * 12) == month:
                    running_corpus -= evt_cost
                    
            # Record data every month (or could optimize to every quarter/year depending on frontend load)
            # We'll return it per month as requested: "calculate a month-by-month roadmap"
            current_month_age = current_age + (month / 12.0)
            
            # Formatting JSON payload for easy recharts/chart.js consumption
            roadmap_data.append({
                "month": month,
                "age": round(current_month_age, 2),
                "total_invested": round(total_invested, 2),
                "projected_corpus": round(running_corpus, 2)
            })
            
        return {
            "summary": {
                "current_age": current_age,
                "target_age": target_age,
                "current_corpus": current_corpus,
                "future_target_corpus": round(future_target_corpus, 2),
                "required_monthly_sip": round(required_sip, 0)
            },
            "roadmap": roadmap_data
        }

    @staticmethod
    def calculate_cost_of_delay(req_data: dict) -> Dict[str, Any]:
        sip = req_data['monthly_sip']
        cur_age = req_data['current_age']
        ret_age = req_data['retirement_age']
        delay = req_data['delay_years']
        cagr = req_data['expected_cagr']

        if ret_age <= cur_age + delay:
            raise ValueError("Retirement age must securely exceed current age + delay.")

        total_months = (ret_age - cur_age) * 12
        delay_months = delay * 12
        monthly_rate = (1 + cagr) ** (1/12.0) - 1

        roadmap = []
        imm_corpus = 0.0
        del_corpus = 0.0

        for month in range(1, total_months + 1):
            imm_corpus += sip
            imm_corpus *= (1 + monthly_rate)

            if month > delay_months:
                del_corpus += sip
                del_corpus *= (1 + monthly_rate)

            # Record strictly yearly arrays to optimize payload rendering on Recharts
            if month % 12 == 0 or month == total_months:
                roadmap.append({
                    "age": round(cur_age + (month / 12.0), 1),
                    "immediate_corpus": round(imm_corpus, 2),
                    "delayed_corpus": round(del_corpus, 2)
                })

        return {
            "total_saved_uninvested": round(sip * delay_months, 2),
            "total_compounding_lost": round(imm_corpus - del_corpus, 2),
            "final_immediate_corpus": round(imm_corpus, 2),
            "final_delayed_corpus": round(del_corpus, 2),
            "roadmap": roadmap
        }

    @staticmethod
    def simulate_joint_portfolio(req_data: dict) -> Dict[str, Any]:
        pA = req_data['person_a']
        pB = req_data['person_b']
        target = req_data['joint_target_corpus']
        
        cagr_a = pA['expected_cagr']
        cagr_b = pB['expected_cagr']
        rate_a = (1 + cagr_a) ** (1/12.0) - 1
        rate_b = (1 + cagr_b) ** (1/12.0) - 1
        
        corp_a = pA['current_corpus']
        corp_b = pB['current_corpus']
        sip_a = pA['sip']
        sip_b = pB['sip']
        
        roadmap = []
        hit_target_month = -1
        
        # Simulate natively up to 40 years to guarantee intersection mapping
        for month in range(1, (40 * 12) + 1):
            corp_a += sip_a
            corp_a *= (1 + rate_a)
            
            corp_b += sip_b
            corp_b *= (1 + rate_b)
            
            combined = corp_a + corp_b
            
            if combined >= target and hit_target_month == -1:
                hit_target_month = month
                
            if month % 12 == 0:
                roadmap.append({
                    "year": month // 12,
                    "person_a_corpus": round(corp_a, 2),
                    "person_b_corpus": round(corp_b, 2),
                    "combined_corpus": round(combined, 2),
                    "target": round(target, 2)
                })
                
        # If never hits target natively, cap it at max simulation
        years_to_fire = round(hit_target_month / 12.0, 1) if hit_target_month > 0 else 40.0
        
        # Find exact corpus levels at the moment of FIRE
        final_month = hit_target_month if hit_target_month > 0 else (40 * 12)
        target_year = final_month // 12
        if target_year == 0: target_year = 1
        exact_a = roadmap[target_year - 1]["person_a_corpus"]
        exact_b = roadmap[target_year - 1]["person_b_corpus"]
        
        return {
            "years_to_fire": years_to_fire,
            "person_a_final": exact_a,
            "person_b_final": exact_b,
            "total_final": round(exact_a + exact_b, 2),
            "roadmap": roadmap
        }

