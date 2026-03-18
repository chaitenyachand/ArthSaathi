import { useState } from "react";
import { COLORS } from "../utils/constants";
import { formatINRFull, formatINR } from "../utils/formatINR";

// ─── LIFE EVENTS ──────────────────────────────────────────────────────────────
const EVENTS = [
  { id: "bonus",       label: "Annual Bonus Received",    icon: "B" },
  { id: "marriage",    label: "Getting Married",          icon: "M" },
  { id: "baby",        label: "New Baby",                 icon: "N" },
  { id: "home",        label: "Buying a Home",            icon: "H" },
  { id: "job",         label: "Job Change or Loss",       icon: "J" },
  { id: "inheritance", label: "Inheritance or Windfall",  icon: "I" },
];

interface EventForm {
  bonus:       { amount: number; existingLoan: number; loanRate: number; emergencyMonths: number };
  marriage:    { incomeA: number; incomeB: number; hraA: number; hraB: number; city: string };
  baby:        { babyYear: number; targetCollege: string };
  home:        { loanAmount: number; loanRate: number; tenure: number; monthlyIncome: number };
  job:         { emergencyMonths: number; epfBalance: number; newRole: boolean };
  inheritance: { amount: number; existingEquity: number };
}

const DEFAULT_FORM: EventForm = {
  bonus:       { amount: 500000, existingLoan: 450000, loanRate: 14, emergencyMonths: 1.5 },
  marriage:    { incomeA: 1800000, incomeB: 1200000, hraA: 360000, hraB: 240000, city: "metro" },
  baby:        { babyYear: new Date().getFullYear(), targetCollege: "engineering" },
  home:        { loanAmount: 5000000, loanRate: 8.5, tenure: 20, monthlyIncome: 150000 },
  job:         { emergencyMonths: 3, epfBalance: 400000, newRole: false },
  inheritance: { amount: 2000000, existingEquity: 500000 },
};

