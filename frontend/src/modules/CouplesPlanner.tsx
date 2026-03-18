import { useState } from "react";
import { COLORS } from "../utils/constants";
import { formatINRFull, formatINR } from "../utils/formatINR";

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, ...style }}>{children}</div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5, display: "block" }}>{children}</label>
);

const Inp = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <input type="number" value={value} onChange={e => onChange(+e.target.value)}
    style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", width: "100%", outline: "none" }}
    onFocus={e => (e.target.style.borderColor = COLORS.primary)}
    onBlur={e  => (e.target.style.borderColor = COLORS.border)}
  />
);

interface Partner {
  income:        number;
  basic:         number;
  hra:           number;
  rent:          number;
  epf:           number;
  elss:          number;
  nps:           number;
  npsMatching:   boolean;   // employer offers NPS matching
  healthCover:   number;
  mfValue:       number;
}

const DEFAULT_A: Partner = { income: 1800000, basic: 720000, hra: 360000, rent: 300000, epf: 90000, elss: 60000, nps: 0, npsMatching: true,  healthCover: 500000, mfValue: 800000 };
const DEFAULT_B: Partner = { income: 1200000, basic: 480000, hra: 240000, rent: 0,      epf: 60000, elss: 0,     nps: 0, npsMatching: false, healthCover: 500000, mfValue: 300000 };

interface Results {
  hraA:           number;
  hraB:           number;
  hraSaving:      number;
  npsAlert:       { partnerLabel: string; matchAmount: number } | null;
  ltcgSaving:     number;
  insuranceSaving: number;
  netWorth:       number;
  totalHLV:       number;
}

const calcResults = (a: Partner, b: Partner, city: string): Results => {
  const metro = city === "metro";

  // HRA exemption for each partner
  const hraEx = (p: Partner) =>
    Math.max(0, Math.min(p.hra, (metro ? 0.5 : 0.4) * p.basic, (p.rent || p.rent) - 0.1 * p.basic));

  const hraA = hraEx(a);
  // Partner B can declare rent even if same address — legal
  const hraB = b.hra > 0 ? hraEx({ ...b, rent: b.rent > 0 ? b.rent : a.rent * 0.4 }) : 0;

  const bracket = (income: number) => (income > 1000000 ? 0.3 : income > 500000 ? 0.2 : 0.05);
  const hraSaving = Math.round(hraA * bracket(a.income) + hraB * bracket(b.income));

  // NPS employer match alert
  const npsAlert = a.npsMatching && a.nps < 60000
    ? { partnerLabel: "Partner A", matchAmount: 60000 - a.nps }
    : b.npsMatching && b.nps < 60000
      ? { partnerLabel: "Partner B", matchAmount: 60000 - b.nps }
      : null;

  // LTCG: each partner gets ₹1L exemption on equity MF gains
  const ltcgSaving = Math.round(100000 * 0.1);  // ₹10,000 per partner per year

  // Insurance: family floater typically 20–30% cheaper
  const combinedCover = a.healthCover + b.healthCover;
  const floaterPremium = Math.round(combinedCover * 0.012);         // rough 1.2% of sum insured
  const individualPremium = Math.round(combinedCover * 0.016);      // 1.6% combined individual
  const insuranceSaving = Math.max(0, individualPremium - floaterPremium);

  const netWorth = a.mfValue + b.mfValue + a.epf + b.epf;
  const totalHLV = (a.income * 30) + (b.income * 30);  // simplified

  return { hraA, hraB, hraSaving, npsAlert, ltcgSaving, insuranceSaving, netWorth, totalHLV };
};

