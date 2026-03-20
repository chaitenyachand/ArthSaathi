import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, IndianRupee, Shield, Calendar, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { apiPost } from "@/lib/api";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Goal {
  name: string;
  target: string;
  year: number;
  sip: number;
}

interface FireResult {
  sipAmount: number;
  fireYear: number;
  fireAge: number;
  insuranceGap: number;
  goals: Goal[];
  timeline: { year: number; corpus: number; fireTarget: number }[];
}

// ─── LOCAL TIMELINE GENERATOR (used for slider interactivity) ─────────────────
const generateTimeline = (sipAmount: number, existingMF: number) => {
  const data = [];
  let corpus = existingMF;
  const monthlyReturn = 0.12 / 12;
  for (let year = 2026; year <= 2060; year++) {
    for (let m = 0; m < 12; m++) {
      corpus = corpus * (1 + monthlyReturn) + sipAmount;
    }
    data.push({ year, corpus: Math.round(corpus), fireTarget: 22500000 });
  }
  return data;
};

const FirePlanner = () => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sipAmount, setSipAmount] = useState(38500);
  const [fireResult, setFireResult] = useState<FireResult | null>(null);
  const [formData] = useState({
    age: 32,
    income: 150000,
    expenses: 70000,
    existingMF: 800000,
  });

  const [inputValues, setInputValues] = useState({
    age: "32",
    income: "1,50,000",
    expenses: "70,000",
    existingMF: "8,00,000",
  });

  const goals: Goal[] = [
    { name: "Child's Education", target: "30,00,000", year: 2040, sip: 12500 },
    { name: "Home Down Payment", target: "25,00,000", year: 2028, sip: 8500 },
    { name: "Retirement (75K/mo)", target: "2,25,00,000", year: 2054, sip: 17500 },
  ];

  // Timeline driven by slider (always local for responsiveness)
  const timelineData = generateTimeline(sipAmount, formData.existingMF);
  const fireYear = fireResult?.fireYear
    ?? timelineData.find(d => d.corpus >= d.fireTarget)?.year
    ?? 2060;
  const fireAge = fireResult?.fireAge ?? (formData.age + (fireYear - 2026));
  const displayGoals = fireResult?.goals ?? goals;
  const displaySip = fireResult?.sipAmount ?? sipAmount;

  const handleBuildRoadmap = async () => {
    setLoading(true);
    try {
      const result = await apiPost<FireResult>("/api/fire", {
        age: parseInt(inputValues.age),
        income: parseInt(inputValues.income.replace(/,/g, "")),
        expenses: parseInt(inputValues.expenses.replace(/,/g, "")),
        existingMF: parseInt(inputValues.existingMF.replace(/,/g, "")),
        goals,
      });
      setFireResult(result);
      setSipAmount(result.sipAmount);
    } catch {
      // Backend not ready — use local calculation
      setFireResult(null);
    }
    setLoading(false);
    setStarted(true);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-coral/10 border border-coral/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">FIRE Path Planner</h1>
            <p className="text-sm text-muted-foreground">Your roadmap to financial independence</p>
          </div>
        </div>
      </motion.div>

      {!started && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Age", key: "age" as const },
              { label: "Monthly Post-Tax Income", key: "income" as const },
              { label: "Monthly Expenses", key: "expenses" as const },
              { label: "Existing MF Portfolio", key: "existingMF" as const },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-sm font-medium mb-1.5 block text-foreground">{f.label}</label>
                <input
                  type="text"
                  value={inputValues[f.key]}
                  onChange={(e) => setInputValues({ ...inputValues, [f.key]: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Life Goals</h3>
            {goals.map((g, i) => (
              <div key={i} className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{g.name}</p>
                  <p className="text-xs text-muted-foreground">Target: INR {g.target} by {g.year}</p>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>

          <Button variant="hero" onClick={handleBuildRoadmap}>
            Build My Roadmap <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {loading && (
        <div className="mt-16 text-center">
          <Loader2 className="w-12 h-12 text-coral animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Building Your Roadmap</h3>
          <p className="text-sm text-muted-foreground">Calculating FIRE date, insurance gap, and goal SIPs...</p>
        </div>
      )}

      {started && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-card border border-gold/30 p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">Total SIP Needed</p>
              <p className="text-2xl font-heading font-bold text-gold flex items-center">
                <IndianRupee className="w-5 h-5" />{displaySip.toLocaleString()}/mo
              </p>
            </div>
            <div className="rounded-xl bg-card border border-emerald/30 p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">FIRE Age</p>
              <p className="text-2xl font-heading font-bold text-emerald">{fireAge} years old</p>
              <p className="text-xs text-muted-foreground">Year {fireYear}</p>
            </div>
            <div className="rounded-xl bg-card border border-coral/30 p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">Insurance Gap</p>
              <p className="text-2xl font-heading font-bold text-coral flex items-center">
                <IndianRupee className="w-5 h-5" />
                {fireResult?.insuranceGap ? `${(fireResult.insuranceGap / 100000).toFixed(0)}L` : "78L"}
              </p>
              <p className="text-xs text-coral">Underinsured</p>
            </div>
          </div>

          {/* Goal breakdown */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">Goal-wise SIP Breakdown</h3>
            <div className="space-y-3">
              {displayGoals.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{g.name}</p>
                    <p className="text-xs text-muted-foreground">Target: INR {g.target} by {g.year}</p>
                  </div>
                  <span className="font-heading font-bold text-sm text-gold">
                    {g.sip.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive SIP slider */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">Interactive Timeline</h3>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block text-foreground">
                Monthly SIP:{" "}
                <span className="text-gold font-heading">
                  {sipAmount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                </span>
              </label>
              <input
                type="range"
                min={10000}
                max={80000}
                step={500}
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>10,000</span>
                <span>80,000</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${(v / 10000000).toFixed(1)}Cr`}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v: number) => [`INR ${(v / 100000).toFixed(1)}L`, ""]}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="monotone" dataKey="corpus" stroke="hsl(var(--gold))" strokeWidth={2.5} dot={false} />
                <ReferenceLine
                  y={22500000}
                  stroke="hsl(var(--emerald))"
                  strokeDasharray="5 5"
                  label={{ value: "FIRE Target", fill: "hsl(var(--emerald))", fontSize: 11 }}
                />
                {fireYear <= 2060 && (
                  <ReferenceLine x={fireYear} stroke="hsl(var(--emerald))" strokeDasharray="5 5" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insurance gap */}
          <div className="rounded-xl bg-card border border-coral/20 p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-coral" /> Insurance Gap Analysis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-coral/5">
                <p className="text-xs text-muted-foreground mb-1">Required Life Cover (HLV)</p>
                <p className="text-lg font-heading font-bold text-foreground">INR 1.50 Cr</p>
              </div>
              <div className="p-3 rounded-lg bg-coral/5">
                <p className="text-xs text-muted-foreground mb-1">Current Cover</p>
                <p className="text-lg font-heading font-bold text-foreground">INR 72 L</p>
              </div>
            </div>
            <p className="text-sm text-coral mt-3 font-medium">
              Gap: INR 78 Lakhs. Recommended: Term insurance of INR 1 Crore for 25 years.
            </p>
          </div>

          <Button variant="outline" onClick={() => { setStarted(false); setFireResult(null); }}>
            Edit Details
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default FirePlanner;