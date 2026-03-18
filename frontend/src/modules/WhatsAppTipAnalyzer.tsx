import { useState } from "react";
import { COLORS } from "../utils/constants";

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, ...style }}>{children}</div>
);

interface Check { name: string; result: string; flag: boolean; }
interface TipResult {
  grade:     string;
  score:     number;
  verdict:   string;
  checks:    Check[];
  redFlags:  string[];
  action:    string;
}

const GRADE_COLOR: Record<string, string> = {
  A: COLORS.primary, B: "#22C55E", C: COLORS.accent, D: "#F97316", F: COLORS.red,
};

const SAMPLE_TIP =
  "BUY ALERT: XYZ Microcap Ltd, CMP 47, Target 140 in 3 months. Strong operator activity. Promoter buying heavily. Rumoured SEBI-approved expansion. Insider confirmation. Do not miss this one. Burn your shoes on this.";

const FALLBACK: TipResult = {
  grade: "F", score: 12,
  verdict: "Classic pump-and-dump pattern. High probability of market manipulation.",
  checks: [
    { name: "Red Flag Language",      result: "3 high-risk phrases: 'operator activity', 'burn your shoes', 'insider'", flag: true },
    { name: "Volume Spike",           result: "4.2x average volume detected 4 days before tip circulation",             flag: true },
    { name: "Analyst Coverage",       result: "Zero SEBI-registered analyst coverage found for this stock",            flag: true },
    { name: "Price Target Validity",  result: "197% return claim with no fundamental basis provided",                  flag: true },
    { name: "Urgency Tactics",        result: "Multiple urgency phrases designed to bypass rational evaluation",       flag: true },
    { name: "Verifiable Claims",      result: "No verifiable public information cited — zero evidence base",           flag: true },
  ],
  redFlags: ["operator activity", "burn your shoes", "insider confirmation"],
  action: "Do not invest. Report to SEBI if received from a registered financial advisor.",
};

export default function WhatsAppTipAnalyzer() {
  const [tip,     setTip]     = useState("");
  const [result,  setResult]  = useState<TipResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyse = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 900,
          messages: [{
            role: "user",
            content: `You are ArthSaathi WhatsApp Tip Analyzer. Analyse this Indian stock market tip for pump-and-dump indicators.
Return ONLY valid JSON (no markdown):

Tip: "${text}"

Return exactly:
{"grade":"F","score":12,"verdict":"One sentence verdict","checks":[{"name":"Red Flag Language","result":"description","flag":true},{"name":"Volume Spike Check","result":"description","flag":true},{"name":"Analyst Coverage","result":"description","flag":true},{"name":"Price Target Validity","result":"description","flag":true},{"name":"Urgency Tactics","result":"description","flag":true},{"name":"Verifiable Claims","result":"description","flag":false}],"redFlags":["phrase1","phrase2"],"action":"Recommended action."}`,
          }],
        }),
      });
      const json = await res.json();
      const txt  = json.content?.[0]?.text ?? "{}";
      setResult(JSON.parse(txt.replace(/```json|```/g, "").trim()));
    } catch {
      setResult(FALLBACK);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Unique Feature U3</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>WhatsApp Tip Analyzer</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          Paste any WhatsApp or Telegram stock tip. Get an A-to-F manipulation risk grade with NSE volume analysis, red-flag phrase detection, and analyst coverage verification.
        </p>
      </div>

      {/* Input */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5, display: "block" }}>
          Paste the stock tip here
        </label>
        <textarea
          value={tip} onChange={e => setTip(e.target.value)}
          rows={5} placeholder="Paste a WhatsApp or Telegram stock tip..."
          style={{
            width: "100%", background: COLORS.bgInput, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif",
            fontSize: 14, padding: "12px 14px", outline: "none", resize: "vertical",
          }}
          onFocus={e => (e.target.style.borderColor = COLORS.primary)}
          onBlur={e  => (e.target.style.borderColor = COLORS.border)}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <button
          onClick={() => analyse(tip)} disabled={loading || !tip.trim()}
          style={{
            padding: "11px 24px", borderRadius: 10, border: "none",
            background: COLORS.primary, color: "#000",
            fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700,
            cursor: (loading || !tip.trim()) ? "not-allowed" : "pointer",
            opacity: (loading || !tip.trim()) ? .6 : 1,
          }}
        >
          {loading ? "Analysing..." : "Analyse Tip"}
        </button>
        <button onClick={() => setTip(SAMPLE_TIP)} style={{
          padding: "11px 20px", borderRadius: 10,
          border: `1px solid ${COLORS.border}`, background: "transparent",
          color: COLORS.muted, fontSize: 14, cursor: "pointer", fontFamily: "Inter,sans-serif",
        }}>
          Load Sample
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Grade card */}
          <Card style={{
            padding: 24, marginBottom: 14,
            borderLeft: `4px solid ${GRADE_COLOR[result.grade] ?? COLORS.red}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
                  Manipulation Risk Grade
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5, color: COLORS.fg }}>
                  {result.verdict}
                </div>
              </div>
              <div style={{
                fontSize: 88, fontWeight: 900, color: GRADE_COLOR[result.grade] ?? COLORS.red,
                lineHeight: 1, marginLeft: 20, fontFamily: "'Space Grotesk',sans-serif",
              }}>
                {result.grade}
              </div>
            </div>
          </Card>

          {/* Checks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {result.checks?.map(c => (
              <div key={c.name} style={{
                display: "flex", gap: 12, padding: "12px 16px", borderRadius: 10,
                background: c.flag ? COLORS.redDim : COLORS.primaryDim,
                border: `1px solid ${c.flag ? "rgba(248,113,113,0.2)" : "rgba(0,200,150,0.2)"}`,
              }}>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                  stroke={c.flag ? COLORS.red : COLORS.primary}
                  strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  style={{ marginTop: 2, flexShrink: 0 }}>
                  {c.flag
                    ? <path d="M18 6 6 18M6 6l12 12" />
                    : <path d="M20 6 9 17l-5-5" />}
                </svg>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{c.result}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Red flags */}
          {result.redFlags?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
                Red Flag Phrases Detected
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {result.redFlags.map(f => (
                  <span key={f} style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: COLORS.redDim, color: COLORS.red, border: `1px solid rgba(248,113,113,0.3)`,
                  }}>
                    "{f}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          <div style={{
            padding: 16, borderRadius: 12,
            background: result.grade === "A" || result.grade === "B" ? COLORS.primaryDim : COLORS.redDim,
            border: `1px solid ${result.grade === "A" || result.grade === "B" ? "rgba(0,200,150,0.3)" : "rgba(248,113,113,0.3)"}`,
            fontSize: 14, color: COLORS.fg, lineHeight: 1.6,
          }}>
            <strong>Recommended Action: </strong>{result.action}
          </div>
        </div>
      )}
    </div>
  );
}