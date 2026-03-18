import { useState } from "react";
import { useCAMSData }  from "../hooks/useCAMSData";
import MiniBarChart     from "../components/MiniBarChart";
import { COLORS }       from "../utils/constants";
import { formatINR, formatINRFull, formatPct } from "../utils/formatINR";

// ─── INLINE ICON ──────────────────────────────────────────────────────────────
const Ic = ({ d, size = 18, color = "currentColor" }: { d: string | string[]; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

// ─── SHARED UI ATOMS ──────────────────────────────────────────────────────────
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
    borderRadius: 14, ...style,
  }}>
    {children}
  </div>
);

const StatBox = ({ label, value, color = COLORS.primary }: { label: string; value: string; color?: string }) => (
  <Card style={{ padding: 18 }}>
    <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'Space Grotesk',monospace" }}>{value}</div>
  </Card>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
    {children}
  </div>
);

const Badge = ({
  children, variant = "green",
}: { children: React.ReactNode; variant?: "green" | "red" | "gold" | "muted" }) => {
  const styles = {
    green: { bg: COLORS.primaryDim, color: COLORS.primary, border: "rgba(0,200,150,0.3)" },
    red:   { bg: COLORS.redDim,     color: COLORS.red,     border: "rgba(248,113,113,0.3)" },
    gold:  { bg: COLORS.accentDim,  color: COLORS.accent,  border: "rgba(245,166,35,0.3)" },
    muted: { bg: "rgba(255,255,255,0.05)", color: COLORS.muted, border: COLORS.border },
  }[variant];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 9px",
      borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" as const,
      background: styles.bg, color: styles.color, border: `1px solid ${styles.border}`,
    }}>
      {children}
    </span>
  );
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function MFPortfolioXRay() {
  const { data, loading, error, loadDemo, loadFile } = useCAMSData();
  const [aiPlan,      setAIPlan]      = useState("");
  const [aiLoading,   setAILoading]   = useState(false);
  const [uploadMode,  setUploadMode]  = useState<"demo" | "upload">("demo");

  const getAIPlan = async () => {
    if (!data.parsed) return;
    setAILoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are ArthSaathi, an Indian personal finance AI. Given this portfolio analysis, provide a 4-step rebalancing plan in plain English:

Portfolio facts:
- True XIRR: ${formatPct(data.xirr * 100)} vs Nifty 50 benchmark 12.1%
- Overlap score: ${data.overlapScore}% across large-cap funds
- Commission paid to distributor (5 years): ${formatINRFull(data.commissionPaid5yr)}
- 20-year projected commission: ${formatINRFull(data.commissionProjected20yr)}
- Regular plan holdings: ${data.holdings.filter(h => h.plan === "Regular").map(h => h.fundName).join(", ")}
- Direct plan holdings: ${data.holdings.filter(h => h.plan === "Direct").map(h => h.fundName).join(", ")}

Write exactly 4 numbered steps. Be specific: name funds, rupee amounts, LTCG timing. Under 250 words.`,
          }],
        }),
      });
      const json = await res.json();
      setAIPlan(json.content?.[0]?.text ?? "Could not generate plan.");
    } catch {
      setAIPlan("AI plan unavailable. Please check your connection.");
    }
    setAILoading(false);
  };

  // ── Not yet loaded ─────────────────────────────────────────────────────────
  if (!data.parsed) {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
            Core Module F1
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>
            MF Portfolio X-Ray
          </h2>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
            Upload your CAMS Consolidated Statement to get your true XIRR, overlap analysis, hidden fee exposure, and an AI rebalancing plan in 10 seconds.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {(["demo", "upload"] as const).map(m => (
            <button key={m} onClick={() => setUploadMode(m)} style={{
              flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer",
              fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 500,
              border: `1px solid ${uploadMode === m ? COLORS.primary : COLORS.border}`,
              background: uploadMode === m ? COLORS.primaryDim : "transparent",
              color: uploadMode === m ? COLORS.primary : COLORS.muted,
              transition: "all .15s",
            }}>
              {m === "demo" ? "Use Demo Portfolio" : "Upload CAMS PDF"}
            </button>
          ))}
        </div>

        {uploadMode === "demo" ? (
          <Card style={{ padding: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Demo Portfolio</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20, lineHeight: 1.6 }}>
              4 funds · ₹13.8L current value · 5 years of SIPs · Regular and Direct mix.
              This sample CAMS data replicates a real investor portfolio with 73% overlap and hidden commission exposure.
            </div>
            <button
              className="btn-primary"
              onClick={loadDemo}
              disabled={loading}
              style={{
                width: "100%", justifyContent: "center",
                background: COLORS.primary, color: "#000",
                padding: "12px 0", borderRadius: 10, border: "none",
                fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? .6 : 1,
              }}
            >
              {loading ? "Analysing..." : "Run X-Ray Analysis"}
            </button>
          </Card>
        ) : (
          <Card style={{ padding: 40, textAlign: "center", borderStyle: "dashed" }}>
            <Ic d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]} size={36} color={COLORS.muted} />
            <div style={{ fontWeight: 600, margin: "14px 0 6px" }}>Upload CAMS Consolidated Statement</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>
              Download from camsonline.com → Consolidated Account Statement PDF
            </div>
            <label style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 10,
              background: COLORS.primaryDim, border: `1px solid rgba(0,200,150,0.25)`,
              color: COLORS.primary, fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>
              Choose File
              <input type="file" accept=".pdf" style={{ display: "none" }}
                onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); }} />
            </label>
          </Card>
        )}

        {error && (
          <div style={{ marginTop: 14, padding: 14, borderRadius: 10,
            background: COLORS.redDim, border: `1px solid rgba(248,113,113,0.2)`,
            fontSize: 14, color: COLORS.red }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  // ── Results view ───────────────────────────────────────────────────────────
  const xirrPct = data.xirr * 100;
  const benchmark = 12.1;
  const gap = benchmark - xirrPct;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Core Module F1</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>MF Portfolio X-Ray</h2>
          <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{data.fileName ?? "CAMS Statement"} · {data.holdings.length} funds</p>
        </div>
        <button onClick={() => { }} style={{
          padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
          background: "transparent", color: COLORS.muted, fontSize: 13, cursor: "pointer",
          fontFamily: "Inter,sans-serif",
        }}>
          New Analysis
        </button>
      </div>

      {/* Return comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 14 }}>
        <StatBox label="Apparent Return"       value={`${data.totalCurrent > data.totalInvested ? ((data.totalCurrent/data.totalInvested-1)*100).toFixed(1) : "0.0"}%`} color={COLORS.muted} />
        <StatBox label="True XIRR"             value={formatPct(xirrPct)} color={COLORS.red} />
        <StatBox label="Nifty 50 Benchmark"    value={formatPct(benchmark)} color={COLORS.primary} />
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 10, marginBottom: 20,
        background: COLORS.redDim, border: `1px solid rgba(248,113,113,0.2)`, fontSize: 14, color: COLORS.fg, lineHeight: 1.6 }}>
        You are earning <strong style={{ color: COLORS.red }}>{formatPct(gap)} less per year</strong> than the index benchmark.
        On ₹10L over 20 years, this gap compounds to <strong style={{ color: COLORS.red }}>₹38.2 lakhs</strong> of foregone wealth.
      </div>

      {/* Portfolio value */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
        <StatBox label="Total Invested" value={formatINR(data.totalInvested)} color={COLORS.muted} />
        <StatBox label="Current Value"  value={formatINR(data.totalCurrent)}  color={COLORS.primary} />
      </div>

      {/* Mini bar chart of holdings */}
      <Card style={{ padding: 20, marginBottom: 16 }}>
        <SectionTitle>Fund Allocation</SectionTitle>
        <MiniBarChart
          data={data.holdings.map(h => ({ label: h.fundName.split(" ")[0], value: h.currentValue }))}
          height={64} showLabels
        />
      </Card>

      {/* Overlap */}
      <Card style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <SectionTitle>Portfolio Overlap</SectionTitle>
          <span style={{ fontSize: 28, fontWeight: 900, color: COLORS.red, fontFamily: "'Space Grotesk',monospace" }}>
            {data.overlapScore}%
          </span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ height: "100%", borderRadius: 3, background: COLORS.red, width: `${data.overlapScore}%`, transition: "width 1s" }} />
        </div>
        <p style={{ fontSize: 13, color: COLORS.muted }}>
          Your 3 large-cap funds hold the same top stocks. You are paying for 3 funds but effectively owning 1.
        </p>
      </Card>

      {/* Fund table */}
      <Card style={{ padding: 20, marginBottom: 16 }}>
        <SectionTitle>
          <Ic d={["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]} size={16} color={COLORS.accent} />
          Cost of Bad Advice Detector
        </SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {["Fund", "Plan", "Category", "Expense Ratio", "Direct Equiv.", "Annual Drag"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: COLORS.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.holdings.map(f => {
                const drag = ((f.expenseRatio - f.directExpenseRatio) / 100) * f.currentValue;
                const isReg = f.plan === "Regular";
                return (
                  <tr key={f.folio} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 500 }}>{f.fundName}</div>
                      <Badge variant={isReg ? "red" : "green"}>{f.plan}</Badge>
                    </td>
                    <td style={{ padding: "12px", color: COLORS.muted }}>{f.category}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontFamily: "'Space Grotesk',monospace", color: isReg ? COLORS.red : COLORS.primary, fontWeight: 700 }}>
                        {formatPct(f.expenseRatio)}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontFamily: "'Space Grotesk',monospace", color: COLORS.primary }}>
                        {formatPct(f.directExpenseRatio)}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {isReg
                        ? <span style={{ fontFamily: "'Space Grotesk',monospace", color: COLORS.red, fontWeight: 700 }}>{formatINRFull(drag)}</span>
                        : <span style={{ color: COLORS.primary, fontSize: 12 }}>Optimal</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{
          marginTop: 16, padding: "14px 16px", borderRadius: 10,
          background: COLORS.redDim, border: `1px solid rgba(248,113,113,0.2)`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Your distributor earned from your portfolio:</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>20-year projection if not switched</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.red, fontFamily: "'Space Grotesk',monospace" }}>
              {formatINRFull(data.commissionPaid5yr)}
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{formatINR(data.commissionProjected20yr)} over 20 years</div>
          </div>
        </div>
      </Card>

      {/* AI Rebalancing Plan */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionTitle>
            <Ic d={["M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.6A3 3 0 0 1 4 11c0-1.38.93-2.54 2.2-2.9A2.5 2.5 0 0 1 9.5 2z","M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.6A3 3 0 0 0 20 11c0-1.38-.93-2.54-2.2-2.9A2.5 2.5 0 0 0 14.5 2z"]} size={16} color={COLORS.primary} />
            AI Rebalancing Plan
          </SectionTitle>
          {!aiPlan && (
            <button
              onClick={getAIPlan} disabled={aiLoading}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "none",
                background: COLORS.primary, color: "#000",
                fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700,
                cursor: aiLoading ? "not-allowed" : "pointer", opacity: aiLoading ? .6 : 1,
              }}
            >
              {aiLoading ? "Generating..." : "Generate Plan"}
            </button>
          )}
        </div>
        {aiLoading && (
          <p style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>
            Analysing your portfolio with Claude...
          </p>
        )}
        {aiPlan && (
          <div style={{
            fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap", color: COLORS.fg,
            background: COLORS.primaryDim, padding: 16, borderRadius: 10,
            border: `1px solid rgba(0,200,150,0.15)`,
          }}>
            {aiPlan}
          </div>
        )}
        {!aiPlan && !aiLoading && (
          <p style={{ fontSize: 13, color: COLORS.muted }}>
            Click Generate Plan to get a personalised 4-step rebalancing recommendation powered by Claude.
          </p>
        )}
      </Card>
    </div>
  );
}