from fastapi import APIRouter, File, UploadFile, HTTPException
from services.xray_service import XrayService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/xray", tags=["Portfolio X-Ray"])

@router.post("/analyze")
async def analyze_portfolio(file: UploadFile = File(...)):
    """
    Analyzes an uploaded mutual fund statement PDF (CAMS) strictly in memory 
    and returns comprehensive portfolio X-Ray metrics like XIRR and commissions lost.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        result = await XrayService.analyze_portfolio(file)
        if "error" in result:
            raise HTTPException(status_code=422, detail=result["error"])
            
        return result
    except ValueError as e:
        logger.error(f"Validation error during X-Ray: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during X-Ray: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error processing the portfolio")
