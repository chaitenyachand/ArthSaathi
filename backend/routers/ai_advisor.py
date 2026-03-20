from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_agent_service import AIAgentService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ai", tags=["AI Advisor"])

class TipAnalysisRequest(BaseModel):
    tip_text: str
    nse_volume_data: str

class LifeEventRequest(BaseModel):
    event_description: str
    risk_profile: str

@router.post("/analyze-tip")
async def analyze_whatsapp_tip(req: TipAnalysisRequest):
    """
    Acts as a SEBI-registered forensic analyst to grade a WhatsApp stock tip.
    Highlights red flags and assesses danger automatically.
    """
    if not req.tip_text.strip():
        raise HTTPException(status_code=400, detail="Tip text cannot be empty.")
        
    try:
        return await AIAgentService.analyze_whatsapp_tip(req.tip_text, req.nse_volume_data)
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        logger.error(f"Failed to analyze tip: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error contacting the AI Service.")

@router.post("/plan-life-event")
async def generate_life_event_plan(req: LifeEventRequest):
    """
    Generates a localized Indian financial action plan with specific SIP adjustments and costs
    based on the investor's risk profile and upcoming life event.
    """
    if not req.event_description.strip():
        raise HTTPException(status_code=400, detail="Event description cannot be empty.")
        
    try:
        return await AIAgentService.generate_life_event_plan(req.event_description, req.risk_profile)
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        logger.error(f"Failed to plan life event: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error contacting the AI Service.")
