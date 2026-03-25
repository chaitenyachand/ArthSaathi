import scipy.optimize
import numpy as np
from datetime import datetime, date
from typing import List, Union

def calculate_xirr(dates: List[Union[datetime, date]], amounts: List[float], guess: float = 0.1) -> float:
    """
    Calculate the Extended Internal Rate of Return (XIRR).
    
    Args:
        dates: List of datetime or date objects corresponding to the cash flows.
        amounts: List of cash flows (negative for investments, positive for returns).
        guess: Initial guess for the rate of return (default 0.1 or 10%).
        
    Returns:
        float: The XIRR value as a decimal (e.g., 0.15 for 15%).
    """
    if len(dates) != len(amounts):
        raise ValueError("Dates and amounts must have the same length")
    
    # XIRR is only defined if positive and negative cash flows exist
    if sum([1 for a in amounts if a > 0]) == 0 or sum([1 for a in amounts if a < 0]) == 0:
        return 0.0

    # Convert all dates to standard date objects to simplify math
    norm_dates = np.array([d.date() if isinstance(d, datetime) else d for d in dates])
    d0 = norm_dates[0]
    
    # Calculate years from the first date using 365.25 days per year for leap year handling
    years = np.array([(d - d0).days / 365.25 for d in norm_dates])
    amounts_arr = np.array(amounts)

    def xnpv(rate):
        if rate <= -1.0:
            return float('inf')  # Return infinity for invalid rates to push solver back
        return np.sum(amounts_arr / ((1 + rate) ** years))

    try:
        # Newton-Raphson method usually converges quickly
        res = scipy.optimize.newton(xnpv, x0=guess, maxiter=5000)
        return float(res)
    except (RuntimeError, OverflowError):
        # Fallback to Brent's method with bounds if Newton fails to converge
        try:
            res = scipy.optimize.brentq(xnpv, -0.99, 10.0, maxiter=5000)
            return float(res)
        except ValueError:
            # Root not found in the interval
            return 0.0

def calculate_cagr(start_value: float, end_value: float, years: float) -> float:
    """
    Calculate the Compound Annual Growth Rate (CAGR).
    
    Args:
        start_value: Initial investment value (must be > 0).
        end_value: Final investment value.
        years: Time period in years (must be > 0).
        
    Returns:
        float: The CAGR as a decimal.
    """
    if start_value <= 0:
        raise ValueError("Start value must be positive for CAGR")
    if years <= 0:
        raise ValueError("Years must be positive")
        
    return float((end_value / start_value) ** (1 / years) - 1)

def calculate_future_value(monthly_sip: float, rate: float, years: int, step_up_percent: float = 0.0) -> float:
    """
    Calculate the future value of a SIP factoring in an annual step-up percentage.
    Investments are assumed to be made at the beginning of each month.
    
    Args:
        monthly_sip: The starting monthly SIP amount.
        rate: Annual expected rate of return (e.g., 0.12 for 12%).
        years: Investment duration in years.
        step_up_percent: Annual step-up increment as a decimal (default 0.0).
        
    Returns:
        float: Projected future value corpus.
    """
    if years < 0:
        raise ValueError("Years cannot be negative")
        
    monthly_rate = rate / 12
    total_months = years * 12
    future_value = 0.0
    
    current_sip = monthly_sip
    
    for month in range(1, total_months + 1):
        # Beginning of month compounding: first month compounds for `total_months`, last month for 1 month.
        future_value += current_sip * ((1 + monthly_rate) ** (total_months - month + 1))
        
        # Step up the SIP amount completely after every 12 months
        if month % 12 == 0 and month != total_months:
            current_sip *= (1 + step_up_percent)
            
    return future_value

def procrastination_cost_per_second(monthly_sip: float, years: int, rate: float) -> float:
    """
    Calculate exactly how much future wealth is lost per second of delay.
    Money "tomorrow" vs money "today" essentially loses 1 day of compound interest 
    at the tail end of the compounding period.
    
    Args:
        monthly_sip: The intended monthly SIP amount.
        years: Expected investment duration in years.
        rate: Expected annual rate of return.
        
    Returns:
        float: Absolute loss in future value per second of delay.
    """
    fv_now = calculate_future_value(monthly_sip, rate, years)
    
    # Calculate equivalent daily compounding rate
    daily_rate = (1 + rate) ** (1 / 365.25) - 1
    
    # 1 day of delay translates to missing 1 day of interest on the final corpus
    cost_per_day = fv_now * daily_rate
    
    # Divide by seconds in a day (24 * 60 * 60 = 86400)
    return cost_per_day / 86400.0