// ─── ACTION PLAN GENERATORS ───────────────────────────────────────────────────
const getActions = (eventId: string, form: EventForm): { title: string; amount: string; rationale: string; priority: number }[] => {
  switch (eventId) {
    case "bonus": {
      const { amount, existingLoan, loanRate, emergencyMonths } = form.bonus;
      const actions = [];
      let remaining = amount;
      if (existingLoan > 0 && loanRate > 10) {
        const pay = Math.min(existingLoan, remaining * 0.4);
        actions.push({ title: "Pay off high-interest personal loan", amount: formatINRFull(pay), rationale: `Risk-free ${loanRate}% return — beats any investment at this rate`, priority: 1 });
        remaining -= pay;
      }
      if (emergencyMonths < 3) {
        const top = Math.min(remaining * 0.35, 200000);
        actions.push({ title: "Top up emergency fund to 3 months", amount: formatINRFull(top), rationale: "Emergency fund below safe threshold — liquid fund SIP recommended", priority: 2 });
        remaining -= top;
      }
      if (remaining > 0) {
        actions.push({ title: "Invest surplus in ELSS (fills 80C gap)", amount: formatINRFull(remaining), rationale: `Saves ₹${Math.round(remaining * 0.3).toLocaleString("en-IN")} in tax this year at 30% bracket + equity returns`, priority: 3 });
      }
      return actions;
    }
    case "marriage": {
      const { incomeA, incomeB, hraA, hraB, city } = form.marriage;
      const basicA = incomeA * 0.4, basicB = incomeB * 0.4;
      const hraExA = Math.min(hraA, (city === "metro" ? 0.5 : 0.4) * basicA);
      const hraExB = Math.min(hraB, (city === "metro" ? 0.5 : 0.4) * basicB);
      const saving = Math.round((hraExA + hraExB) * 0.3);
      return [
        { title: "Optimise HRA declaration for both partners", amount: `Save ~${formatINRFull(saving)}/yr`, rationale: "Both partners can claim HRA if both contribute to rent — even same house", priority: 1 },
        { title: "Consolidate overlapping insurance policies", amount: "Review within 30 days", rationale: "Replace dual individual health plans with a single family floater — saves 20–30%", priority: 2 },
        { title: "Update nominees on all investments and insurance", amount: "All accounts", rationale: "Legal requirement. Unnominated accounts require court order during claim", priority: 3 },
        { title: "Open separate ELSS folios for each partner", amount: formatINRFull(150000 * 2), rationale: "Each partner gets full ₹1.5L 80C benefit + ₹1L LTCG exemption separately", priority: 4 },
      ];
    }
    case "baby": {
      const yearsToCollege = Math.max(1, (form.baby.babyYear + 18) - new Date().getFullYear());
      const todayCost = form.baby.targetCollege === "engineering" ? 3000000 : 2000000;
      const futureCost = Math.round(todayCost * Math.pow(1.08, yearsToCollege));
      const sipNeeded = Math.round(futureCost / (((Math.pow(1.01, yearsToCollege * 12) - 1) / 0.01) * 1.01));
      return [
        { title: `Start ELSS SIP for ${form.baby.targetCollege} education corpus`, amount: `${formatINRFull(sipNeeded)}/mo`, rationale: `${yearsToCollege} year horizon, 8% education inflation → target ${formatINR(futureCost)}`, priority: 1 },
        { title: "Add child to existing family floater health insurance", amount: "Nominal top-up premium", rationale: "Adding a newborn within 90 days avoids waiting periods", priority: 2 },
        { title: "Increase term life cover for new dependent", amount: `${formatINR(futureCost * 3)} additional cover`, rationale: "Your liability has increased by the child's future dependency value", priority: 3 },
        { title: "Open a Sukanya Samruddhi account (for girl child)", amount: "Up to ₹1.5L/yr in 80C", rationale: "8.2% tax-free return, matures at 21 — best risk-free education corpus option", priority: 4 },
      ];
    }
    case "home": {
      const { loanAmount, loanRate, tenure, monthlyIncome } = form.home;
      const emi = Math.round((loanAmount * (loanRate / 1200) * Math.pow(1 + loanRate / 1200, tenure * 12)) / (Math.pow(1 + loanRate / 1200, tenure * 12) - 1));
      const emiRatio = Math.round((emi / monthlyIncome) * 100);
      const interest5yr = emi * 60 - loanAmount * 0.1;
      return [
        { title: "EMI obligation analysis", amount: `${formatINRFull(emi)}/mo`, rationale: `${emiRatio}% of income — ${emiRatio > 40 ? "above recommended 40% — consider larger down payment" : "within safe range"}`, priority: 1 },
        { title: "Claim Section 24(b) home loan interest deduction", amount: "Up to ₹2L/yr tax deduction", rationale: `At 30% bracket this saves ${formatINRFull(60000)}/yr — ensure employer declaration is updated`, priority: 2 },
        { title: "Prepayment vs investment break-even analysis", amount: `Loan rate ${loanRate}% vs 12% CAGR equity`, rationale: loanRate < 9 ? "Equity CAGR historically exceeds your loan rate — invest surplus over prepayment" : "Prepay first — loan rate > expected net equity returns after tax", priority: 3 },
        { title: "Term insurance to cover outstanding loan", amount: formatINR(loanAmount), rationale: "Your family should never lose the home due to your absence — loan cover term plan is low cost", priority: 4 },
      ];
    }
    case "job": {
      const { emergencyMonths, epfBalance, newRole } = form.job;
      return [
        { title: `Emergency fund runway: ${emergencyMonths} months`, amount: emergencyMonths >= 6 ? "Adequate" : `Build ${6 - emergencyMonths} more months`, rationale: emergencyMonths >= 6 ? "Well positioned for job gap" : "Target 6 months before leaving current role", priority: 1 },
        { title: "Transfer EPF online — do NOT withdraw", amount: formatINRFull(epfBalance), rationale: "Premature EPF withdrawal is taxable + loses 8.25% tax-free compounding permanently", priority: 2 },
        { title: "Bridge health insurance for gap period", amount: "Short-term individual policy", rationale: "Employer cover ends on last day — gap leaves family exposed. Buyindividual cover immediately", priority: 3 },
        ...(newRole ? [] : [{ title: "Tax implications of dual employment", amount: "Consult CA", rationale: "If you join a new company in same FY, both employers deduct TDS — you may have shortfall or refund", priority: 4 }]),
      ];
    }
    case "inheritance": {
      const { amount, existingEquity } = form.inheritance;
      const sipMonths = 12;
      const sipAmount = Math.round(amount / sipMonths);
      return [
        { title: "Deploy via STP over 12 months — avoid timing risk", amount: `${formatINRFull(sipAmount)}/mo into equity`, rationale: `Lump sum of ${formatINR(amount)} into equity at once risks deploying at a market peak`, priority: 1 },
        { title: "Gift tax status check", amount: "Verify source", rationale: "Transfers from specified relatives (parents, spouse, siblings) are fully tax-free. Others above ₹50,000 are taxable as income", priority: 2 },
        { title: "Rebalance overall portfolio with new capital", amount: formatINR(existingEquity + amount), rationale: "New capital is an opportunity to correct asset allocation without triggering LTCG on existing holdings", priority: 3 },
        { title: "Estate planning — update will", amount: "Legal documentation", rationale: "Inherited assets should be reflected in your own estate plan to prevent future disputes", priority: 4 },
      ];
    }
    default:
      return [];
  }
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LifeEventAdvisor() {
  const [selected, setSelected] = useState<string | null>(null);
  const [form,     setForm]     = useState<EventForm>(DEFAULT_FORM);
  const [showPlan, setShowPlan] = useState(false);

  const actions = selected ? getActions(selected, form) : [];

  const sf = <E extends keyof EventForm, K extends keyof EventForm[E]>(
    event: E, key: K, val: EventForm[E][K]
  ) => setForm(f => ({ ...f, [event]: { ...f[event], [key]: val } }));

  const Inp = ({ label, value, onChange }: { label: string; value: number | string; onChange: (v: string) => void }) => (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5, display: "block" }}>{label}</label>
      <input type={typeof value === "number" ? "number" : "text"} value={value}
        onChange={e => onChange(e.target.value)}
        style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", width: "100%", outline: "none" }}
        onFocus={e => (e.target.style.borderColor = COLORS.primary)}
        onBlur={e  => (e.target.style.borderColor = COLORS.border)}
      />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Core Module F5</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Life Event Advisor</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          Life events are the moments when the most money is won or lost. ArthSaathi delivers a ranked, personalised action plan in exact rupee amounts for every major financial moment.
        </p>
      </div>

      {/* Event selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {EVENTS.map(ev => (
          <button key={ev.id} onClick={() => { setSelected(ev.id); setShowPlan(false); }} style={{
            padding: "16px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left",
            fontFamily: "Inter,sans-serif",
            border: `1.5px solid ${selected === ev.id ? COLORS.primary : COLORS.border}`,
            background: selected === ev.id ? COLORS.primaryDim : COLORS.bgCard,
            transition: "all .15s",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: selected === ev.id ? COLORS.primary : "rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: selected === ev.id ? "#000" : COLORS.muted,
              fontFamily: "'Space Grotesk',sans-serif", marginBottom: 10,
            }}>
              {ev.icon}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: selected === ev.id ? COLORS.primary : COLORS.fg, lineHeight: 1.3 }}>
              {ev.label}
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic form per event */}
      {selected === "bonus" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Inp label="Bonus Amount (₹)"          value={form.bonus.amount}         onChange={v => sf("bonus", "amount", +v)} />
          <Inp label="Existing Personal Loan (₹)" value={form.bonus.existingLoan}   onChange={v => sf("bonus", "existingLoan", +v)} />
          <Inp label="Loan Interest Rate (%)"     value={form.bonus.loanRate}       onChange={v => sf("bonus", "loanRate", +v)} />
          <Inp label="Current Emergency Fund (months)" value={form.bonus.emergencyMonths} onChange={v => sf("bonus", "emergencyMonths", +v)} />
        </div>
      )}
      {selected === "marriage" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Inp label="Partner A Annual Income (₹)" value={form.marriage.incomeA} onChange={v => sf("marriage", "incomeA", +v)} />
          <Inp label="Partner B Annual Income (₹)" value={form.marriage.incomeB} onChange={v => sf("marriage", "incomeB", +v)} />
          <Inp label="Partner A HRA (₹/yr)"         value={form.marriage.hraA}   onChange={v => sf("marriage", "hraA", +v)} />
          <Inp label="Partner B HRA (₹/yr)"         value={form.marriage.hraB}   onChange={v => sf("marriage", "hraB", +v)} />
        </div>
      )}
      {selected === "baby" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Inp label="Baby Birth Year"           value={form.baby.babyYear}        onChange={v => sf("baby", "babyYear", +v)} />
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5, display: "block" }}>Target Education</label>
            <select value={form.baby.targetCollege} onChange={e => sf("baby", "targetCollege", e.target.value)}
              style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", width: "100%", outline: "none" }}>
              <option value="engineering">Engineering / Technology (₹30L today)</option>
              <option value="medicine">Medicine (₹50L today)</option>
              <option value="arts">Arts / Commerce (₹15L today)</option>
              <option value="mba">MBA (₹40L today)</option>
            </select>
          </div>
        </div>
      )}
      {selected === "home" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Inp label="Loan Amount (₹)"          value={form.home.loanAmount}    onChange={v => sf("home", "loanAmount", +v)} />
          <Inp label="Interest Rate (%)"        value={form.home.loanRate}      onChange={v => sf("home", "loanRate", +v)} />
          <Inp label="Loan Tenure (years)"      value={form.home.tenure}        onChange={v => sf("home", "tenure", +v)} />
          <Inp label="Monthly Income (₹)"       value={form.home.monthlyIncome} onChange={v => sf("home", "monthlyIncome", +v)} />
        </div>
      )}
      {selected === "job" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Inp label="Current Emergency Fund (months)" value={form.job.emergencyMonths} onChange={v => sf("job", "emergencyMonths", +v)} />
          <Inp label="EPF Balance (₹)"                 value={form.job.epfBalance}      onChange={v => sf("job", "epfBalance", +v)} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
            <input type="checkbox" id="newrole" checked={form.job.newRole}
              onChange={e => sf("job", "newRole", e.target.checked)}
              style={{ accentColor: COLORS.primary, width: 16, height: 16 }} />
            <label htmlFor="newrole" style={{ fontSize: 14, color: COLORS.muted, cursor: "pointer" }}>
              I have a new job lined up already
            </label>
          </div>
        </div>
      )}
      {selected === "inheritance" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Inp label="Inheritance Amount (₹)"      value={form.inheritance.amount}       onChange={v => sf("inheritance", "amount", +v)} />
          <Inp label="Existing Equity Portfolio (₹)" value={form.inheritance.existingEquity} onChange={v => sf("inheritance", "existingEquity", +v)} />
        </div>
      )}

      {selected && (
        <button onClick={() => setShowPlan(true)} style={{
          width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
          background: COLORS.primary, color: "#000", fontFamily: "Inter,sans-serif",
          fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 24,
        }}>
          Generate Action Plan
        </button>
      )}

      {/* Action plan */}
      {showPlan && actions.length > 0 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 7 13.5 15.5l-5-5L2 17" /><path d="M16 7h6v6" />
            </svg>
            Ranked Action Plan
          </div>
          {actions.map((action, i) => (
            <div key={i} style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14,
              padding: 18, marginBottom: 12,
              borderLeft: `3px solid ${i === 0 ? COLORS.primary : i === 1 ? COLORS.accent : COLORS.muted}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: i === 0 ? COLORS.primaryDim : COLORS.accentDim,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800,
                      color: i === 0 ? COLORS.primary : COLORS.accent,
                      fontFamily: "'Space Grotesk',sans-serif",
                    }}>
                      {action.priority}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{action.title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{action.rationale}</div>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.primary, fontFamily: "'Space Grotesk',monospace" }}>
                    {action.amount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}