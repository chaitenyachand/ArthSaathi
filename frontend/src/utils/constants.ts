// ─── THEME TOKENS ────────────────────────────────────────────────────────────
// Exact match to ArthSaathiLanding.jsx color system
export const COLORS = {
  bg:          "#0A0A0A",
  bgSection:   "#0F0F0F",
  bgCard:      "rgba(20,20,20,0.7)",
  bgCardSolid: "#141414",
  bgSecondary: "#1A1A1A",
  bgInput:     "rgba(255,255,255,0.04)",

  border:      "rgba(255,255,255,0.08)",
  borderHi:    "rgba(255,255,255,0.15)",

  primary:     "#00C896",
  primaryDim:  "rgba(0,200,150,0.12)",
  primaryGlow: "rgba(0,200,150,0.25)",

  accent:      "#F5A623",
  accentDim:   "rgba(245,166,35,0.12)",

  red:         "#F87171",
  redDim:      "rgba(248,113,113,0.12)",

  purple:      "#8B5CF6",
  purpleDim:   "rgba(139,92,246,0.12)",

  fg:          "#F0F0F0",
  muted:       "#6B7280",
  dim:         "#374151",

  // Quiz page uses a light theme (matching screenshots 1-7)
  quizBg:      "#F0F2F5",
  quizCard:    "#FFFFFF",
  quizBorder:  "#E5E7EB",
  quizText:    "#111827",
  quizMuted:   "#9CA3AF",
} as const;

export const FONTS = {
  display: "'Space Grotesk', sans-serif",
  body:    "'Inter', system-ui, sans-serif",
  mono:    "'Space Grotesk', monospace",
} as const;

// ─── SCORE THRESHOLDS ────────────────────────────────────────────────────────
export const scoreColor = (val: number): string => {
  if (val < 40)  return "#EF4444";   // red
  if (val < 65)  return "#F59E0B";   // amber
  return "#10B981";                  // green
};

export const scoreLabel = (overall: number): string => {
  if (overall < 40)  return "Needs Immediate Attention";
  if (overall < 55)  return "Below Average";
  if (overall < 70)  return "Average";
  if (overall < 85)  return "Good";
  return "Excellent";
};

// ─── DIMENSION META ───────────────────────────────────────────────────────────
export const DIM_META: Record<string, { label: string; module: string; tip: string }> = {
  emergency: {
    label:  "Emergency Fund",
    module: "fire",
    tip:    "Set up a liquid fund SIP to reach 6 months of expenses.",
  },
  insurance: {
    label:  "Insurance",
    module: "fire",
    tip:    "Calculate your Human Life Value and buy a term plan today.",
  },
  diversification: {
    label:  "Diversification",
    module: "xray",
    tip:    "Run the MF X-Ray to detect overlap and add missing categories.",
  },
  debt: {
    label:  "Debt Health",
    module: "tax",
    tip:    "Pay off high-interest debt first, then invest the freed-up EMI.",
  },
  tax: {
    label:  "Tax Efficiency",
    module: "tax",
    tip:    "Use the Tax Wizard to claim every deduction you are missing.",
  },
  retirement: {
    label:  "Retirement",
    module: "fire",
    tip:    "Open the FIRE Planner to set a target corpus and SIP amount.",
  },
};

export type DimKey = keyof typeof DIM_META;
export type ScoreMap = Record<DimKey, number>;

// ─── ALL 12 MODULES META ─────────────────────────────────────────────────────
export const ALL_MODULES = [
  { id: "score",      label: "Money Health Score",          sub: "5-min quiz, 6 dimensions, personalised score",           tag: "F4", group: "core"   },
  { id: "xray",       label: "MF Portfolio X-Ray",          sub: "Upload CAMS, get true XIRR and overlap analysis",         tag: "F1", group: "core"   },
  { id: "tax",        label: "Tax Wizard",                  sub: "Old vs new regime with missing deductions",               tag: "F2", group: "core"   },
  { id: "fire",       label: "FIRE Path Planner",           sub: "Month-by-month roadmap to financial freedom",             tag: "F3", group: "core"   },
  { id: "life",       label: "Life Event Advisor",          sub: "Ranked action plan for major life moments",               tag: "F5", group: "core"   },
  { id: "couples",    label: "Couple's Money Planner",      sub: "Joint optimisation for dual-income households",           tag: "F6", group: "core"   },
  { id: "badadvice",  label: "Cost of Bad Advice",          sub: "See what your distributor really earned",                 tag: "U1", group: "unique" },
  { id: "bias",       label: "Behavioral Bias Fingerprint", sub: "Detect and adapt to your investing biases",               tag: "U2", group: "unique" },
  { id: "tip",        label: "WhatsApp Tip Analyzer",       sub: "Grade any stock tip A-to-F instantly",                    tag: "U3", group: "unique" },
  { id: "clock",      label: "Procrastination Cost Clock",  sub: "Live wealth lost by delaying your SIP",                  tag: "U4", group: "unique" },
  { id: "mirror",     label: "The Mirror",                  sub: "Stated intent vs actual CAMS behaviour",                  tag: "U5", group: "unique" },
  { id: "translator", label: "Salary-to-Wealth Translator", sub: "Any rupee amount at 12% CAGR over 30 years",              tag: "U6", group: "unique" },
] as const;

export type ModuleId = typeof ALL_MODULES[number]["id"];