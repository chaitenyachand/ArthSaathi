from fastapi import APIRouter, HTTPException
from models.feature_models import HealthScoreRequest, HealthScoreResponse
from services.scoring_engine import ScoringEngine
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/health", tags=["Health Diagnostics"])

@router.post("/score", response_model=HealthScoreResponse)
async def generate_health_score(req: HealthScoreRequest):
    """Generates an absolute 0-100 systemic health score based on mathematical deductions."""
    try:
        return ScoringEngine.calculate_global_health(req)
    except Exception as e:
        logger.error(f"Error resolving Health Scoring logic: {e}")
        raise HTTPException(status_code=500, detail=str(e))
