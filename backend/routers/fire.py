from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.fire_calc import FIRECalc
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/fire", tags=["FIRE Planner"])

class FireSimulationRequest(BaseModel):
    current_age: float
    target_age: float
    current_corpus: float
    target_corpus: float
    expected_cagr: float
    inflation_rate: float

@router.post("/simulate")
async def simulate_fire_path(req: FireSimulationRequest):
    """
    Simulates the FIRE mathematical path, returning a chartable month-by-month roadmap 
    and the exact required SIP to hit financial independence goals.
    """
    if req.current_age >= req.target_age:
        raise HTTPException(status_code=400, detail="Target retirement age must be greater than current age.")
    if req.current_corpus < 0 or req.target_corpus <= 0:
        raise HTTPException(status_code=400, detail="Target corpus must be greater than 0, current corpus cannot be negative.")
        
    try:
        return FIRECalc.calculate_fire_roadmap(
            current_age=req.current_age,
            target_age=req.target_age,
            current_corpus=req.current_corpus,
            target_corpus=req.target_corpus,
            expected_cagr=req.expected_cagr,
            inflation_rate=req.inflation_rate
        )
    except Exception as e:
        logger.error(f"Error executing FIRE simulation: {e}")
        raise HTTPException(status_code=500, detail=str(e))
