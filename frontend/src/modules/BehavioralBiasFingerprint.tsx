import { useState } from "react";
import RadarChart from "../components/RadarChart";
import { useBiasProfile, type BiasType, BIAS_FRAMING } from "../hooks/useBiasProfile";
import { COLORS } from "../utils/constants";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Question {
  id:   string;
  q:    string;
  opts: { text: string; bias: BiasType; weight: number }[];
}

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    id: "q1",
    q:  "You bought a mutual fund at ₹50 NAV. It is now at ₹35. What do you do?",
    opts: [
      { text: "Hold and wait for it to return to ₹50",           bias: "loss_aversion",  weight: 3 },
      { text: "Buy more — it is cheaper now",                    bias: "overconfidence", weight: 2 },
      { text: "Check 5-year fundamentals and then decide",       bias: "anchoring",      weight: 1 },
      { text: "Sell and move to last year's top performer",      bias: "recency_bias",   weight: 3 },
    ],
  },
  {
    id: "q2",
    q:  "A friend tells you their mid-cap fund gave 60% last year. You:",
    opts: [
      { text: "Immediately move some money into that fund",       bias: "herd_mentality", weight: 3 },
      { text: "Research the fund's 5-year track record first",   bias: "anchoring",       weight: 1 },
      { text: "Dismiss it — last year's winner is often next year's loser", bias: "recency_bias", weight: 2 },
      { text: "Compare it to your existing funds before deciding", bias: "overconfidence", weight: 1 },
    ],
  },
  {
    id: "q3",
    q:  "You receive a ₹3 lakh bonus. You are most likely to:",
    opts: [
      { text: "Invest all at once — I know when markets are good", bias: "overconfidence", weight: 3 },
      { text: "Put it in what everyone around you is investing in", bias: "herd_mentality", weight: 3 },
      { text: "Deploy it gradually over 6 months via STP",         bias: "loss_aversion",  weight: 2 },
      { text: "Hold it until my existing loss-making fund recovers", bias: "anchoring",    weight: 3 },
    ],
  },
  {
    id: "q4",
    q:  "How often do you check your portfolio value?",
    opts: [
      { text: "Multiple times per day",                           bias: "loss_aversion",  weight: 3 },
      { text: "Weekly — I like staying on top of moves",          bias: "overconfidence", weight: 2 },
      { text: "Monthly — I track returns against what I bought",  bias: "anchoring",      weight: 2 },
      { text: "Whenever someone mentions a hot sector",           bias: "herd_mentality", weight: 3 },
    ],
  },
  {
    id: "q5",
    q:  "In March 2020 (COVID crash), a long-term investor should have:",
    opts: [
      { text: "Sold everything to avoid further losses",          bias: "loss_aversion",  weight: 3 },
      { text: "Held — markets always come back",                  bias: "recency_bias",   weight: 1 },
      { text: "Bought aggressively — obvious opportunity",        bias: "overconfidence", weight: 2 },
      { text: "Waited to see what colleagues and news said",      bias: "herd_mentality", weight: 3 },
    ],
  },
  {
    id: "q6",
    q:  "A stock you own is up 40%. You:",
    opts: [
      { text: "Sell immediately to lock in the gain",             bias: "loss_aversion",  weight: 3 },
      { text: "Hold — it can go much higher, I know this sector", bias: "overconfidence", weight: 3 },
      { text: "Check if peers are still holding before deciding", bias: "herd_mentality", weight: 2 },
      { text: "Only sell if it crosses my original target price", bias: "anchoring",      weight: 3 },
    ],
  },
  {
    id: "q7",
    q:  "You see a WhatsApp message saying a small-cap stock will triple. You:",
    opts: [
      { text: "Invest a small amount — could be real",            bias: "herd_mentality", weight: 3 },
      { text: "Ignore it completely",                             bias: "anchoring",       weight: 1 },
      { text: "Research the company before considering",          bias: "overconfidence",  weight: 1 },
      { text: "Ask friends if they have heard about it too",      bias: "herd_mentality",  weight: 3 },
    ],
  },
  {
    id: "q8",
    q:  "Your index fund returned 14% while a thematic tech fund returned 40%. You feel:",
    opts: [
      { text: "I missed out — I should switch to tech funds",     bias: "recency_bias",   weight: 3 },
      { text: "Satisfied — 14% is strong long-term performance",  bias: "anchoring",       weight: 1 },
      { text: "Anxious — I must have made the wrong choice",      bias: "loss_aversion",   weight: 2 },
      { text: "I will switch when more people talk about tech",   bias: "herd_mentality",  weight: 2 },
    ],
  },
  {
    id: "q9",
    q:  "When evaluating a mutual fund you focus primarily on:",
    opts: [
      { text: "1-year returns — recent performance matters most", bias: "recency_bias",   weight: 3 },
      { text: "10-year CAGR and standard deviation",              bias: "overconfidence", weight: 1 },
      { text: "How many of my friends have invested in it",       bias: "herd_mentality", weight: 3 },
      { text: "Whether it has recovered from its worst drawdown", bias: "anchoring",      weight: 3 },
    ],
  },
  {
    id: "q10",
    q:  "You started an SIP in a fund that has been flat for 2 years. You:",
    opts: [
      { text: "Stop the SIP and switch to whatever is rising",    bias: "recency_bias",   weight: 3 },
      { text: "Continue — 2 years is noise in a 20-year journey", bias: "loss_aversion",  weight: 1 },
      { text: "Add lumpsum to average down the cost",             bias: "overconfidence", weight: 2 },
      { text: "Wait until price goes back to your first SIP NAV", bias: "anchoring",      weight: 3 },
    ],
  },
];

