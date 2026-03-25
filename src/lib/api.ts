// src/lib/api.ts

export interface TaxInputRequest {
  base_salary: number;
  hra?: number;
  home_loan?: number;
  parent_health?: number;
  nps?: number;
  basic_80c?: number;
}

export interface TaxComparisonResponse {
  gross_salary: number;
  deductions_used: Record<string, number>;
  new_regime_tax: number;
  old_regime_tax: number;
  recommended_regime: string;
  mathematical_tax_savings: number;
  extracted_tds?: number;
}

export interface FireSimulationRequest {
  current_age: number;
  target_age: number;
  current_corpus: number;
  target_corpus: number;
  expected_cagr: number;
  inflation_rate: number;
}

export interface FireSimulationResponse {
  summary: Record<string, any>;
  roadmap: Array<Record<string, any>>;
}

export interface TipAnalysisRequest {
  raw_tip: string;
}

export interface TipAnalysisResponse {
  grade: string;
  analysis: string;
  red_flags: string[];
}

export interface PortfolioRebalanceRequest {
  xirr: number;
  overlap_data: Record<string, any>;
  expense_drag: number;
}

export interface PortfolioRebalanceResponse {
  rebalancing_plan_text: string;
}

export interface XrayParseResponse {
  status: string;
  total_transactions: number;
  transactions: Array<Record<string, any>>;
}


const BASE_URL = 'http://localhost:8000/api/v1';

export const api = {

  compareTax: async (data: TaxInputRequest): Promise<TaxComparisonResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/tax/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Tax Comparison Error:", error);
      throw error;
    }
  },

  uploadForm16: async (file: File): Promise<TaxComparisonResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${BASE_URL}/tax/upload-form16`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Form16 PDF Upload Error:", error);
      throw error;
    }
  },

  simulateFirePath: async (data: FireSimulationRequest): Promise<FireSimulationResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/calculators/fire-simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("FIRE Calculation Error:", error);
      throw error;
    }
  },

  analyzeTip: async (data: TipAnalysisRequest): Promise<TipAnalysisResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/ai-advisor/analyze-tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Tip Analysis Error:", error);
      throw error;
    }
  },

  parseCamsStatement: async (file: File): Promise<XrayParseResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${BASE_URL}/xray/test-parse`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("CAMS Parse Error:", error);
      throw error;
    }
  },

  generateRebalancePlan: async (data: PortfolioRebalanceRequest): Promise<PortfolioRebalanceResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/ai-advisor/rebalance-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("AI Advisory Error:", error);
      throw error;
    }
  },

  analyzeBias: async (data: { answers: number[] }): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/behavior/bias-fingerprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Bias Analysis Error:", error);
      throw error;
    }
  },

  translateSalary: async (data: { annual_ctc: number }): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/calculators/salary-translator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Salary Translator Error:", error);
      throw error;
    }
  },

  calculateOpportunityCost: async (data: any): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/calculators/procrastination-clock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Procrastination Calculator Error:", error);
      throw error;
    }
  },

  simulateCouplesFire: async (data: any): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/calculators/couples-planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Couples Calculator Error:", error);
      throw error;
    }
  },

  calculateHealthScore: async (data: any): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/health/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Health Scoring Error:", error);
      throw error;
    }
  },

  askMirror: async (data: any): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/ai-advisor/the-mirror`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Mirror Agent Error:", error);
      throw error;
    }
  },

  askDebunker: async (data: any): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/ai-advisor/debunk-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Debunker Agent Error:", error);
      throw error;
    }
  },

  getDashboardSummary: async (): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/summary`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Dashboard Aggregator Error:", error);
      throw error;
    }
  }
};

/** Legacy polyfill for original custom hooks (like useCAMSData) to prevent Vite compiler crashes */
export const apiUpload = async <T>(url: string, file: File): Promise<T> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`http://localhost:8000${url}`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
};

/** Legacy polyfill to support old pages (BiasFingerprint) without deleting them */
export const apiPost = async <T>(url: string, data: any): Promise<T> => {
  const response = await fetch(`http://localhost:8000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
};