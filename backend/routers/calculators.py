from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from utils.math_utils import calculate_future_value

router = APIRouter(prefix="/api/v1/calculators", tags=["Calculators"])

class FireRequest(BaseModel):
    target_corpus: float = Field(..., gt=0, description="Target retirement corpus in INR")
    current_age: int = Field(..., gt=0, lt=100)
    retirement_age: int = Field(..., gt=0, lt=100)
    current_savings: float = Field(0.0, ge=0)
    expected_return_rate: float = Field(0.12, ge=0, description="Expected annual return rate (e.g., 0.12)")
    inflation_rate: float = Field(0.06, ge=0, description="Expected annual inflation rate (e.g., 0.06)")

class SalaryToWealthRequest(BaseModel):
    monthly_amount: float = Field(..., gt=0, description="Monthly amount diverted (e.g., from an expense/increment)")

class HealthQuizAnswers(BaseModel):
    emergency_fund_months: float = Field(0, description="Months of expenses saved in emergency fund")
    has_health_insurance: bool
    has_term_insurance: bool
    monthly_savings_percentage: float = Field(0.0, ge=0, le=100, description="Percentage of income saved")
    has_high_interest_debt: bool
    invests_in_equity: bool

@router.post("/fire")
def calculate_fire_trajectory(req: FireRequest):
    if req.retirement_age <= req.current_age:
        raise HTTPException(status_code=400, detail="Retirement age must be greater than current age.")
        
    years_to_retire = req.retirement_age - req.current_age
    months_to_retire = years_to_retire * 12
    
    # Adjust target corpus dynamically for inflation over the years
    inflation_adjusted_target = req.target_corpus * ((1 + req.inflation_rate) ** years_to_retire)
    
    # Calculate Future Value of current lumpsum savings
    fv_current_savings = req.current_savings * ((1 + req.expected_return_rate) ** years_to_retire)
    
    # Remaining target to be met via active SIP
    shortfall = max(0.0, inflation_adjusted_target - fv_current_savings)
    
    # Formula mapping to find required SIP for a future value
    monthly_rate = req.expected_return_rate / 12.0
    
    if shortfall > 0 and monthly_rate > 0:
        # SIP = FV / [ (((1 + r)^n - 1) / r) * (1 + r) ]
        factor = (((1 + monthly_rate) ** months_to_retire - 1) / monthly_rate) * (1 + monthly_rate)
        required_monthly_sip = shortfall / factor
    else:
        required_monthly_sip = 0.0
        
    # Generate exact month-by-month compounding trajectory
    trajectory = []
    current_corpus = req.current_savings
    for m in range(1, months_to_retire + 1):
        # Apply 1 month of compounding to existing corpus
        current_corpus *= (1 + monthly_rate)
        
        # Add SIP which also gets 1 month of return (beginning of month assumed)
        current_corpus += required_monthly_sip * (1 + monthly_rate)
        
        trajectory.append({
            "month": m,
            "age_years": round(req.current_age + (m / 12.0), 2),
            "sip_paid": round(required_monthly_sip, 2),
            "projected_corpus": round(current_corpus, 2)
        })
        
    return {
        "inflation_adjusted_target": round(inflation_adjusted_target, 2),
        "fv_of_current_savings": round(fv_current_savings, 2),
        "required_monthly_sip": round(required_monthly_sip, 2),
        "trajectory": trajectory
    }

@router.post("/salary-to-wealth")
def calculate_salary_to_wealth(req: SalaryToWealthRequest):
    """
    Translates tactical micro-habits into macro-wealth generation.
    e.g., A 5k increment saved monthly over 30 years.
    """
    years = 30
    rate = 0.12 # Assuming benchmark equity returns
    
    # Leverage the math utility already built
    fv = calculate_future_value(monthly_sip=req.monthly_amount, rate=rate, years=years, step_up_percent=0.0)
    
    return {
        "monthly_amount": req.monthly_amount,
        "assumed_cagr": rate,
        "duration_years": years,
        "total_invested": req.monthly_amount * 12 * years,
        "future_wealth_value": round(fv, 2)
    }

@router.post("/health-score")
def calculate_health_score(req: HealthQuizAnswers):
    """
    Accepts quiz answers and returns a normalized 100-point 6-axis dimensional score 
    designed to instantly populate frontend radar charts.
    """
    # 1. Liquidity (Target: 6 months of expenses)
    liquidity_score = min(100.0, (req.emergency_fund_months / 6.0) * 100.0)
    
    # 2. Protection / Insurance
    insurance_score = 0.0
    if req.has_health_insurance: insurance_score += 50.0
    if req.has_term_insurance: insurance_score += 50.0
        
    # 3. Growth Engine
    growth_score = 100.0 if req.invests_in_equity else 20.0
    
    # 4. Debt Management
    debt_score = 0.0 if req.has_high_interest_debt else 100.0
    
    # 5. Pure Savings Rate (Target: 30% of income)
    savings_score = min(100.0, (req.monthly_savings_percentage / 30.0) * 100.0) 
    
    # 6. Behavioral Discipline (Synthesized dimension)
    discipline_score = (liquidity_score + savings_score) / 2.0
    
    overall_score = sum([liquidity_score, insurance_score, growth_score, debt_score, savings_score, discipline_score]) / 6.0
    
    return {
        "overall_health_score": round(overall_score, 1),
        "radar_chart_data": [
            {"dimension": "Liquidity", "score": round(liquidity_score, 1)},
            {"dimension": "Insurance", "score": round(insurance_score, 1)},
            {"dimension": "Growth", "score": round(growth_score, 1)},
            {"dimension": "Debt Management", "score": round(debt_score, 1)},
            {"dimension": "Savings Rate", "score": round(savings_score, 1)},
            {"dimension": "Financial Discipline", "score": round(discipline_score, 1)}
        ]
    }