// ─── BIAS META ────────────────────────────────────────────────────────────────
const BIAS_META: Record<BiasType, { label: string; color: string; description: string }> = {
  loss_aversion: {
    label:       "Loss Aversion",
    color:       "#F87171",
    description: "You feel losses about twice as intensely as equivalent gains. This leads to holding losing positions too long and selling winners too early.",
  },
  recency_bias: {
    label:       "Recency Bias",
    color:       "#FB923C",
    description: "You give more weight to recent events. Last year's top performer looks like a sure bet — until it is not.",
  },
  overconfidence: {
    label:       "Overconfidence",
    color:       "#FBBF24",
    description: "You believe your stock-picking or market-timing skills exceed those of the average investor. Data consistently shows they do not.",
  },
  herd_mentality: {
    label:       "Herd Mentality",
    color:       "#A78BFA",
    description: "You take comfort in doing what others are doing. This leads to buying at peaks and selling at troughs — the opposite of what wealth-building requires.",
  },
  anchoring: {
    label:       "Anchoring",
    color:       "#60A5FA",
    description: "You are stuck on a reference price — your buy price, or a past high. This prevents rational decision-making about what to do today.",
  },
  unknown: {
    label:       "Not Assessed",
    color:       COLORS.muted,
    description: "Complete the quiz to detect your dominant bias.",
  },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function BehavioralBiasFingerprint() {
  const { profile, updateBias } = useBiasProfile();

  const [step,    setStep]    = useState<"intro" | "quiz" | "results">(
    profile.detected ? "results" : "intro"
  );
  const [qIndex,  setQIndex]  = useState(0);
  const [answers, setAnswers] = useState<Record<string, { bias: BiasType; weight: number }>>({});

  const pick = (opt: { bias: BiasType; weight: number }) => {
    const next = { ...answers, [QUESTIONS[qIndex].id]: opt };
    setAnswers(next);
    if (qIndex < QUESTIONS.length - 1) {
      setTimeout(() => setQIndex(i => i + 1), 180);
    } else {
      // Tally scores
      const scores: Record<BiasType, number> = {
        loss_aversion: 0, recency_bias: 0, overconfidence: 0,
        herd_mentality: 0, anchoring: 0, unknown: 0,
      };
      Object.values(next).forEach(({ bias, weight }) => {
        scores[bias] += weight;
      });
      updateBias(scores);
      setStep("results");
    }
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Unique Feature U2</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Behavioral Bias Fingerprint</h2>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
            Every investor has blind spots. This 10-question assessment identifies your dominant psychological bias — and then adapts every ArthSaathi recommendation to your specific psychology.
          </p>
        </div>

        {/* Bias preview cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {(Object.keys(BIAS_META) as BiasType[]).filter(b => b !== "unknown").map(b => (
            <div key={b} style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
              borderRadius: 12, padding: "16px 18px",
              borderLeft: `3px solid ${BIAS_META[b].color}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{BIAS_META[b].label}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.55 }}>{BIAS_META[b].description}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setStep("quiz")} style={{
          padding: "13px 32px", borderRadius: 10, border: "none",
          background: COLORS.primary, color: "#000",
          fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer",
        }}>
          Start Assessment — 10 Questions
        </button>
      </div>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  if (step === "quiz") {
    const q        = QUESTIONS[qIndex];
    const progress = (qIndex / QUESTIONS.length) * 100;

    return (
      <div>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
            Bias Fingerprint Assessment
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>
              Question {qIndex + 1} of {QUESTIONS.length}
            </h2>
            <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Space Grotesk',monospace" }}>
              {qIndex + 1} / {QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: 4, background: COLORS.border, borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, background: COLORS.accent,
            width: `${progress + (100 / QUESTIONS.length)}%`, transition: "width .3s",
          }} />
        </div>

        {/* Question card */}
        <div style={{
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
          borderRadius: 14, padding: 24, marginBottom: 16,
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: COLORS.fg, marginBottom: 22 }}>
            {q.q}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => pick(opt)} style={{
                padding: "14px 18px", borderRadius: 10, cursor: "pointer",
                textAlign: "left", fontFamily: "Inter,sans-serif", fontSize: 14,
                border: `1px solid ${COLORS.border}`,
                background: "rgba(255,255,255,0.03)", color: COLORS.fg,
                transition: "all .15s",
              }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.borderColor = COLORS.accent;
                  (e.target as HTMLButtonElement).style.background = COLORS.accentDim;
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.borderColor = COLORS.border;
                  (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {qIndex > 0 && (
          <button onClick={() => setQIndex(i => i - 1)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: COLORS.muted, background: "none",
            border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif",
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke={COLORS.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        )}
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  const dominant    = profile.dominant;
  const dominantMeta = BIAS_META[dominant];

  // Build radar data — normalise scores 0–100
  const rawScores   = profile.scores;
  const biasKeys    = (["loss_aversion", "recency_bias", "overconfidence", "herd_mentality", "anchoring"] as BiasType[]);
  const maxRaw      = Math.max(...biasKeys.map(b => rawScores[b]), 1);
  const radarScores = biasKeys.map(b => Math.round((rawScores[b] / maxRaw) * 100));
  const radarLabels = biasKeys.map(b => BIAS_META[b].label.split(" ")[0]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Unique Feature U2 — Results</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Your Bias Fingerprint</h2>
      </div>

      {/* Dominant bias hero */}
      <div style={{
        background: COLORS.bgCard, border: `2px solid ${dominantMeta.color}`,
        borderRadius: 14, padding: "24px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>
          Dominant Bias Detected
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: dominantMeta.color, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 10 }}>
          {dominantMeta.label}
        </div>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          {dominantMeta.description}
        </p>
      </div>

      {/* Radar */}
      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Bias Profile Radar</div>
        <RadarChart
          scores={radarScores}
          labels={radarLabels}
          size={280}
          theme="dark"
        />
      </div>

      {/* All bias scores */}
      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>All Dimensions</div>
        {biasKeys.map((b, i) => {
          const pct = radarScores[i];
          return (
            <div key={b} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: COLORS.fg }}>{BIAS_META[b].label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: BIAS_META[b].color, fontFamily: "'Space Grotesk',monospace" }}>{pct}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, background: BIAS_META[b].color, width: `${pct}%`, transition: "width 1s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* How ArthSaathi adapts */}
      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>How ArthSaathi Adapts For You</div>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.6 }}>
          Every module output is now framed to counteract your dominant bias.
        </p>
        {[
          { label: "Rebalancing recommendations shown as:", value: BIAS_FRAMING[dominant].rebalanceFrame },
          { label: "Loss and inaction framing:",            value: BIAS_FRAMING[dominant].lossFrame },
          { label: "SIP recommendations framed as:",       value: BIAS_FRAMING[dominant].sipFrame },
        ].map(({ label, value }) => (
          <div key={label} style={{ padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 14, color: COLORS.fg, fontStyle: "italic", lineHeight: 1.5 }}>"{value}"</div>
          </div>
        ))}
      </div>

      <button onClick={() => { setStep("intro"); setQIndex(0); setAnswers({}); }} style={{
        padding: "10px 22px", borderRadius: 10,
        border: `1px solid ${COLORS.border}`, background: "transparent",
        color: COLORS.muted, fontSize: 14, cursor: "pointer", fontFamily: "Inter,sans-serif",
      }}>
        Retake Assessment
      </button>
    </div>
  );
}