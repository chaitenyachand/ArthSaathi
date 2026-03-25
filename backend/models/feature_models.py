from pydantic import BaseModel
from typing import List, Dict

class BiasScoreItem(BaseModel):
    bias: str
    score: int

class BiasAdaptationItem(BaseModel):
    bias: str
    adaptation: str

class BiasResultData(BaseModel):
    scores: List[BiasScoreItem]
    dominant: str
    adaptations: List[BiasAdaptationItem]

class BiasRequest(BaseModel):
    answers: List[int]

class SalaryRequest(BaseModel):
    annual_ctc: float
    basic_percentage: float = 50.0
    is_metro: bool = True

class SalaryResponse(BaseModel):
    gross_monthly: float
    basic_monthly: float
    epf_deduction: float
    pt_deduction: float
    tax_deduction: float
    net_take_home: float

class OpportunityCostRequest(BaseModel):
    monthly_sip: float
    current_age: int
    retirement_age: int = 60
    delay_years: int = 5
    expected_cagr: float = 0.12

class OpportunityCostRoadmapPoint(BaseModel):
    age: float
    immediate_corpus: float
    delayed_corpus: float

class OpportunityCostResponse(BaseModel):
    total_saved_uninvested: float
    total_compounding_lost: float
    final_immediate_corpus: float
    final_delayed_corpus: float
    roadmap: List[OpportunityCostRoadmapPoint]

class CouplesPerson(BaseModel):
    name: str = "Partner"
    current_corpus: float
    sip: float
    expected_cagr: float

class CouplesFireRequest(BaseModel):
    person_a: CouplesPerson
    person_b: CouplesPerson
    joint_target_corpus: float
    joint_monthly_expenses: float

class CouplesRoadmapPoint(BaseModel):
    year: int
    person_a_corpus: float
    person_b_corpus: float
    combined_corpus: float
    target: float

class CouplesFireResponse(BaseModel):
    years_to_fire: float
    person_a_final: float
    person_b_final: float
    total_final: float
    roadmap: List[CouplesRoadmapPoint]

class HealthScoreRequest(BaseModel):
    monthly_income: float
    monthly_rent_emi: float
    monthly_sip: float
    emergency_fund_balance: float
    total_debt: float

class HealthBreakdown(BaseModel):
    rule: str
    status: str
    points_deducted: int

class HealthScoreResponse(BaseModel):
    score: int
    grade: str
    breakdown: List[HealthBreakdown]

class MirrorRequest(BaseModel):
    income: int
    investments: int
    dumb_purchases: str

class MirrorResponse(BaseModel):
    roast: str
    
class BadAdviceRequest(BaseModel):
    raw_statement: str

class BadAdviceResponse(BaseModel):
    fallacy_detected: str
    mathematical_truth: str
    danger_level: int
