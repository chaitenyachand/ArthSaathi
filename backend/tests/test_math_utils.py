import pytest
from datetime import datetime, date
from math import isclose
from utils.math_utils import (
    calculate_xirr,
    calculate_cagr,
    calculate_future_value,
    procrastination_cost_per_second
)

def test_calculate_xirr():
    # Example: Invest 10k twice, return 25k in year 3.
    dates = [date(2020, 1, 1), date(2021, 1, 1), date(2022, 1, 1)]
    amounts = [-10000, -10000, 25000]
    
    xirr = calculate_xirr(dates, amounts)
    # Roots for (1+r)^2 + (1+r) - 2.5 = 0 yield r ~ 0.1583
    assert isclose(xirr, 0.1583, abs_tol=0.01)

def test_calculate_xirr_edge_cases():
    dates = [date(2020, 1, 1), date(2021, 1, 1)]
    
    # Only investments
    assert calculate_xirr(dates, [-100, -100]) == 0.0
    
    # Only returns
    assert calculate_xirr(dates, [100, 100]) == 0.0
    
    # Invalid lengths
    with pytest.raises(ValueError):
        calculate_xirr(dates, [-100])

def test_calculate_cagr():
    # Doubling in 5 years: ~ 14.87%
    assert isclose(calculate_cagr(100, 200, 5), 0.1487, abs_tol=0.001)
    
    # Edge cases
    with pytest.raises(ValueError):
        calculate_cagr(-100, 200, 5)
        
    with pytest.raises(ValueError):
        calculate_cagr(100, 200, -5)

def test_calculate_future_value_no_step_up():
    # Standard formula expectation:
    # 10,000 P.M. @ 12% p.a. for 10 years (120 months)
    fv = calculate_future_value(monthly_sip=10000, rate=0.12, years=10, step_up_percent=0.0)
    
    # Verification using mathematical series formula for beginning-of-month payments
    # P * [((1+r)^n - 1) / r] * (1+r)
    # 10000 * [((1.01)^120 - 1) / 0.01] * 1.01 = 2323390.81
    assert isclose(fv, 2323390.81, abs_tol=10.0)

def test_calculate_future_value_with_step_up():
    fv_base = calculate_future_value(10000, 0.12, 10, 0.0)
    fv_stepped = calculate_future_value(10000, 0.12, 10, 0.10)
    
    # With 10% step up, the total corpus should logically be significantly higher
    assert fv_stepped > fv_base
    
    # Evaluate 2 years manually
    # Year 1 (10000 * 12 compounding for various amounts based on months)
    # Year 2 (11000 * 12 compounding for various amounts) 
    fv_2_yr_stepped = calculate_future_value(10000, 0.12, 2, 0.10)
    
    # Y1 corpus at end of Y2: (10000 * ((1.01^12 - 1) / 0.01) * 1.01) * 1.01^12
    # Y2 corpus at end of Y2: 11000 * ((1.01^12 - 1) / 0.01) * 1.01
    y1_part = 10000 * (((1.01**12 - 1) / 0.01) * 1.01) * (1.01**12)
    y2_part = 11000 * (((1.01**12 - 1) / 0.01) * 1.01)
    manual_fv_2_yr = y1_part + y2_part
    
    assert isclose(fv_2_yr_stepped, manual_fv_2_yr, abs_tol=10.0)

def test_procrastination_cost():
    # Testing logic cost of delay per second 
    # For a large corpus, delaying 1 second should cost >0 
    cost_ps = procrastination_cost_per_second(10000, 10, 0.12)
    
    assert cost_ps > 0.0
    
    # Roughly: FV = 2323390.81
    # Daily rate = (1.12)^(1/365.25) - 1 = 0.000311
    # Cost per day = ~ 723
    # Cost per second = ~ 0.0083
    assert isclose(cost_ps, 0.0083, abs_tol=0.001)
