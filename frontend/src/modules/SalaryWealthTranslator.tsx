import { useState } from "react";
import { futureValue } from "../utils/finance";
import { formatINR } from "../utils/formatINR";
import { COLORS } from "../utils/constants";

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, ...style }}>{children}</div>
);
const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5, display: "block" }}>{children}</label>
);

const MODES = [
  {
    id: "increment" as const,
    label: "Salary Increment",
    desc: "See the retirement value of your next salary hike",
    inputLabel: "Annual increment amount (₹)",
    insight: (v: string) => `That salary negotiation conversation is worth ${v}.`,
    toMonthly: (amount: number) => amount / 12,
  },
  {
    id: "expense" as const,
    label: "Expense Trade-off",
    desc: "What redirecting a monthly spend would create",
    inputLabel: "Monthly expense to redirect (₹)",
    insight: (v: string) => `You are choosing ${v} versus this monthly expense.`,
    toMonthly: (amount: number) => amount,
  },
  {
    id: "income" as const,
    label: "Side Income",
    desc: "Lifetime wealth from freelance or rental income",
    inputLabel: "Monthly additional income (₹)",
    insight: (v: string) => `You are not running a side hustle. You are building a ${v} business.`,
    toMonthly: (amount: number) => amount,
  },
];

export default function SalaryWealthTranslator() {
  const [mode,       setMode]       = useState<"increment" | "expense" | "income">("increment");
  const [amount,     setAmount]     = useState(300000);
  const [age,        setAge]        = useState(32);
  const [retireAge,  setRetireAge]  = useState(60);

  const currentMode = MODES.find(m => m.id === mode)!;
  const yrs         = Math.max(1, retireAge - age);
  const monthly     = currentMode.toMonthly(amount);
  const fvResult    = futureValue(12, yrs * 12, monthly);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Unique Feature U6</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Salary-to-Wealth Translator</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          Convert any rupee amount into its retirement corpus equivalent at 12% CAGR. Every financial trade-off, made visible.
        </p>
      </div>

      {/* Mode selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: "14px 18px", borderRadius: 10, cursor: "pointer", textAlign: "left",
            fontFamily: "Inter,sans-serif", border: `1px solid ${mode === m.id ? COLORS.primary : COLORS.border}`,
            background: mode === m.id ? COLORS.primaryDim : "transparent", color: COLORS.fg,
            transition: "all .15s",
          }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
        <div>
          <Label>{currentMode.inputLabel}</Label>
          <input type="number" value={amount} onChange={e => setAmount(+e.target.value)}
            style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", width: "100%", outline: "none" }}
            onFocus={e => (e.target.style.borderColor = COLORS.primary)}
            onBlur={e  => (e.target.style.borderColor = COLORS.border)}
          />
        </div>
        {[
          { label: "Current Age", val: age, set: setAge },
          { label: "Retirement Age", val: retireAge, set: setRetireAge },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <Label>{label}</Label>
            <input type="number" value={val} onChange={e => set(+e.target.value)}
              style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", width: "100%", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e  => (e.target.style.borderColor = COLORS.border)}
            />
          </div>
        ))}
      </div>

      {/* Hero result */}
      <div style={{
        padding: "36px 28px", borderRadius: 16, textAlign: "center", marginBottom: 24,
        background: COLORS.primaryDim, border: `1px solid rgba(0,200,150,0.2)`,
      }}>
        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>
          {mode === "increment"
            ? `${formatINR(amount)}/year increment`
            : `${formatINR(monthly)}/month`}
          , invested for {yrs} years at 12% CAGR, becomes:
        </div>
        <div style={{
          fontSize: "clamp(44px,8vw,72px)", fontWeight: 900, lineHeight: 1,
          fontFamily: "'Space Grotesk',sans-serif",
          background: "linear-gradient(135deg,#00C896,#00A878)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {formatINR(fvResult)}
        </div>
        <div style={{ marginTop: 16, fontSize: 15, color: COLORS.fg, fontStyle: "italic", lineHeight: 1.5 }}>
          {currentMode.insight(formatINR(fvResult))}
        </div>
      </div>

      {/* Year breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[10, 20, 30].map(y => (
          <Card key={y} style={{ padding: 18, textAlign: "center" as const }}>
            <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
              {y} Year Value
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.primary, fontFamily: "'Space Grotesk',monospace" }}>
              {formatINR(futureValue(12, y * 12, monthly))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}