from typing import Dict, Any, List
from models.feature_models import HealthScoreRequest, HealthScoreResponse, HealthBreakdown

class ScoringEngine:
    @staticmethod
    def calculate_global_health(req: HealthScoreRequest) -> HealthScoreResponse:
        score = 100
        breakdown = []
        
        # Rule 1: 50/30/20 Test (SIP < 20%)
        if req.monthly_sip < (0.20 * req.monthly_income):
            score -= 15
            breakdown.append(HealthBreakdown(rule="50/30/20 Savings Ratio", status="Failed (SIP < 20% Income)", points_deducted=15))
        else:
            breakdown.append(HealthBreakdown(rule="50/30/20 Savings Ratio", status="Optimal", points_deducted=0))
            
        # Rule 2: Rent Burden
        if req.monthly_rent_emi > (0.30 * req.monthly_income):
            score -= 20
            breakdown.append(HealthBreakdown(rule="Shelter Burden", status="Failed (Rent > 30% Income)", points_deducted=20))
        else:
            breakdown.append(HealthBreakdown(rule="Shelter Burden", status="Optimal", points_deducted=0))
            
        # Rule 3: Emergency Float
        monthly_burn = req.monthly_income - req.monthly_sip
        if req.emergency_fund_balance < (6 * monthly_burn):
            score -= 25
            breakdown.append(HealthBreakdown(rule="Emergency Float", status="Failed (< 6 Mo. Runway)", points_deducted=25))
        else:
             breakdown.append(HealthBreakdown(rule="Emergency Float", status="Optimal", points_deducted=0))
             
        # Rule 4: Debt Trap
        if req.total_debt > (12 * req.monthly_income):
            score -= 20
            breakdown.append(HealthBreakdown(rule="Debt-to-Income", status="Failed (Debt > 1 Yr Income)", points_deducted=20))
        else:
            breakdown.append(HealthBreakdown(rule="Debt-to-Income", status="Optimal", points_deducted=0))
            
        # Ensure floor of 0
        score = max(0, score)
        
        # Grade mapping
        if score >= 90: grade = "A+"
        elif score >= 80: grade = "B"
        elif score >= 60: grade = "C"
        elif score >= 40: grade = "D"
        else: grade = "F"
            
        return HealthScoreResponse(score=score, grade=grade, breakdown=breakdown)
