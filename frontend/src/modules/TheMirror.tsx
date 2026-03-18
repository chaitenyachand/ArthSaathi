import { useState } from "react";
import { useCAMSData } from "../hooks/useCAMSData";
import { COLORS } from "../utils/constants";

// ─── QUIZ QUESTIONS (stated preferences) ─────────────────────────────────────
const STATED_QUESTIONS = [
  { id: "horizon",   q: "I am a long-term investor with a horizon of:",         opts: ["Less than 1 year", "1–3 years", "3–7 years", "7–10+ years"] },
  { id: "panic",     q: "During a 20% market crash, I would:",                  opts: ["Sell everything", "Sell some", "Hold", "Buy more"] },
  { id: "riskPref",  q: "My preferred portfolio allocation is:",                opts: ["100% debt/FD", "Mostly debt, some equity", "Balanced 50/50", "Mostly equity"] },
  { id: "timing",    q: "I believe I can time the market to improve returns:",   opts: ["Strongly agree", "Somewhat agree", "Somewhat disagree", "Strongly disagree"] },
  { id: "maxLoss",   q: "I am comfortable with a temporary portfolio loss of:", opts: ["0–5%", "5–10%", "10–20%", "20–30% or more"] },
];

// ─── MOCK ACTUAL BEHAVIOUR (from CAMS in production) ─────────────────────────
const DEMO_ACTUAL = {
  avgHoldingMonths: 11,
  panicSell:        { did: true, date: "March 2020", lossAtSell: 18, reEntered: false },
  equityPct:        37,
  switchFrequency:  "4 switches in 18 months",
  maxDrawdownTaken: 18,
};

// ─── RISK PROFILE MAPPING ─────────────────────────────────────────────────────
const computeRiskProfile = (answers: Record<string, number>) => {
  const score =
    (answers.horizon  ?? 0) * 25 +
    (answers.panic    ?? 0) * 25 +
    (answers.riskPref ?? 0) * 25 +
    (answers.maxLoss  ?? 0) * 25;

  if (score < 30)  return { label: "Conservative",          equity: "20–30%", debt: "70–80%" };
  if (score < 55)  return { label: "Conservative-Moderate", equity: "30–50%", debt: "50–70%" };
  if (score < 75)  return { label: "Moderate",              equity: "50–60%", debt: "40–50%" };
  if (score < 90)  return { label: "Moderate-Aggressive",   equity: "60–75%", debt: "25–40%" };
  return                  { label: "Aggressive",            equity: "75–90%", debt: "10–25%" };
};

const computeActualProfile = () => {
  // Based on DEMO_ACTUAL
  if (DEMO_ACTUAL.panicSell.did && DEMO_ACTUAL.equityPct < 50) return { label: "Conservative-Moderate", equity: "40–55%", debt: "45–60%" };
  return { label: "Conservative-Moderate", equity: "40–55%", debt: "45–60%" };
};

