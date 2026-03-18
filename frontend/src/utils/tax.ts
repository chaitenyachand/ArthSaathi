// ─── INDIAN INCOME TAX FY 2024-25 ────────────────────────────────────────────

export interface TaxInput {
  grossSalary:       number;
  basicSalary:       number;
  hraReceived:       number;
  rentPaid:          number;
  city:              "metro" | "nonmetro";
  epfEmployee:       number;   // employee share
  elssAndOther80C:   number;   // ELSS, PPF, NSC, LIC premium, children fees, etc
  section24b:        number;   // home loan interest
  nps80CCD:          number;   // 80CCD(1B) — additional NPS over 80C
  healthSelf:        number;   // 80D — self + family
  healthParents:     number;   // 80D — parents
  parentsSenior:     boolean;  // parents > 60
  professionalTax:   number;
}

export interface TaxResult {
  oldTaxable:   number;
  newTaxable:   number;
  oldTax:       number;
  newTax:       number;
  oldTaxNet:    number;   // after surcharge + cess 4%
  newTaxNet:    number;
  betterRegime: "old" | "new";
  saving:       number;
  hraExemption: number;
  sec80C:       number;
  sec80D:       number;
  sec80CCD:     number;
  missingDeductions: MissingDeduction[];
}

export interface MissingDeduction {
  section: string;
  description: string;
  maxAmount: number;
  potentialSaving: number;
}

// ─── HRA EXEMPTION ───────────────────────────────────────────────────────────
const calcHRA = (
  hraReceived: number,
  basicSalary: number,
  rentPaid: number,
  isMetro: boolean
): number => {
  const basicPct = isMetro ? 0.5 : 0.4;
  return Math.max(
    0,
    Math.min(
      hraReceived,
      basicPct * basicSalary,
      rentPaid - 0.1 * basicSalary
    )
  );
};

// ─── OLD REGIME SLAB TAX ─────────────────────────────────────────────────────
const oldRegimeTax = (taxableIncome: number): number => {
  if (taxableIncome <= 0)          return 0;
  if (taxableIncome <= 250000)     return 0;
  if (taxableIncome <= 500000)     return (taxableIncome - 250000) * 0.05;
  if (taxableIncome <= 1000000)    return 12500 + (taxableIncome - 500000) * 0.2;
  return 112500 + (taxableIncome - 1000000) * 0.3;
};

// ─── NEW REGIME SLAB TAX (FY 2024-25) ────────────────────────────────────────
const newRegimeTax = (taxableIncome: number): number => {
  // Standard deduction ₹75,000 already applied before calling
  if (taxableIncome <= 0)          return 0;
  if (taxableIncome <= 300000)     return 0;
  if (taxableIncome <= 700000)     return (taxableIncome - 300000) * 0.05;
  if (taxableIncome <= 1000000)    return 20000 + (taxableIncome - 700000) * 0.1;
  if (taxableIncome <= 1200000)    return 50000 + (taxableIncome - 1000000) * 0.15;
  if (taxableIncome <= 1500000)    return 80000 + (taxableIncome - 1200000) * 0.2;
  return 140000 + (taxableIncome - 1500000) * 0.3;
};

// ─── 87A REBATE ──────────────────────────────────────────────────────────────
const applyRebate87A = (tax: number, taxableIncome: number, regime: "old" | "new"): number => {
  const limit = regime === "old" ? 500000 : 1200000;
  const rebate = regime === "old" ? 12500 : 25000;
  if (taxableIncome <= limit) return Math.max(0, tax - rebate);
  return tax;
};

// ─── SURCHARGE + HEALTH & EDUCATION CESS 4% ──────────────────────────────────
const applyHECess = (tax: number): number => Math.round(tax * 1.04);

// ─── MAIN CALCULATION ────────────────────────────────────────────────────────
export const calculateTax = (input: TaxInput): TaxResult => {
  const isMetro = input.city === "metro";

  // Deductions (old regime)
  const hraExemption = calcHRA(input.hraReceived, input.basicSalary, input.rentPaid, isMetro);
  const sec80C       = Math.min(input.epfEmployee + input.elssAndOther80C, 150000);
  const sec80DMax    = Math.min(input.healthSelf, 25000) +
                       Math.min(input.healthParents, input.parentsSenior ? 50000 : 25000);
  const sec80D       = sec80DMax;
  const sec80CCD     = Math.min(input.nps80CCD, 50000); // additional over 80C
  const sec24b       = Math.min(input.section24b, 200000);
  const stdDedOld    = 50000;

  // Old regime taxable income
  const oldTaxable = Math.max(
    0,
    input.grossSalary
      - stdDedOld
      - hraExemption
      - sec80C
      - sec80D
      - sec80CCD
      - sec24b
      - input.professionalTax
  );

  // New regime taxable income (only standard deduction ₹75,000)
  const stdDedNew  = 75000;
  const newTaxable = Math.max(0, input.grossSalary - stdDedNew);

  // Tax before rebate
  const oldRaw = oldRegimeTax(oldTaxable);
  const newRaw = newRegimeTax(newTaxable);

  // After rebate
  const oldAfterRebate = applyRebate87A(oldRaw, oldTaxable, "old");
  const newAfterRebate = applyRebate87A(newRaw, newTaxable, "new");

  // Final (with cess)
  const oldTaxNet = applyHECess(oldAfterRebate);
  const newTaxNet = applyHECess(newAfterRebate);

  const betterRegime: "old" | "new" = oldTaxNet <= newTaxNet ? "old" : "new";
  const saving = Math.abs(oldTaxNet - newTaxNet);

  // Missing deductions
  const missingDeductions: MissingDeduction[] = [];
  const bracket = oldTaxable > 1000000 ? 0.3 : oldTaxable > 500000 ? 0.2 : 0.05;

  if (input.nps80CCD === 0) {
    missingDeductions.push({
      section: "80CCD(1B)",
      description: "NPS additional contribution not used",
      maxAmount: 50000,
      potentialSaving: Math.round(50000 * bracket * 1.04),
    });
  }

  if (input.healthParents === 0) {
    const maxParent = input.parentsSenior ? 50000 : 25000;
    missingDeductions.push({
      section: "80D (Parents)",
      description: "Health insurance for parents not claimed",
      maxAmount: maxParent,
      potentialSaving: Math.round(maxParent * bracket * 1.04),
    });
  }

  const used80C = input.epfEmployee + input.elssAndOther80C;
  if (used80C < 150000) {
    const gap = 150000 - used80C;
    missingDeductions.push({
      section: "80C",
      description: `₹${gap.toLocaleString("en-IN")} of unused 80C capacity`,
      maxAmount: gap,
      potentialSaving: Math.round(gap * bracket * 1.04),
    });
  }

  if (input.section24b === 0 && betterRegime === "old") {
    missingDeductions.push({
      section: "24(b)",
      description: "Home loan interest not declared — up to ₹2L deductible",
      maxAmount: 200000,
      potentialSaving: Math.round(200000 * bracket * 1.04),
    });
  }

  return {
    oldTaxable,
    newTaxable,
    oldTax: oldAfterRebate,
    newTax: newAfterRebate,
    oldTaxNet,
    newTaxNet,
    betterRegime,
    saving,
    hraExemption,
    sec80C,
    sec80D,
    sec80CCD,
    missingDeductions,
  };
};