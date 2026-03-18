// ─── FUTURE VALUE (SIP) ──────────────────────────────────────────────────────
// annualRate: e.g. 12 for 12%
// months: number of monthly payments
// pmt: monthly payment amount
// pv: present value of existing corpus (optional)
export const futureValue = (
  annualRate: number,
  months: number,
  pmt: number,
  pv = 0
): number => {
  const r = annualRate / 12 / 100;
  if (r === 0) return pmt * months + pv;
  const fvSIP = pmt * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const fvPV  = pv * Math.pow(1 + r, months);
  return fvSIP + fvPV;
};

// ─── SIP REQUIRED ────────────────────────────────────────────────────────────
// Given a target future corpus, returns the monthly SIP needed
export const sipRequired = (
  targetCorpus: number,
  annualRate: number,
  months: number,
  existingCorpusFV = 0
): number => {
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.max(0, (targetCorpus - existingCorpusFV) / months);
  const fvFactor = ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  return Math.max(0, (targetCorpus - existingCorpusFV) / fvFactor);
};

// ─── XIRR (Newton-Raphson) ───────────────────────────────────────────────────
// cashflows: array of amounts (negative = outflow, positive = inflow)
// dates: array of Date objects corresponding to cashflows
export const xirr = (cashflows: number[], dates: Date[]): number => {
  const yearFrac = (d: Date) =>
    (d.getTime() - dates[0].getTime()) / (365.25 * 24 * 3600 * 1000);

  let rate = 0.1;
  for (let iter = 0; iter < 200; iter++) {
    let f = 0, df = 0;
    for (let j = 0; j < cashflows.length; j++) {
      const t = yearFrac(dates[j]);
      const denom = Math.pow(1 + rate, t);
      f  += cashflows[j] / denom;
      df -= (t * cashflows[j]) / (denom * (1 + rate));
    }
    if (Math.abs(df) < 1e-10) break;
    const newRate = rate - f / df;
    if (Math.abs(newRate - rate) < 1e-8) return newRate;
    rate = newRate;
  }
  return rate;
};

// ─── RETIREMENT CORPUS (4% Safe Withdrawal Rate) ─────────────────────────────
// desiredMonthlyIncome: monthly income needed in retirement
export const retirementCorpus = (desiredMonthlyIncome: number): number =>
  (desiredMonthlyIncome * 12) / 0.04;

// ─── HUMAN LIFE VALUE ────────────────────────────────────────────────────────
// annualIncome: current annual take-home
// yearsToRetire: remaining working years
export const humanLifeValue = (
  annualIncome: number,
  yearsToRetire: number
): number => annualIncome * yearsToRetire;

// ─── GOAL FUTURE COST ────────────────────────────────────────────────────────
// todayAmount: today's cost of the goal
// inflationRate: annual inflation rate (e.g. 6 for 6%)
// years: years until goal
export const goalFutureCost = (
  todayAmount: number,
  inflationRate: number,
  years: number
): number => todayAmount * Math.pow(1 + inflationRate / 100, years);

// ─── EXPENSE RATIO DRAG ──────────────────────────────────────────────────────
// corpus: current portfolio value
// erDiff: difference in expense ratios (percentage points, e.g. 1.2)
// years: projection horizon
// expectedReturn: gross annual return %
export const expenseRatioDrag = (
  corpus: number,
  erDiff: number,
  years: number,
  expectedReturn = 12
): number => {
  const r = expectedReturn / 100;
  const rNet = r - erDiff / 100;
  const gross = corpus * Math.pow(1 + r,    years);
  const net   = corpus * Math.pow(1 + rNet, years);
  return Math.max(0, gross - net);
};

// ─── PROCRASTINATION COST PER SECOND ────────────────────────────────────────
// monthlySIP: intended SIP amount
// years: investment horizon
// annualRate: expected CAGR %
export const procrastinationPerSecond = (
  monthlySIP: number,
  years: number,
  annualRate = 12
): number => {
  const totalFV = futureValue(annualRate, years * 12, monthlySIP);
  return totalFV / (years * 365.25 * 24 * 3600);
};