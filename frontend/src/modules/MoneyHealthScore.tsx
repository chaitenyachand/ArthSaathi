import { useState } from "react";
import RadarChart from "../components/RadarChart";
import ScoreCard  from "../components/ScoreCard";
import { DIM_META, scoreLabel, COLORS, type ScoreMap, type DimKey } from "../utils/constants";
import type { ModuleId } from "../utils/constants";

// ─── QUIZ QUESTIONS (matching screenshots 1–6) ────────────────────────────────
const QUESTIONS = [
  {
    id:     "emergency" as DimKey,
    q:      "How many months of expenses do you have saved in liquid cash?",
    opts:   ["Less than 1", "1–3 months", "3–6 months", "More than 6"],
    scores: [5, 30, 65, 100],
  },
  {
    id:     "insurance" as DimKey,
    q:      "What is your life insurance cover relative to your annual income?",
    opts:   ["No cover", "1–3x income", "3–8x income", "More than 8x"],
    scores: [5, 25, 60, 100],
  },
  {
    id:     "diversification" as DimKey,
    q:      "How diversified is your investment portfolio?",
    opts:   ["Only savings or FDs", "One mutual fund category", "Equity and Debt funds", "Equity, Debt, Gold and International"],
    scores: [10, 35, 65, 100],
  },
  {
    id:     "debt" as DimKey,
    q:      "What is your total EMI as a percentage of monthly income?",
    opts:   ["Above 50%", "30–50%", "20–30%", "Below 20%"],
    scores: [5, 30, 60, 100],
  },
  {
    id:     "tax" as DimKey,
    q:      "How much of your 80C limit have you utilised?",
    opts:   ["Nothing", "Less than half", "Most of it", "Fully utilised + NPS"],
    scores: [5, 30, 65, 100],
  },
  {
    id:     "retirement" as DimKey,
    q:      "What percentage of your required retirement corpus have you accumulated?",
    opts:   ["None", "Less than 25%", "25–50%", "More than 50%"],
    scores: [5, 25, 55, 100],
  },
];