// ─── COMPARISON ROW ───────────────────────────────────────────────────────────
const MirrorRow = ({
  stated, actual, isConflict,
}: { stated: string; actual: string; isConflict: boolean }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 12, padding: "14px 0",
    borderBottom: `1px solid ${COLORS.border}`,
  }}>
    <div style={{
      padding: "12px 14px", borderRadius: 10,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${COLORS.border}`,
      fontSize: 13, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.5,
    }}>
      {stated}
    </div>
    <div style={{
      padding: "12px 14px", borderRadius: 10,
      background: isConflict ? COLORS.redDim : COLORS.primaryDim,
      border: `1px solid ${isConflict ? "rgba(248,113,113,0.25)" : "rgba(0,200,150,0.2)"}`,
      fontSize: 13, color: isConflict ? COLORS.red : COLORS.primary,
      lineHeight: 1.5, fontWeight: 500,
    }}>
      {actual}
    </div>
  </div>
);

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function TheMirror() {
  const { data, loading, loadDemo } = useCAMSData();

  const [step,    setStep]    = useState<"intro" | "quiz" | "results">("intro");
  const [qIndex,  setQIndex]  = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const pick = (i: number) => {
    const next = { ...answers, [STATED_QUESTIONS[qIndex].id]: i };
    setAnswers(next);
    if (qIndex < STATED_QUESTIONS.length - 1) {
      setTimeout(() => setQIndex(qi => qi + 1), 180);
    } else {
      setStep("results");
    }
  };

  const statedProfile = computeRiskProfile(answers);
  const actualProfile = computeActualProfile();
  const hasConflict   = statedProfile.label !== actualProfile.label;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Unique Feature U5</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>The Mirror</h2>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
            During risk profiling, investors reliably overstate their risk tolerance.
            The Mirror compares what you say about yourself against what your actual CAMS transaction history reveals.
            It is the most honest financial assessment you have ever received.
          </p>
        </div>

        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div style={{ padding: "16px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>What You Say</div>
              <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
                Your answers to a standard risk quiz — the profile every advisor uses.
              </div>
            </div>
            <div style={{ padding: "16px", borderRadius: 10, background: COLORS.primaryDim, border: `1px solid rgba(0,200,150,0.2)` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>What Your Money Shows</div>
              <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
                Your actual holding periods, sell decisions, and allocation from your CAMS statement.
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, padding: "12px 0", borderTop: `1px solid ${COLORS.border}` }}>
            The Mirror requires two things: your quiz answers (below) and your CAMS statement. We will load demo CAMS data so you can see the result immediately.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => { loadDemo(); setStep("quiz"); }} style={{
            padding: "12px 28px", borderRadius: 10, border: "none",
            background: COLORS.primary, color: "#000",
            fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>
            Start Quiz + Load Demo CAMS
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  if (step === "quiz") {
    const q = STATED_QUESTIONS[qIndex];
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>Stated Risk Profile</h2>
          <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Space Grotesk',monospace" }}>{qIndex + 1} / {STATED_QUESTIONS.length}</span>
        </div>

        <div style={{ height: 4, background: COLORS.border, borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ height: "100%", background: COLORS.accent, borderRadius: 2,
            width: `${((qIndex) / STATED_QUESTIONS.length) * 100 + 20}%`, transition: "width .3s" }} />
        </div>

        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 22, lineHeight: 1.5, color: COLORS.fg }}>{q.q}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => pick(i)} style={{
                padding: "14px 18px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                fontFamily: "Inter,sans-serif", fontSize: 14,
                border: `1px solid ${COLORS.border}`,
                background: "rgba(255,255,255,0.03)", color: COLORS.fg, transition: "all .15s",
              }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = COLORS.primary); (e.currentTarget.style.background = COLORS.primaryDim); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = COLORS.border); (e.currentTarget.style.background = "rgba(255,255,255,0.03)"); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {qIndex > 0 && (
          <button onClick={() => setQIndex(qi => qi - 1)} style={{
            marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: COLORS.muted, background: "none", border: "none",
            cursor: "pointer", fontFamily: "Inter,sans-serif",
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        )}
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>The Mirror — Results</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>What You Said vs What You Did</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          The Mirror is not a judgment. It is the most accurate risk profile you have ever received — because it is based on behaviour, not self-assessment.
        </p>
      </div>

      {/* Risk profile conflict banner */}
      {hasConflict && (
        <div style={{ padding: 16, borderRadius: 12, marginBottom: 20,
          background: COLORS.redDim, border: `1px solid rgba(248,113,113,0.25)`, fontSize: 14, lineHeight: 1.6 }}>
          <strong style={{ color: COLORS.red }}>Conflict Detected: </strong>
          You said <strong>{statedProfile.label}</strong> but your transactions show{" "}
          <strong>{actualProfile.label}</strong>. Your portfolio should have {actualProfile.equity} equity, not {statedProfile.equity}.
        </div>
      )}

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`, textAlign: "center" as const }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: ".08em" }}>What You Said</span>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: COLORS.primaryDim, border: `1px solid rgba(0,200,150,0.2)`, textAlign: "center" as const }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: ".08em" }}>What Your Transactions Show</span>
        </div>
      </div>

      {/* Mirror rows */}
      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "0 20px", marginBottom: 20 }}>
        <MirrorRow
          stated   ="I am a long-term investor with a 7–10 year horizon"
          actual  = {`Average holding period across all funds: ${DEMO_ACTUAL.avgHoldingMonths} months`}
          isConflict
        />
        <MirrorRow
          stated   ="I do not panic in market downturns"
          actual   = {`Redeemed ₹2.3 lakhs in ${DEMO_ACTUAL.panicSell.date} — at the exact market bottom`}
          isConflict
        />
        <MirrorRow
          stated   ="I prefer equity-heavy portfolio"
          actual   = {`${DEMO_ACTUAL.equityPct}% of current portfolio is in debt and liquid funds`}
          isConflict
        />
        <MirrorRow
          stated   ="I hold investments through volatility"
          actual   = {DEMO_ACTUAL.switchFrequency + " — high churn destroys CAGR by 0.8–1.2%"}
          isConflict
        />
        <MirrorRow
          stated   = {`Comfortable with up to ${STATED_QUESTIONS[4].opts[answers.maxLoss ?? 2]} loss`}
          actual   = {`Sold at ${DEMO_ACTUAL.maxDrawdownTaken}% loss in 2020 and never re-entered`}
          isConflict={DEMO_ACTUAL.maxDrawdownTaken < 20}
        />
      </div>

      {/* Revised recommendation */}
      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Revised Portfolio Recommendation</div>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.7, marginBottom: 16 }}>
          Your actual risk tolerance, based on behaviour rather than stated preference, is{" "}
          <strong style={{ color: COLORS.primary }}>{actualProfile.label}</strong>.
          Your optimal portfolio should have <strong style={{ color: COLORS.primary }}>{actualProfile.equity} equity</strong> and{" "}
          <strong>{actualProfile.debt} debt</strong>.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, padding: 14, borderRadius: 10, background: COLORS.primaryDim, border: `1px solid rgba(0,200,150,0.2)`, textAlign: "center" as const }}>
            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Recommended Equity</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.primary, fontFamily: "'Space Grotesk',sans-serif" }}>{actualProfile.equity}</div>
          </div>
          <div style={{ flex: 1, padding: 14, borderRadius: 10, background: COLORS.accentDim, border: `1px solid rgba(245,166,35,0.2)`, textAlign: "center" as const }}>
            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Recommended Debt</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.accent, fontFamily: "'Space Grotesk',sans-serif" }}>{actualProfile.debt}</div>
          </div>
        </div>
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