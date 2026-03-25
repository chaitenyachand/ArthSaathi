from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from services.tax_wizard_service import TaxWizardService
from services.tax_calc import TaxCalc
import logging
from io import BytesIO

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/tax", tags=["Tax Wizard"])

@router.post("/upload-form16")
async def upload_form16(file: UploadFile = File(...)):
    """
    Parses a Form 16 PDF and automatically runs the calculation comparison.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content = await file.read()
        file_stream = BytesIO(content)
        parsed_data = TaxWizardService.parse_form16(file_stream)
        
        # Calculate optimal regime based on the basic extracted data
        comparison = TaxCalc.compare_regimes(
            base_salary=parsed_data.get("gross_salary", 0.0),
            basic_80c=parsed_data.get("deduction_80c", 0.0),
            parent_health=parsed_data.get("deduction_80d", 0.0),
            nps=parsed_data.get("deduction_80ccd1b", 0.0)
        )
        
        comparison["extracted_tds"] = parsed_data.get("tds_deducted", 0.0)
        return comparison
    except Exception as e:
        logger.error(f"Error processing Form16: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error processing Form 16")


class TaxInputRequest(BaseModel):
    base_salary: float
    hra: float = 0.0
    home_loan: float = 0.0
    parent_health: float = 0.0
    nps: float = 0.0
    basic_80c: float = 0.0

@router.post("/compare")
async def compare_regimes(req: TaxInputRequest):
    """
    Strict mathematical comparison of the Old vs. New Tax regimes using standard tax parameters.
    """
    if req.base_salary <= 0:
        raise HTTPException(status_code=400, detail="Base salary must be greater than 0.")
        
    return TaxCalc.compare_regimes(
        req.base_salary, req.hra, req.home_loan, req.parent_health, req.nps, req.basic_80c
    )
