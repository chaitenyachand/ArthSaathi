from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from services.tax_wizard_service import TaxWizardService
from services.pdf_parser_service import PDFParserService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/tax", tags=["Tax Wizard"])

@router.post("/analyze-form16")
async def analyze_form16(file: UploadFile = File(...)):
    """
    Analyzes an uploaded Form 16 PDF to extract salary data in-memory, 
    calculates optimal tax regime, and spots missing deductions computationally.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        data = await PDFParserService.parse_form16(file)
        if data.gross_salary <= 0:
            raise ValueError("Could not extract a valid Gross Salary from this document.")
            
        result = TaxWizardService.calculate_optimal_tax(data)
        
        # Append base details from memory read
        result["extracted_pan"] = data.pan
        result["extracted_deductions"] = {
            "80C": data.deduction_80c,
            "80D": data.deduction_80d,
            "80CCD(1B)": data.deduction_80ccd1b
        }
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error analyzing form16: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error processing Form 16")


class JointHraRequest(BaseModel):
    salary_a: float
    salary_b: float
    joint_rent: float

@router.post("/optimize-hra")
async def optimize_hra(req: JointHraRequest):
    """
    Calculates the mathematically optimal split of rent declaration between two partners.
    Pass in standard floats (no strings required).
    """
    if req.salary_a <= 0 or req.salary_b <= 0 or req.joint_rent <= 0:
        raise HTTPException(status_code=400, detail="All inputs must strictly be greater than 0.")
        
    return TaxWizardService.optimize_joint_hra(req.salary_a, req.salary_b, req.joint_rent)
