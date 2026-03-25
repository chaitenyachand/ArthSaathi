from fastapi import APIRouter
from models.pdf_models import TaxInputRequest
from models.feature_models import HealthScoreRequest
from services.tax_calc import TaxCalc
from services.fire_calc import FIRECalc
from services.scoring_engine import ScoringEngine
from typing import Dict, Any

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard Aggregator"])

@router.get("/summary")
async def get_dashboard_summary() -> Dict[str, Any]:
    """
    Acts as a central database facade. Computes core algorithms silently in the background
    using a mocked logged-in user profile, and returns a massive synchronized state payload.
    """
    # 1. Tax Data execution
    tax_req = TaxInputRequest(base_salary=2500000, hra=200000, home_loan=150000, parent_health=50000, nps=50000, basic_80c=150000)
    tax_data = TaxCalc.compare_regimes(tax_req)

    # 2. FIRE Data execution
    fire_data = FIRECalc.calculate_fire_roadmap(
        current_age=30,
        target_age=55,
        current_corpus=1500000,
        target_corpus=30000000,
        expected_cagr=0.12,
        inflation_rate=0.06,
        life_events=[]
    )
    
    # 3. Health Engine execution
    health_req = HealthScoreRequest(
        monthly_income=208000,
        monthly_rent_emi=40000,
        monthly_sip=30000,
        emergency_fund_balance=500000,
        total_debt=1200000
    )
    health_data = ScoringEngine.calculate_global_health(health_req)

    return {
        "user_profile": {
            "name": "Arjun",
            "current_corpus": 1500000
        },
        "tax_summary": {
            "regime": tax_data.recommended_regime,
            "savings_generated": tax_data.mathematical_tax_savings,
            "new_regime_liability": tax_data.new_regime_tax,
            "old_regime_liability": tax_data.old_regime_tax
        },
        "fire_summary": {
            "required_sip": fire_data["summary"]["required_monthly_sip"],
            "target_corpus": fire_data["summary"]["future_target_corpus"]
        },
        "health_summary": {
            "score": health_data.score,
            "grade": health_data.grade
        }
    }