export default function CouplesPlanner() {
  const [partnerA, setA]    = useState<Partner>(DEFAULT_A);
  const [partnerB, setB]    = useState<Partner>(DEFAULT_B);
  const [city,     setCity] = useState("metro");
  const [results,  setRes]  = useState<Results | null>(null);

  const sfA = (k: keyof Partner, v: number | boolean) => setA(p => ({ ...p, [k]: v }));
  const sfB = (k: keyof Partner, v: number | boolean) => setB(p => ({ ...p, [k]: v }));

  const FIELDS: { k: keyof Partner; label: string }[] = [
    { k: "income",     label: "Annual Income (₹)"         },
    { k: "basic",      label: "Basic Salary (₹/yr)"       },
    { k: "hra",        label: "HRA Received (₹/yr)"       },
    { k: "rent",       label: "Rent Paid (₹/yr)"          },
    { k: "epf",        label: "EPF Contribution (₹/yr)"   },
    { k: "elss",       label: "ELSS / 80C Investments (₹)" },
    { k: "nps",        label: "NPS Contribution (₹/yr)"   },
    { k: "healthCover",label: "Health Cover (₹)"          },
    { k: "mfValue",    label: "MF Portfolio Value (₹)"    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Core Module F6</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Couple's Money Planner</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          India's first AI tool for joint financial planning. Two incomes unlock specific optimisations that individual planning completely misses — HRA splitting, LTCG doubling, NPS matching, and insurance consolidation.
        </p>
      </div>

      {/* City */}
      <div style={{ marginBottom: 20 }}>
        <Label>City Type</Label>
        <select value={city} onChange={e => setCity(e.target.value)}
          style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", width: 300, outline: "none" }}>
          <option value="metro">Metro (Delhi, Mumbai, Kolkata, Chennai)</option>
          <option value="nonmetro">Non-Metro</option>
        </select>
      </div>

      {/* Two-column partner inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Partner A */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: COLORS.primary }}>Partner A</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FIELDS.map(({ k, label }) => (
              <div key={k}>
                <Label>{label}</Label>
                <Inp value={partnerA[k] as number} onChange={v => sfA(k, v)} />
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="npsA" checked={partnerA.npsMatching}
                onChange={e => sfA("npsMatching", e.target.checked)}
                style={{ accentColor: COLORS.primary, width: 16, height: 16 }} />
              <label htmlFor="npsA" style={{ fontSize: 13, color: COLORS.muted, cursor: "pointer" }}>Employer offers NPS matching</label>
            </div>
          </div>
        </Card>

        {/* Partner B */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: COLORS.accent }}>Partner B</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FIELDS.map(({ k, label }) => (
              <div key={k}>
                <Label>{label}</Label>
                <Inp value={partnerB[k] as number} onChange={v => sfB(k, v)} />
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="npsB" checked={partnerB.npsMatching}
                onChange={e => sfB("npsMatching", e.target.checked)}
                style={{ accentColor: COLORS.primary, width: 16, height: 16 }} />
              <label htmlFor="npsB" style={{ fontSize: 13, color: COLORS.muted, cursor: "pointer" }}>Employer offers NPS matching</label>
            </div>
          </div>
        </Card>
      </div>

      <button onClick={() => setRes(calcResults(partnerA, partnerB, city))} style={{
        width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
        background: COLORS.primary, color: "#000", fontFamily: "Inter,sans-serif",
        fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 28,
      }}>
        Find Joint Optimisations
      </button>

      {results && (
        <div>
          {/* Summary savings */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { l: "HRA Tax Saving/yr",      v: formatINRFull(results.hraSaving),      c: COLORS.primary },
              { l: "LTCG Saving/yr",         v: formatINRFull(results.ltcgSaving * 2),  c: COLORS.accent  },
              { l: "Insurance Saving/yr",    v: formatINRFull(results.insuranceSaving), c: COLORS.primary },
            ].map(({ l, v, c }) => (
              <Card key={l} style={{ padding: 18, textAlign: "center" as const }}>
                <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{l}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c, fontFamily: "'Space Grotesk',monospace" }}>{v}</div>
              </Card>
            ))}
          </div>

          {/* HRA optimisation */}
          <Card style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>HRA Optimisation</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div style={{ padding: 14, borderRadius: 10, background: COLORS.primaryDim, border: `1px solid rgba(0,200,150,0.2)` }}>
                <div style={{ fontSize: 11, color: COLORS.primary, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Partner A HRA Exempt</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary, fontFamily: "'Space Grotesk',monospace" }}>{formatINRFull(results.hraA)}</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: COLORS.accentDim, border: `1px solid rgba(245,166,35,0.2)` }}>
                <div style={{ fontSize: 11, color: COLORS.accent, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Partner B HRA Exempt</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent, fontFamily: "'Space Grotesk',monospace" }}>{formatINRFull(results.hraB)}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
              Both partners can legally claim HRA even if they live at the same address.
              The combined saving is <strong style={{ color: COLORS.primary }}>{formatINRFull(results.hraSaving)}/year</strong>.
            </p>
          </Card>

          {/* NPS match alert */}
          {results.npsAlert && (
            <div style={{ padding: 16, borderRadius: 12, marginBottom: 14,
              background: "rgba(245,166,35,0.08)", border: `1px solid rgba(245,166,35,0.25)` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, marginBottom: 4 }}>
                Free Money Alert — NPS Employer Match
              </div>
              <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.6 }}>
                {results.npsAlert.partnerLabel} has {formatINRFull(results.npsAlert.matchAmount)} of unclaimed employer NPS matching.
                This is additional income AND tax-free return. Maximise this before any other investment.
              </div>
            </div>
          )}

          {/* LTCG doubling */}
          <Card style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>LTCG Exemption — Doubled</div>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.65 }}>
              LTCG on equity mutual funds above ₹1 lakh per year is taxed at 10%. Each individual has their own ₹1L exemption.
              By holding funds separately, your household has <strong style={{ color: COLORS.primary }}>₹2 lakhs of LTCG exemption</strong> per year — saving{" "}
              <strong style={{ color: COLORS.primary }}>{formatINRFull(results.ltcgSaving * 2)}/year</strong> in tax.
            </p>
          </Card>

          {/* Insurance recommendation */}
          <Card style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Health Insurance Consolidation</div>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.65 }}>
              Replacing two individual health insurance policies with a single family floater of the same total cover typically saves{" "}
              <strong style={{ color: COLORS.primary }}>20–30% on premium</strong>.
              Estimated saving: <strong style={{ color: COLORS.primary }}>{formatINRFull(results.insuranceSaving)}/year</strong>.
            </p>
          </Card>

          {/* Combined net worth */}
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Combined Household Net Worth</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { l: "Mutual Funds (combined)", v: formatINR(partnerA.mfValue + partnerB.mfValue) },
                { l: "EPF (combined)",           v: formatINR(partnerA.epf + partnerB.epf) },
                { l: "Total Net Worth",          v: formatINR(results.netWorth) },
              ].map(({ l, v }) => (
                <div key={l} style={{ padding: "14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`, textAlign: "center" as const }}>
                  <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary, fontFamily: "'Space Grotesk',monospace" }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}