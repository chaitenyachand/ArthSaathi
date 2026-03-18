import { useState, useCallback } from "react";

// ─── BIAS TYPES ───────────────────────────────────────────────────────────────
export type BiasType =
  | "loss_aversion"
  | "recency_bias"
  | "overconfidence"
  | "herd_mentality"
  | "anchoring"
  | "unknown";

export interface BiasProfile {
  dominant: BiasType;
  scores: Record<BiasType, number>;
  detected: boolean;
}

// ─── FRAMING ADAPTERS ─────────────────────────────────────────────────────────
// Each bias gets a different way of presenting the same recommendation
export const BIAS_FRAMING: Record<BiasType, {
  label: string;
  rebalanceFrame: string;
  lossFrame: string;
  sipFrame: string;
}> = {
  loss_aversion: {
    label: "Loss Aversion",
    rebalanceFrame: "Lock in your winners before the market retraces",
    lossFrame: "Every day you wait costs you more in foregone gains",
    sipFrame: "Missing this SIP permanently erases future wealth",
  },
  recency_bias: {
    label: "Recency Bias",
    rebalanceFrame: "10-year returns shown first — last year is noise",
    lossFrame: "Last year's top fund is often next year's laggard",
    sipFrame: "Consistent SIPs outperform timing the market every time",
  },
  overconfidence: {
    label: "Overconfidence",
    rebalanceFrame: "Data: index funds beat 85% of active stock pickers",
    lossFrame: "Switching costs erode 0.8–1.2% of CAGR annually",
    sipFrame: "An automated SIP removes emotion from the equation",
  },
  herd_mentality: {
    label: "Herd Mentality",
    rebalanceFrame: "Your diversification score is below peers — here is why",
    lossFrame: "NFOs and thematic funds underperform broad index by 4% on average",
    sipFrame: "Index SIPs have no hype cycle — just steady compounding",
  },
  anchoring: {
    label: "Anchoring",
    rebalanceFrame: "Opportunity cost of waiting for NAV recovery shown below",
    lossFrame: "If this fund returns to buy price in 3 years: only 2.4% CAGR",
    sipFrame: "Start a new SIP — do not wait for old positions to break even",
  },
  unknown: {
    label: "Not Assessed",
    rebalanceFrame: "Complete the Bias Fingerprint quiz for personalised framing",
    lossFrame: "Take the Bias quiz to see how your psychology affects decisions",
    sipFrame: "Start your SIP today — time in market beats timing the market",
  },
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────
const DEFAULT_PROFILE: BiasProfile = {
  dominant: "unknown",
  scores: {
    loss_aversion:  0,
    recency_bias:   0,
    overconfidence: 0,
    herd_mentality: 0,
    anchoring:      0,
    unknown:        0,
  },
  detected: false,
};

export const useBiasProfile = () => {
  const [profile, setProfile] = useState<BiasProfile>(DEFAULT_PROFILE);

  const updateBias = useCallback((scores: Record<BiasType, number>) => {
    const dominant = (Object.entries(scores) as [BiasType, number][]).reduce(
      (best, [type, score]) => (score > scores[best] ? type : best),
      "unknown" as BiasType
    );
    setProfile({ dominant, scores, detected: true });
  }, []);

  const resetBias = useCallback(() => setProfile(DEFAULT_PROFILE), []);

  const getFraming = useCallback(
    (key: "rebalanceFrame" | "lossFrame" | "sipFrame") =>
      BIAS_FRAMING[profile.dominant][key],
    [profile.dominant]
  );

  return { profile, updateBias, resetBias, getFraming };
};