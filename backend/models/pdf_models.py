from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class CamsTransaction(BaseModel):
    """Represents a single mutual fund transaction from a CAMS statement."""
    date: date
    amount: float
    units: float
    nav: float
    scheme_name: Optional[str] = None
    transaction_type: Optional[str] = None

class CamsData(BaseModel):
    """Aggregated portfolio data extracted from a CAMS PDF statement."""
    investor_name: Optional[str] = None
    pan: Optional[str] = None
    transactions: List[CamsTransaction] = Field(default_factory=list)

class Form16Data(BaseModel):
    """Key financial indicators extracted from an employee Form 16."""
    employee_name: Optional[str] = None
    pan: Optional[str] = None
    employer_name: Optional[str] = None
    gross_salary: float = 0.0
    deduction_80c: float = 0.0
    deduction_80d: float = 0.0
    deduction_80ccd1b: float = 0.0
    total_tax_paid: float = 0.0
