import { useState, useCallback } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface Transaction {
  date:   Date;
  fund:   string;
  type:   "purchase" | "redemption" | "switch_in" | "switch_out" | "dividend";
  units:  number;
  nav:    number;
  amount: number;
}

export interface FundHolding {
  fundName:     string;
  folio:        string;
  plan:         "Direct" | "Regular";
  category:     string;       // "Large Cap", "Mid Cap", etc.
  units:        number;
  currentNAV:   number;
  currentValue: number;
  investedCost: number;
  expenseRatio: number;
  directExpenseRatio: number; // equivalent Direct plan ER
  transactions: Transaction[];
}

export interface CAMSData {
  pan:          string;
  name:         string;
  holdings:     FundHolding[];
  totalInvested:number;
  totalCurrent: number;
  xirr:         number;       // as decimal e.g. 0.084 = 8.4%
  overlapScore: number;       // 0–100
  commissionPaid5yr: number;
  commissionProjected20yr: number;
  parsed:       boolean;
  fileName?:    string;
}

// ─── DEMO DATA (for judges / demo mode) ──────────────────────────────────────
export const DEMO_CAMS_DATA: CAMSData = {
  pan:   "ABCDE1234F",
  name:  "Rahul Sharma",
  totalInvested: 1000000,
  totalCurrent:  1380000,
  xirr:          0.084,
  overlapScore:  73,
  commissionPaid5yr: 47300,
  commissionProjected20yr: 380000,
  parsed: true,
  fileName: "CAMS_Statement_Demo.pdf",
  holdings: [
    {
      fundName:           "SBI Bluechip Fund",
      folio:              "1234567890",
      plan:               "Regular",
      category:           "Large Cap",
      units:              2847.32,
      currentNAV:         122.84,
      currentValue:       350000,
      investedCost:       280000,
      expenseRatio:       1.65,
      directExpenseRatio: 0.42,
      transactions: [],
    },
    {
      fundName:           "Axis Bluechip Fund",
      folio:              "2345678901",
      plan:               "Regular",
      category:           "Large Cap",
      units:              1923.07,
      currentNAV:         145.60,
      currentValue:       280000,
      investedCost:       240000,
      expenseRatio:       1.58,
      directExpenseRatio: 0.38,
      transactions: [],
    },
    {
      fundName:           "Mirae Asset Large Cap",
      folio:              "3456789012",
      plan:               "Regular",
      category:           "Large Cap",
      units:              2156.18,
      currentNAV:         148.41,
      currentValue:       320000,
      investedCost:       270000,
      expenseRatio:       1.71,
      directExpenseRatio: 0.51,
      transactions: [],
    },
    {
      fundName:           "Parag Parikh Flexi Cap",
      folio:              "4567890123",
      plan:               "Direct",
      category:           "Flexi Cap",
      units:              3071.25,
      currentNAV:         146.50,
      currentValue:       450000,
      investedCost:       360000,
      expenseRatio:       0.62,
      directExpenseRatio: 0.62,
      transactions: [],
    },
  ],
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────
const EMPTY: CAMSData = {
  pan: "", name: "", holdings: [],
  totalInvested: 0, totalCurrent: 0,
  xirr: 0, overlapScore: 0,
  commissionPaid5yr: 0, commissionProjected20yr: 0,
  parsed: false,
};

export const useCAMSData = () => {
  const [data, setData] = useState<CAMSData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In production this would call POST /api/xray with the PDF file.
  // For the demo, it loads the DEMO_CAMS_DATA after a simulated delay.
  const loadDemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 1600));
    setData(DEMO_CAMS_DATA);
    setLoading(false);
  }, []);

  const loadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: POST to /api/xray — returns CAMSData JSON
      // const formData = new FormData();
      // formData.append("file", file);
      // const res = await fetch("/api/xray", { method: "POST", body: formData });
      // const result: CAMSData = await res.json();
      // setData(result);

      // Demo fallback
      await new Promise(r => setTimeout(r, 1800));
      setData({ ...DEMO_CAMS_DATA, fileName: file.name });
    } catch (e) {
      setError("Failed to parse CAMS statement. Please try again.");
    }
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setData(EMPTY);
    setError(null);
  }, []);

  return { data, loading, error, loadDemo, loadFile, reset };
};