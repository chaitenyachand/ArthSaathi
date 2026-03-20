from models.pdf_models import Form16Data
from typing import Dict, Any

class TaxWizardService:
    """
    Handles highly accurate tax computations strictly adhering to FY 2024-25 Tax Slabs.
    Provides actionable deduction guidance and couple's tax optimization formulas.
    """

    @staticmethod
    def calculate_tax_new_regime(gross_salary: float) -> float:
        """
        FY 2024-25 New Regime Tax Slabs:
        0 - 3L: Nil
        3 - 7L: 5%
        7 - 10L: 10%
        10 - 12L: 15%
        12 - 15L: 20%
        > 15L: 30%
        Standard Deduction: 75,000
        Rebate 87A: Up to 7L taxable income is perfectly tax-free.
        """
        taxable_income = max(0.0, gross_salary - 75000.0)
        
        if taxable_income <= 700000.0:
            return 0.0  # Full rebate under 87A
            
        tax = 0.0
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
            
        # 4% Health and Education Cess
        return tax * 1.04

    @staticmethod
    def calculate_tax_old_regime(gross_salary: float, total_deductions: float) -> float:
        """
        FY 2024-25 Old Regime Tax Slabs:
        0 - 2.5L: Nil
        2.5 - 5L: 5%
        5 - 10L: 20%
        > 10L: 30%
        Standard Deduction: 50,000
        Rebate 87A: Up to 5L taxable income is perfectly tax-free.
        """
        taxable_income = max(0.0, gross_salary - 50000.0 - total_deductions)
        
        if taxable_income <= 500000.0:
            return 0.0  # Full rebate under 87A
            
        tax = 0.0
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
    def calculate_optimal_tax(data: Form16Data) -> Dict[str, Any]:
        """
        Computes tax liability under BOTH regimes and flags missing allowable deductions.
        Returns structurally clean JSON analysis for the frontend.
        """
        gross_salary = data.gross_salary
        
        # Aggregate claimed deductions that are valid under the Old Regime
        deductions_old = data.deduction_80c + data.deduction_80d + data.deduction_80ccd1b
        
        tax_new = TaxWizardService.calculate_tax_new_regime(gross_salary)
        tax_old = TaxWizardService.calculate_tax_old_regime(gross_salary, deductions_old)
        
        recommended_regime = "New Regime" if tax_new <= tax_old else "Old Regime"
        savings = abs(tax_new - tax_old)
        
        recommendations = []
        if data.deduction_80c < 150000.0:
            shortfall = 150000.0 - data.deduction_80c
            recommendations.append(f"Section 80C: You have ₹{shortfall:,.2f} unused limit. Consider Equity Linked Savings Schemes (ELSS) or PPF to maximize it.")
        
        if data.deduction_80ccd1b <= 0.0:
            recommendations.append("Section 80CCD(1B): You have ₹50,000 unused limit. Investing ₹50k in Tier 1 NPS can save additional guaranteed tax under the Old Regime.")
            
        if data.deduction_80d < 25000.0:
            recommendations.append("Section 80D: Consider optimizing health insurance for yourself or your parents to maximize deductions up to ₹25,000 / ₹50,000.")

        return {
            "gross_salary": gross_salary,
            "total_deductions_claimed": deductions_old,
            "tax_new_regime": round(tax_new, 2),
            "tax_old_regime": round(tax_old, 2),
            "recommended_regime": recommended_regime,
            "tax_saved_by_recommendation": round(savings, 2),
            "actionable_insights": recommendations
        }

    @staticmethod
    def optimize_joint_hra(salary_A: float, salary_B: float, joint_rent: float) -> Dict[str, Any]:
        """
        Calculates the mathematically optimal split of rent declaration between two partners 
        to minimize combined household tax under the old regime (HRA operates heavily in Old Regime).
        Simulates a gradient check over 0% to 100% distribution to locate global minima.
        """
        def calculate_standalone_tax(gross, rent_declared):
            # Mathematical assumptions purely for baseline estimation
            basic = gross * 0.5
            hra_received = basic * 0.5
            # HRA Exemption logic: Least of Rent - 10% Basic, 40% Basic, HRA Rx
            hra_exemption = max(0.0, min(hra_received, basic * 0.4, rent_declared - (0.1 * basic)))
            return TaxWizardService.calculate_tax_old_regime(gross, hra_exemption)

        best_split_A = 0.0
        best_split_B = joint_rent
        min_joint_tax = float('inf')
        
        # Simulate an iterative fractional sweep across 100 splits
        for i in range(101):
            rent_A = joint_rent * (i / 100.0)
            rent_B = joint_rent - rent_A
            
            tax_A = calculate_standalone_tax(salary_A, rent_A)
            tax_B = calculate_standalone_tax(salary_B, rent_B)
            
            total_tax = tax_A + tax_B
            if total_tax < min_joint_tax:
                min_joint_tax = total_tax
                best_split_A = rent_A
                best_split_B = rent_B
                
        # Calculate standard mathematically ignorant default (50/50)
        base_tax_A = calculate_standalone_tax(salary_A, joint_rent * 0.5)
        base_tax_B = calculate_standalone_tax(salary_B, joint_rent * 0.5)
        base_joint = base_tax_A + base_tax_B
        
        return {
            "joint_rent": round(joint_rent, 2),
            "optimal_rent_A_declaration": round(best_split_A, 2),
            "optimal_rent_B_declaration": round(best_split_B, 2),
            "minimized_joint_tax": round(min_joint_tax, 2),
            "tax_saved_vs_50_50_split": round(base_joint - min_joint_tax, 2)
        }
