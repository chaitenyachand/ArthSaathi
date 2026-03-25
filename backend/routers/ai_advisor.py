from fastapi import APIRouter, HTTPException
from models.pdf_models import TipAnalysisRequest, TipAnalysisResponse, PortfolioRebalanceRequest, PortfolioRebalanceResponse
from models.feature_models import MirrorRequest, MirrorResponse, BadAdviceRequest, BadAdviceResponse
from agents.tip_agent import TipAgent
from agents.portfolio_agent import PortfolioAgent
from agents.mirror_agent import MirrorAgent
from agents.debunker_agent import DebunkerAgent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ai-advisor", tags=["AI Advisor"])

@router.post("/analyze-tip", response_model=TipAnalysisResponse)
async def analyze_whatsapp_tip(req: TipAnalysisRequest):
    """
    Sends raw tip metadata to Claude 3 Haiku for SEBI-registered forensic analysis.
    Returns a strict JSON grade indicating validity and red flags.
    """
    try:
        result = await TipAgent.analyze_whatsapp_tip(req.raw_tip)
        return result
    except Exception as e:
        logger.error(f"Error in Tip Analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze stock tip via Anthropic engine.")

@router.post("/rebalance-plan", response_model=PortfolioRebalanceResponse)
async def generate_portfolio_plan(req: PortfolioRebalanceRequest):
    """
    Consumes complex portfolio metrics (XIRR, Jaccard Overlap, Expenses) to formulate 
    a highly targeted plain-English rebalancing plan via Claude.
    """
    try:
        plan_text = await PortfolioAgent.generate_rebalancing_plan(
            xirr=req.xirr,
            overlap_data=req.overlap_data,
            expense_drag=req.expense_drag
        )
        return {"rebalancing_plan_text": plan_text}
    except Exception as e:
        logger.error(f"Error in Portfolio Plan Generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI advisory rebalancing plan.")

@router.post("/the-mirror", response_model=MirrorResponse)
async def activate_the_mirror(req: MirrorRequest):
    """Triggers the brutal Anthropic auditor."""
    try:
        result = await MirrorAgent.generate_roast(req.income, req.investments, req.dumb_purchases)
        return result
    except Exception as e:
        logger.error(f"Error in Mirror Agent: {e}")
        raise HTTPException(status_code=500, detail="Failed to invoke the Mirror.")

@router.post("/debunk-advice", response_model=BadAdviceResponse)
async def analyze_bad_advice(req: BadAdviceRequest):
    """Triggers the Finfluencer myth-buster engine."""
    try:
        return await DebunkerAgent.debunk_statement(req.raw_statement)
    except Exception as e:
        logger.error(f"Error in Debunker Agent: {e}")
        raise HTTPException(status_code=500, detail="Failed to invoke the Debunker.")
