from fastapi import APIRouter, File, UploadFile, HTTPException
from services.xray_service import XrayService
from services.cams_parser import CAMSParser
import logging
from io import BytesIO

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

@router.post("/test-parse")
async def test_parse_cams(file: UploadFile = File(...)):
    """
    Test endpoint to upload a CAMS PDF and see the extracted JSON transactions.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content = await file.read()
        file_stream = BytesIO(content)
        
        df = CAMSParser.parse(file_stream)
        
        if not df.empty:
            df['date'] = df['date'].dt.strftime('%Y-%m-%d')
            
        result_json = df.to_dict(orient="records")
        
        return {
            "status": "success", 
            "total_transactions": len(result_json),
            "transactions": result_json
        }
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error testing parse: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")
