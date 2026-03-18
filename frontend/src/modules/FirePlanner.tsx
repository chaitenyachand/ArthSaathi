import { useState, useEffect, useRef } from "react";
import TimelineChart from "../components/TimelineChart";
import { futureValue, sipRequired, retirementCorpus, procrastinationPerSecond } from "../utils/finance";
import { formatINR, formatINRFull } from "../utils/formatINR";
import { COLORS } from "../utils/constants";

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

// ─── PROCRASTINATION CLOCK ────────────────────────────────────────────────────
const ProcClock = ({ sipAmount, years }: { sipAmount: number; years: number }) => {
  const [elapsed, setElapsed] = useState(0);
  const t0 = useRef(Date.now());
  const perSec = procrastinationPerSecond(sipAmount, years);

  useEffect(() => {
    const id = setInterval(() => setElapsed((Date.now() - t0.current) / 1000), 200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      padding: "24px 20px", borderRadius: 14, textAlign: "center",
      background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: COLORS.red, marginBottom: 8 }}>
        Wealth Lost While You Wait
      </div>
      <div style={{
        fontSize: 42, fontWeight: 900, color: COLORS.accent, lineHeight: 1,
        fontFamily: "'Space Grotesk',monospace", fontVariantNumeric: "tabular-nums",
      }}>
        {formatINR(elapsed * perSec)}
      </div>
      <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
        {formatINR(perSec)}/second — based on ₹{sipAmount.toLocaleString("en-IN")}/mo SIP @ 12% CAGR over {years} years
      </div>
    </div>
  );
};

// ─── GOAL INTERFACE ───────────────────────────────────────────────────────────
interface Goal {
  name:   string;
  amount: number;
  year:   number;
}

interface FireResult {
  retCorpus:   number;
  retSIP:      number;
  goalSIPs:    Array<Goal & { futureCost: number; sip: number; yrs: number }>;
  totalSIP:    number;
  capacity:    number;
  hlv:         number;
  yrs:         number;
  fireYear:    number;
  timelinePoints: Array<{ year: number; value: number; label?: string }>;
}