// ─── CIRCULAR SCORE RING (screenshot 6) ──────────────────────────────────────
const CircleScore = ({ score }: { score: number }) => {
  const r = 70, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score < 40 ? "#EF4444" : score < 65 ? "#F59E0B" : "#10B981";
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={180} height={180} viewBox="0 0 180 180" style={{ display: "block", margin: "0 auto" }}>
        <circle cx={90} cy={90} r={r} fill="rgba(245,166,35,0.06)" stroke="#F3F4F6" strokeWidth={10} />
        <circle cx={90} cy={90} r={r} fill="none"
          stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)" }}
        />
        <text x={90} y={82} textAnchor="middle"
          style={{ fontSize: 44, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", fill: "#111827" }}>
          {score}
        </text>
        <text x={90} y={107} textAnchor="middle"
          style={{ fontSize: 14, fontFamily: "Inter,sans-serif", fill: "#9CA3AF" }}>
          /100
        </text>
      </svg>
      <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 6, fontFamily: "Inter,sans-serif" }}>
        Your overall financial health score
      </p>
    </div>
  );
};

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface MoneyHealthScoreProps {
  onScoreReady:  (scores: ScoreMap, overall: number) => void;
  onNavigate:    (id: ModuleId) => void;
  existingScores?: ScoreMap;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function MoneyHealthScore({
  onScoreReady,
  onNavigate,
  existingScores,
}: MoneyHealthScoreProps) {
  const [step, setStep]     = useState<"quiz" | "results">(
    existingScores ? "results" : "quiz"
  );
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<DimKey, number>>>({});
  const [scores, setScores]   = useState<ScoreMap | null>(existingScores ?? null);

  // ── Quiz answer handler ───────────────────────────────────────────────────
  const pick = (optIndex: number) => {
    const q      = QUESTIONS[qIndex];
    const next   = { ...answers, [q.id]: q.scores[optIndex] };
    setAnswers(next);
    if (qIndex < QUESTIONS.length - 1) {
      setTimeout(() => setQIndex(i => i + 1), 200);
    } else {
      // All answered — compute results
      const final: ScoreMap = {
        emergency:       next.emergency       ?? 5,
        insurance:       next.insurance       ?? 5,
        diversification: next.diversification ?? 5,
        debt:            next.debt            ?? 5,
        tax:             next.tax             ?? 5,
        retirement:      next.retirement      ?? 5,
      };
      const overall = Math.round(
        Object.values(final).reduce((a, b) => a + b, 0) / 6
      );
      setScores(final);
      setStep("results");
      onScoreReady(final, overall);
    }
  };

  const overall = scores
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6)
    : 0;

  // ── QUIZ VIEW ─────────────────────────────────────────────────────────────
  if (step === "quiz") {
    const q        = QUESTIONS[qIndex];
    const progress = ((qIndex) / QUESTIONS.length) * 100;

    return (
      <div style={{ background: "#F0F2F5", minHeight: "100%", margin: "-36px -32px", padding: "40px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
              stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M3.22 12H9.5l1.5-3 2 4.5 1.5-3H20.78" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", fontFamily: "'Space Grotesk',sans-serif" }}>
              Money Health Score
            </div>
            <div style={{ fontSize: 14, color: "#9CA3AF", marginTop: 2 }}>
              6-dimension financial health assessment
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, whiteSpace: "nowrap" }}>
            Question {qIndex + 1} of {QUESTIONS.length}
          </span>
          <div style={{ flex: 1, height: 6, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3, background: "#F5A623",
              width: `${progress + (100 / QUESTIONS.length)}%`,
              transition: "width .4s ease",
            }} />
          </div>
        </div>

        {/* Question */}
        <h2 style={{
          fontSize: "clamp(18px,2.5vw,22px)", fontWeight: 700, color: "#111827",
          marginBottom: 28, lineHeight: 1.4,
          fontFamily: "'Space Grotesk',sans-serif", maxWidth: 700,
        }}>
          {q.q}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680 }}>
          {q.opts.map((opt, i) => {
            const selected = answers[q.id] === q.scores[i];
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                style={{
                  width: "100%", padding: "20px 22px", borderRadius: 14,
                  background: selected ? "#FFF8EE" : "#fff",
                  border: `1.5px solid ${selected ? "#F5A623" : "#E5E7EB"}`,
                  fontFamily: "Inter,sans-serif", fontSize: 16, fontWeight: 500,
                  color: "#111827", cursor: "pointer", textAlign: "left",
                  transition: "all .15s",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <span>{opt}</span>
                {selected && (
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                    stroke="#F5A623" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Back */}
        {qIndex > 0 && (
          <button
            onClick={() => setQIndex(i => i - 1)}
            style={{
              marginTop: 28, display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 14, color: "#9CA3AF", background: "none", border: "none",
              cursor: "pointer", fontFamily: "Inter,sans-serif", fontWeight: 500,
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
              stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        )}
      </div>
    );
  }

  // ── RESULTS VIEW (screenshots 6 + 7) ─────────────────────────────────────
  const dims = Object.keys(DIM_META) as DimKey[];
  const sortedWeak = dims
    .filter(d => (scores?.[d] ?? 0) < 70)
    .sort((a, b) => (scores?.[a] ?? 0) - (scores?.[b] ?? 0));

  return (
    <div style={{ background: "#F0F2F5", minHeight: "100%", margin: "-36px -32px", padding: "40px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
            stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l1.5-3 2 4.5 1.5-3H20.78" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", fontFamily: "'Space Grotesk',sans-serif" }}>
            Money Health Score
          </div>
          <div style={{ fontSize: 14, color: "#9CA3AF", marginTop: 2 }}>
            6-dimension financial health assessment
          </div>
        </div>
      </div>

      {/* Circle score */}
      <div style={{ marginBottom: 36 }}>
        <CircleScore score={overall} />
        <p style={{
          textAlign: "center", marginTop: 8, fontSize: 15, fontWeight: 600,
          color: overall < 40 ? "#EF4444" : overall < 65 ? "#F59E0B" : "#10B981",
        }}>
          {scoreLabel(overall)}
        </p>
      </div>

      {/* Radar chart in white card */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: "28px 24px",
        border: "1px solid #F3F4F6", marginBottom: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <RadarChart
          scores={dims.map(d => scores?.[d] ?? 0)}
          labels={dims.map(d => DIM_META[d].label.split(" ")[0])}
          size={300}
          theme="light"
        />
      </div>

      {/* 2-col dimension cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {dims.map(dim => (
          <ScoreCard
            key={dim}
            label={DIM_META[dim].label}
            score={scores?.[dim] ?? 0}
            onClick={() => onNavigate(DIM_META[dim].module as ModuleId)}
          />
        ))}
      </div>

      {/* Next steps card */}
      {sortedWeak.length > 0 && (
        <div style={{
          background: "#fff", borderRadius: 16, padding: "24px",
          border: "1px solid #F3F4F6", marginBottom: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            fontSize: 16, fontWeight: 700, color: "#111827",
            fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16,
          }}>
            Recommended Next Steps
          </div>

          {sortedWeak.slice(0, 4).map((dim, i) => {
            const meta = DIM_META[dim];
            return (
              <div
                key={dim}
                onClick={() => onNavigate(meta.module as ModuleId)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "14px 0",
                  borderBottom: i < Math.min(sortedWeak.length, 4) - 1 ? "1px solid #F3F4F6" : "none",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: i === 0 ? "rgba(245,166,35,0.12)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${i === 0 ? "rgba(245,166,35,0.3)" : "rgba(239,68,68,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 800,
                    color: i === 0 ? "#F5A623" : "#EF4444",
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}>
                    {i + 1}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 3 }}>
                    Fix {meta.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{meta.tip}</div>
                </div>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                  stroke="#D1D5DB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* Retake */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => { setStep("quiz"); setQIndex(0); setAnswers({}); }}
          style={{
            background: "transparent", border: "1.5px solid #E5E7EB",
            borderRadius: 10, padding: "10px 22px",
            fontSize: 14, fontWeight: 500, color: "#6B7280",
            fontFamily: "Inter,sans-serif", cursor: "pointer",
          }}
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
}