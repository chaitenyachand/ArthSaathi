from fastapi import APIRouter, HTTPException
from models.pdf_models import FireSimulationRequest, FireSimulationResponse
from models.feature_models import SalaryRequest, SalaryResponse, OpportunityCostRequest, OpportunityCostResponse, CouplesFireRequest, CouplesFireResponse
from services.fire_calc import FIRECalc
from services.payroll_engine import PayrollEngine
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/calculators", tags=["Financial Calculators"])

@router.post("/fire-simulate", response_model=FireSimulationResponse)
async def simulate_fire_path(req: FireSimulationRequest):
    """
    Simulates the FIRE mathematical path. Returns a dynamically chartable month-by-month roadmap 
    and the exact required SIP configuration utilizing Annuity Due equations. 
    """
    if req.current_age >= req.target_age:
        raise HTTPException(status_code=400, detail="Target retirement age must securely exceed current age.")
    if req.current_corpus < 0 or req.target_corpus <= 0:
        raise HTTPException(status_code=400, detail="Strictly format valid historical and target goals.")
        
    try:
        return FIRECalc.calculate_fire_roadmap(
            current_age=req.current_age,
            target_age=req.target_age,
            current_corpus=req.current_corpus,
            target_corpus=req.target_corpus,
            expected_cagr=req.expected_cagr,
            inflation_rate=req.inflation_rate,
            life_events=[e.dict() for e in req.life_events]
        )
    except Exception as e:
        logger.error(f"Error resolving FIRE engine logic: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/salary-translator", response_model=SalaryResponse)
async def translate_salary(req: SalaryRequest):
    """Calculates granular Indian monthly payroll deductions."""
    try:
        return PayrollEngine.calculate_take_home(req)
    except Exception as e:
        logger.error(f"Error resolving Payroll engine logic: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/procrastination-clock", response_model=OpportunityCostResponse)
async def analyze_opportunity_cost(req: OpportunityCostRequest):
    """Calculates massive exponential divergence caused by identical SIPs starting at different times."""
    try:
        return FIRECalc.calculate_cost_of_delay(req.dict())
    except Exception as e:
        logger.error(f"Error resolving Procrastination Engine logic: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/couples-planner", response_model=CouplesFireResponse)
async def analyze_couples_portfolio(req: CouplesFireRequest):
    """Calculates dynamically intersecting portfolios with different growth vectors."""
    try:
        return FIRECalc.simulate_joint_portfolio(req.dict())
    except Exception as e:
        logger.error(f"Error resolving Couples Engine logic: {e}")
        raise HTTPException(status_code=500, detail=str(e))