export default function FirePlanner() {
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    age: 32, retireAge: 52, income: 150000, expenses: 70000,
    corpus: 800000, desiredIncome: 75000,
  });
  const [goals, setGoals] = useState<Goal[]>([
    { name: "Child Education",   amount: 3000000, year: 2040 },
    { name: "Home Down Payment", amount: 2500000, year: 2028 },
  ]);
  const [result, setResult] = useState<FireResult | null>(null);

  const sf = (k: keyof typeof form, v: number) => setForm(p => ({ ...p, [k]: v }));
  const addGoal = () => setGoals(g => [...g, { name: "New Goal", amount: 1000000, year: currentYear + 10 }]);
  const updGoal = (i: number, k: keyof Goal, v: string | number) =>
    setGoals(g => g.map((x, j) => j === i ? { ...x, [k]: v } : x));

  const calc = () => {
    const yrs      = form.retireAge - form.age;
    const months   = yrs * 12;
    const retC     = retirementCorpus(form.desiredIncome);
    const existFV  = futureValue(12, months, 0, form.corpus);
    const retSIP   = sipRequired(retC, 12, months, existFV);

    const goalSIPs = goals.map(g => {
      const gyrs     = g.year - currentYear;
      const futureCost = g.amount * Math.pow(1.06, gyrs);
      const sip      = sipRequired(futureCost, 12, gyrs * 12);
      return { ...g, futureCost, sip: Math.round(sip), yrs: gyrs };
    });

    const totalSIP = Math.round(retSIP) + goalSIPs.reduce((a, g) => a + g.sip, 0);
    const hlv      = form.income * 12 * yrs;
    const fireYear = currentYear + yrs;

    // Build timeline
    const pts: Array<{ year: number; value: number; label?: string }> = [];
    for (let y = 0; y <= yrs; y++) {
      const val = futureValue(12, y * 12, Math.round(retSIP), form.corpus);
      const goal = goals.find(g => g.year === currentYear + y);
      pts.push({ year: currentYear + y, value: val, label: goal?.name });
    }

    setResult({
      retCorpus: retC, retSIP: Math.round(retSIP),
      goalSIPs, totalSIP, capacity: form.income - form.expenses,
      hlv, yrs, fireYear, timelinePoints: pts,
    });
  };

  const numFields: { k: keyof typeof form; label: string }[] = [
    { k: "age",          label: "Current Age"                           },
    { k: "retireAge",    label: "Target Retirement Age"                 },
    { k: "income",       label: "Monthly Post-Tax Income (₹)"          },
    { k: "expenses",     label: "Monthly Expenses (₹)"                 },
    { k: "corpus",       label: "Existing Investments (₹)"             },
    { k: "desiredIncome",label: "Desired Monthly Income at Retirement (₹)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Core Module F3</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>FIRE Path Planner</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          Financial Independence, Retire Early. Enter your goals, income, and investments to get a month-by-month roadmap with exact SIP amounts.
        </p>
      </div>

      {/* Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        {numFields.map(({ k, label }) => (
          <div key={k}>
            <Label>{label}</Label>
            <Inp value={form[k]} onChange={v => sf(k, v)} />
          </div>
        ))}
      </div>

      {/* Goals */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Life Goals</span>
          <button onClick={addGoal} style={{
            padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
            background: "transparent", color: COLORS.muted, fontSize: 13,
            cursor: "pointer", fontFamily: "Inter,sans-serif",
          }}>
            Add Goal
          </button>
        </div>
        {goals.map((g, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr auto", gap: 10, marginBottom: 10 }}>
            <input className="" placeholder="Goal name" value={g.name}
              onChange={e => updGoal(i, "name", e.target.value)}
              style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", outline: "none" }}
            />
            <input type="number" placeholder="Amount (₹)" value={g.amount}
              onChange={e => updGoal(i, "amount", +e.target.value)}
              style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", outline: "none" }}
            />
            <input type="number" placeholder="Year" value={g.year}
              onChange={e => updGoal(i, "year", +e.target.value)}
              style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", outline: "none" }}
            />
            <button onClick={() => setGoals(g => g.filter((_, j) => j !== i))}
              style={{ background: COLORS.redDim, border: "none", borderRadius: 8, color: COLORS.red, cursor: "pointer", padding: "0 12px", fontSize: 18 }}>
              ×
            </button>
          </div>
        ))}
      </div>

      <button onClick={calc} style={{
        width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
        background: COLORS.primary, color: "#000", fontFamily: "Inter,sans-serif",
        fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 28,
      }}>
        Build My FIRE Roadmap
      </button>

      {result && (
        <div>
          {/* Key stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { l: "Retirement Corpus",      v: formatINR(result.retCorpus),    c: COLORS.primary },
              { l: "Total Monthly SIP",       v: `${formatINRFull(result.totalSIP)}/mo`, c: COLORS.accent },
              { l: "Savings Capacity",        v: `${formatINR(result.capacity)}/mo`,
                c: result.capacity >= result.totalSIP ? COLORS.primary : COLORS.red },
            ].map(({ l, v, c }) => (
              <Card key={l} style={{ padding: 18 }}>
                <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{l}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'Space Grotesk',monospace" }}>{v}</div>
              </Card>
            ))}
          </div>

          {/* SIP breakdown */}
          <Card style={{ marginBottom: 16, overflow: "hidden" }}>
            {[...result.goalSIPs,
              { name: `Retirement by age ${form.retireAge}`, sip: result.retSIP, yrs: result.yrs, futureCost: result.retCorpus, amount: 0, year: result.fireYear },
            ].map((g, i, arr) => (
              <div key={g.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 18px",
                borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{g.yrs} year horizon · target {formatINR(g.futureCost)}</div>
                </div>
                <div style={{ fontFamily: "'Space Grotesk',monospace", fontSize: 18, fontWeight: 700, color: COLORS.primary }}>
                  {formatINRFull(g.sip)}/mo
                </div>
              </div>
            ))}
            <div style={{
              padding: "14px 18px", background: COLORS.primaryDim,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontWeight: 700 }}>Total SIP Required</span>
              <span style={{ fontFamily: "'Space Grotesk',monospace", fontSize: 20, fontWeight: 900, color: COLORS.primary }}>
                {formatINRFull(result.totalSIP)}/mo
              </span>
            </div>
          </Card>

          {/* Timeline chart */}
          <Card style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Corpus Growth Timeline</div>
            <TimelineChart
              points={result.timelinePoints}
              targetCorpus={result.retCorpus}
              currentYear={currentYear}
              fireYear={result.fireYear}
              height={180}
            />
          </Card>

          {/* Insurance gap */}
          <div style={{ padding: 16, borderRadius: 12, marginBottom: 16,
            background: COLORS.redDim, border: `1px solid rgba(248,113,113,0.2)`, fontSize: 14, lineHeight: 1.6 }}>
            Human Life Value: <strong style={{ color: COLORS.red }}>{formatINR(result.hlv)}</strong>.
            Ensure your term life insurance cover equals at least this amount.
          </div>

          {/* Procrastination clock */}
          <ProcClock sipAmount={result.totalSIP} years={result.yrs} />
        </div>
      )}
    </div>
  );
}