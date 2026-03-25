from fastapi import APIRouter
from models.feature_models import BiasRequest, BiasResultData
from services.behavioral_engine import BehavioralEngine

router = APIRouter()

@router.post("/bias-fingerprint", response_model=BiasResultData)
async def calculate_bias_fingerprint(req: BiasRequest):
    return BehavioralEngine.calculate_fingerprint(req.answers)
