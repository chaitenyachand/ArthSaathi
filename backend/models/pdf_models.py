from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import date

class CamsTransaction(BaseModel):
    date: date
    amount: float
    units: float
    nav: float
    scheme_name: Optional[str] = None
    transaction_type: str

class CamsData(BaseModel):
    pan: str = ""
    transactions: List[CamsTransaction] = Field(default_factory=list)

class Form16Data(BaseModel):
    """Fallback object for Form16 Extraction validation."""
    pan: str = ""
    gross_salary: float = 0.0
    tds_deducted: float = 0.0
    total_tax_paid: float = 0.0
    deduction_80c: float = 0.0
    deduction_80d: float = 0.0
    deduction_80ccd1b: float = 0.0

class TaxInputRequest(BaseModel):
    """Incoming request payload for Tax comparison calculations."""
    base_salary: float = Field(..., description="Total Gross Salary Package", gt=0)
    hra: float = 0.0
    home_loan: float = 0.0
    parent_health: float = 0.0
    nps: float = 0.0
    basic_80c: float = 0.0

class TaxComparisonResponse(BaseModel):
    """Strictly typed response for the Tax Rules Engine."""
    gross_salary: float
    deductions_used: Dict[str, float]
    new_regime_tax: float
    old_regime_tax: float
    recommended_regime: str
    mathematical_tax_savings: float
    extracted_tds: Optional[float] = None
class LifeEvent(BaseModel):
    name: str = "Event"
    cost: float
    years_from_now: float

class FireSimulationRequest(BaseModel):
    """Input parameters for simulating a comprehensive roadmap."""
    current_age: float = Field(..., gt=0)
    target_age: float = Field(..., gt=0)
    current_corpus: float = Field(..., ge=0)
    target_corpus: float = Field(..., gt=0)
    expected_cagr: float
    inflation_rate: float
    life_events: List[LifeEvent] = []

class FireSimulationResponse(BaseModel):
    """JSON roadmap payload containing mathematical projections for front-end charts."""
    summary: Dict[str, Any]
    roadmap: List[Dict[str, Any]]

class TipAnalysisRequest(BaseModel):
    raw_tip: str = Field(..., min_length=10)

class TipAnalysisResponse(BaseModel):
    """Strict evaluation grade parameters outputted by Claude 3 AI."""
    grade: str
    analysis: str
    red_flags: List[str]

class PortfolioRebalanceRequest(BaseModel):
    xirr: float
    overlap_data: Dict[str, Any]
    expense_drag: float

class PortfolioRebalanceResponse(BaseModel):
    rebalancing_plan_text: str
