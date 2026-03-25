from models.feature_models import SalaryRequest, SalaryResponse
from services.tax_calc import TaxCalc

class PayrollEngine:
    @staticmethod
    def calculate_take_home(req: SalaryRequest) -> SalaryResponse:
        gross_monthly = req.annual_ctc / 12.0
        basic_monthly = gross_monthly * (req.basic_percentage / 100.0)
        
        # EPF Deductions - standard 12% on Basic
        epf_monthly = basic_monthly * 0.12
        
        # Professional Tax (flat assumption for most Indian states)
        pt_monthly = 200.0
        
        # Income Tax Engine (New Regime inherently assumes fewer deductions)
        annual_tax = TaxCalc.calculate_new_regime(req.annual_ctc)
        tax_monthly = annual_tax / 12.0
        
        net_take_home = gross_monthly - epf_monthly - pt_monthly - tax_monthly
        
        return SalaryResponse(
            gross_monthly=round(gross_monthly, 2),
            basic_monthly=round(basic_monthly, 2),
            epf_deduction=round(epf_monthly, 2),
            pt_deduction=round(pt_monthly, 2),
            tax_deduction=round(tax_monthly, 2),
            net_take_home=round(net_take_home, 2)
        )
