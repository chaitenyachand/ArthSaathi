import { useState } from "react";
import { calculateTax, type TaxInput } from "../utils/tax";
import { formatINRFull } from "../utils/formatINR";
import { COLORS } from "../utils/constants";

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, ...style }}>
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5, display: "block" }}>
    {children}
  </label>
);

const Input = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <input
    type="number" value={value} onChange={e => onChange(+e.target.value)}
    style={{
      background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10,
      color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14,
      padding: "11px 14px", width: "100%", outline: "none",
    }}
    onFocus={e => (e.target.style.borderColor = COLORS.primary)}
    onBlur={e  => (e.target.style.borderColor = COLORS.border)}
  />
);

export default function TaxWizard() {
  const [form, setForm] = useState<TaxInput>({
    grossSalary:      1500000,
    basicSalary:       600000,
    hraReceived:       240000,
    rentPaid:          240000,
    city:              "metro",
    epfEmployee:        75000,
    elssAndOther80C:        0,
    section24b:             0,
    nps80CCD:               0,
    healthSelf:         25000,
    healthParents:          0,
    parentsSenior:      false,
    professionalTax:     2400,
  });
  const [result, setResult] = useState<ReturnType<typeof calculateTax> | null>(null);

  const sf = <K extends keyof TaxInput>(k: K, v: TaxInput[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const numFields: { key: keyof TaxInput; label: string }[] = [
    { key: "grossSalary",       label: "Gross Annual Salary (₹)"       },
    { key: "basicSalary",       label: "Basic Salary (₹/year)"         },
    { key: "hraReceived",       label: "HRA Received (₹/year)"         },
    { key: "rentPaid",          label: "Rent Paid (₹/year)"            },
    { key: "epfEmployee",       label: "EPF Employee Contribution (₹)" },
    { key: "elssAndOther80C",   label: "ELSS / PPF / Other 80C (₹)"   },
    { key: "section24b",        label: "Home Loan Interest 24(b) (₹)"  },
    { key: "nps80CCD",          label: "NPS Contribution 80CCD(1B) (₹)"},
    { key: "healthSelf",        label: "Health Insurance — Self (₹)"   },
    { key: "healthParents",     label: "Health Insurance — Parents (₹)"},
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Core Module F2</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Tax Wizard</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          Old vs new regime comparison plus every deduction you are missing. Based on Income Tax Act FY 2024-25.
        </p>
      </div>

      {/* Input grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        {numFields.map(({ key, label }) => (
          <div key={key}>
            <Label>{label}</Label>
            <Input value={form[key] as number} onChange={v => sf(key, v as any)} />
          </div>
        ))}
      </div>

      {/* City + Senior */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div>
          <Label>City Type</Label>
          <select
            value={form.city}
            onChange={e => sf("city", e.target.value as "metro" | "nonmetro")}
            style={{
              background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10,
              color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14,
              padding: "11px 14px", width: "100%", outline: "none",
            }}
          >
            <option value="metro">Metro (Delhi, Mumbai, Kolkata, Chennai)</option>
            <option value="nonmetro">Non-Metro</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
          <input
            type="checkbox" id="senior" checked={form.parentsSenior}
            onChange={e => sf("parentsSenior", e.target.checked)}
            style={{ accentColor: COLORS.primary, width: 16, height: 16 }}
          />
          <label htmlFor="senior" style={{ fontSize: 14, color: COLORS.muted, cursor: "pointer" }}>
            Parents are senior citizens (60+)
          </label>
        </div>
      </div>

      <button
        onClick={() => setResult(calculateTax(form))}
        style={{
          width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
          background: COLORS.primary, color: "#000",
          fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer",
          marginBottom: 28,
        }}
      >
        Calculate My Tax
      </button>

      {/* Results */}
      {result && (
        <div>
          {/* Regime comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            {[
              { label: "Old Regime Tax", val: result.oldTaxNet, best: result.betterRegime === "old" },
              { label: "New Regime Tax", val: result.newTaxNet, best: result.betterRegime === "new" },
            ].map(({ label, val, best }) => (
              <Card key={label} style={{ padding: 20, border: best ? `2px solid ${COLORS.primary}` : undefined }}>
                <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: best ? COLORS.primary : COLORS.fg, fontFamily: "'Space Grotesk',monospace", marginBottom: 6 }}>
                  {formatINRFull(val)}
                </div>
                {best && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20,
                    background: COLORS.primaryDim, color: COLORS.primary,
                    border: `1px solid rgba(0,200,150,0.3)`,
                  }}>
                    Better for you — saves {formatINRFull(result.saving)}
                  </span>
                )}
              </Card>
            ))}
          </div>

          {/* Deduction breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "HRA Exempt",  val: result.hraExemption },
              { label: "Section 80C", val: result.sec80C },
              { label: "Section 80D", val: result.sec80D },
              { label: "NPS 80CCD",   val: result.sec80CCD },
            ].map(({ label, val }) => (
              <Card key={label} style={{ padding: 16, textAlign: "center" as const }}>
                <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary, fontFamily: "'Space Grotesk',monospace" }}>
                  {formatINRFull(val)}
                </div>
              </Card>
            ))}
          </div>

          {/* Missing deductions */}
          {result.missingDeductions.length > 0 && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.accent, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <path d="M12 9v4" /><path d="M12 17h.01" />
                </svg>
                Missed Deductions Found
              </div>
              {result.missingDeductions.map(m => (
                <Card key={m.section} style={{ padding: 16, marginBottom: 10, borderLeft: `3px solid ${COLORS.accent}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20,
                        background: COLORS.accentDim, color: COLORS.accent,
                        border: `1px solid rgba(245,166,35,0.3)`, marginBottom: 6, display: "inline-block",
                      }}>
                        Section {m.section}
                      </span>
                      <div style={{ fontWeight: 500, marginTop: 4 }}>{m.description}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>Invest up to {formatINRFull(m.maxAmount)}</div>
                    </div>
                    <div style={{ textAlign: "right" as const }}>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>Tax saving</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.accent, fontFamily: "'Space Grotesk',monospace" }}>
                        {formatINRFull(m.potentialSaving)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}