from typing import Dict, Any

class TaxCalc:
    """
    Tax Rules Engine providing strict mathematical comparison of the Old vs. New Tax regimes.
    """
    
    @staticmethod
    def calculate_new_regime(base_salary: float) -> float:
        # Standard deduction (75000 correctly applied for FY 24-25 in the new regime)
        taxable_income = max(0.0, base_salary - 75000.0)
        
        if taxable_income <= 700000.0:
            return 0.0
            
        tax = 0.0
        # Slabs: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)
        if taxable_income > 1500000:
            tax += (taxable_income - 1500000) * 0.30
            taxable_income = 1500000
        if taxable_income > 1200000:
            tax += (taxable_income - 1200000) * 0.20
            taxable_income = 1200000
        if taxable_income > 1000000:
            tax += (taxable_income - 1000000) * 0.15
            taxable_income = 1000000
        if taxable_income > 700000:
            tax += (taxable_income - 700000) * 0.10
            taxable_income = 700000
        if taxable_income > 300000:
            tax += (taxable_income - 300000) * 0.05
            
        return tax * 1.04

    @staticmethod
    def calculate_old_regime(base_salary: float, hra: float, home_loan: float, 
                             parent_health: float, nps: float, basic_80c: float) -> float:
        # Incorporates standard deduction plus specified inputs
        total_deduction = 50000.0 + hra + home_loan + parent_health + nps + basic_80c
        taxable_income = max(0.0, base_salary - total_deduction)
        
        if taxable_income <= 500000.0:
            return 0.0
            
        tax = 0.0
        # Slabs: 0-2.5L (0%), 2.5-5L (5%), 5-10L (20%), >10L (30%)
        if taxable_income > 1000000:
            tax += (taxable_income - 1000000) * 0.30
            taxable_income = 1000000
        if taxable_income > 500000:
            tax += (taxable_income - 500000) * 0.20
            taxable_income = 500000
        if taxable_income > 250000:
            tax += (taxable_income - 250000) * 0.05
            
        return tax * 1.04

    @staticmethod
    def compare_regimes(base_salary: float, hra: float = 0.0, home_loan: float = 0.0, 
                       parent_health: float = 0.0, nps: float = 0.0, basic_80c: float = 0.0) -> Dict[str, Any]:
        """
        Takes inputs like HRA, home loan interest, parent's health insurance, and NPS contributions, 
        and returns a strict mathematical comparison of the Old vs. New Tax regimes.
        """
        new_tax = TaxCalc.calculate_new_regime(base_salary)
        old_tax = TaxCalc.calculate_old_regime(base_salary, hra, home_loan, parent_health, nps, basic_80c)
        
        recommended = "New Regime" if new_tax <= old_tax else "Old Regime"
        savings = abs(new_tax - old_tax)
        
        return {
            "gross_salary": base_salary,
            "deductions_used": {
                "HRA": hra,
                "Section_24_HomeLoan": home_loan,
                "Section_80D_Parents": parent_health,
                "Section_80CCD_1B_NPS": nps,
                "Section_80C": basic_80c
            },
            "new_regime_tax": round(new_tax, 2),
            "old_regime_tax": round(old_tax, 2),
            "recommended_regime": recommended,
            "mathematical_tax_savings": round(savings, 2)
        }
