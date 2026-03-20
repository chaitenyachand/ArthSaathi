import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { AlertTriangle, IndianRupee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCAMS } from "@/context/CAMSContext";
import { FundHolding } from "@/hooks/useCAMSData";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const estimateCostToDate = (holding: FundHolding): number => {
  const erDiff = (holding.expenseRatio - holding.directExpenseRatio) / 100;
  return Math.round(holding.currentValue * erDiff * 5); // 5-year estimate
};

const estimateCost20yr = (holding: FundHolding): number => {
  const erDiff = (holding.expenseRatio - holding.directExpenseRatio) / 100;
  return Math.round(holding.currentValue * erDiff * 20);
};

// ─── DEMO FUNDS (used when CAMS data not loaded) ──────────────────────────────
const DEMO_FUNDS = [
  { name: "SBI Bluechip Fund", regularER: 1.65, directER: 0.42, value: 320000, costToDate: 18200, cost20yr: 142000 },
  { name: "Axis Bluechip Fund", regularER: 1.48, directER: 0.38, value: 280000, costToDate: 14800, cost20yr: 118000 },
  { name: "HDFC Mid-Cap Opp", regularER: 1.72, directER: 0.65, value: 190000, costToDate: 14300, cost20yr: 98000 },
];

const BadAdvice = () => {
  const [revealed, setRevealed] = useState(false);
  const { data } = useCAMS();

  // Use real CAMS data if available, otherwise fall back to demo
  const funds = data.parsed && data.holdings.length > 0
    ? data.holdings
        .filter(h => h.plan === "Regular")
        .map(h => ({
          name: h.fundName,
          regularER: h.expenseRatio,
          directER: h.directExpenseRatio,
          value: h.currentValue,
          costToDate: estimateCostToDate(h),
          cost20yr: estimateCost20yr(h),
        }))
    : DEMO_FUNDS;

  const chartData = funds.map(f => ({
    name: f.name.split(" ").slice(0, 2).join(" "),
    regular: f.regularER,
    direct: f.directER,
  }));

  const totalCost = funds.reduce((a, f) => a + f.costToDate, 0);
  const totalProjected = funds.reduce((a, f) => a + f.cost20yr, 0);

  // Use summary from CAMS if available
  const displayTotalCost = data.parsed ? data.commissionPaid5yr : totalCost;
  const displayProjected = data.parsed ? data.commissionProjected20yr : totalProjected;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-coral/10 border border-coral/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Cost of Bad Advice Detector</h1>
            <p className="text-sm text-muted-foreground">See what your mutual fund distributor really earned from your portfolio</p>
          </div>
        </div>
      </motion.div>

      {!data.parsed && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-gold/20 bg-gold/5 text-sm text-muted-foreground">
          Upload your CAMS statement in{" "}
          <a href="/portfolio-xray" className="text-gold underline">Portfolio X-Ray</a>{" "}
          to see your real commission data. Showing demo data below.
        </div>
      )}

      {!revealed ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center max-w-md mx-auto">
          <div className="p-8 rounded-2xl border border-coral/20 bg-coral/5">
            <AlertTriangle className="w-12 h-12 text-coral mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Ready to see the truth?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This analysis shows the exact rupees your mutual fund distributor has earned from your portfolio through Regular plan commissions. No other Indian fintech shows this — because they earn the commission.
            </p>
            <Button variant="hero" onClick={() => setRevealed(true)}>
              Reveal My Hidden Costs <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-coral/5 border border-coral/20 p-5">
              <p className="text-xs text-muted-foreground mb-1">Commission Paid (Last 5 Years)</p>
              <p className="text-3xl font-heading font-bold text-coral flex items-center">
                <IndianRupee className="w-6 h-6" />{displayTotalCost.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-5">
              <p className="text-xs text-muted-foreground mb-1">Projected 20-Year Cost</p>
              <p className="text-3xl font-heading font-bold text-destructive flex items-center">
                <IndianRupee className="w-6 h-6" />{displayProjected.toLocaleString()}
              </p>
            </div>
          </div>

          {/* ER comparison chart */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">Expense Ratio: Regular vs Direct</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="regular" name="Regular Plan" fill="hsl(var(--coral))" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="direct" name="Direct Plan" fill="hsl(var(--emerald))" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fund table */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card overflow-x-auto">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">Fund-wise Commission Breakdown</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Fund</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Regular ER</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Direct ER</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Cost to Date</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">20-yr Cost</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">{f.name}</td>
                    <td className="text-right py-3 px-2 text-coral">{f.regularER}%</td>
                    <td className="text-right py-3 px-2 text-emerald">{f.directER}%</td>
                    <td className="text-right py-3 px-2 font-mono text-foreground">
                      {f.costToDate.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                    </td>
                    <td className="text-right py-3 px-2 font-mono text-destructive">
                      {f.cost20yr.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-gold/5 border border-gold/20 p-5">
            <h3 className="font-heading font-semibold text-sm mb-2 text-foreground">Switch Guide</h3>
            <p className="text-sm text-muted-foreground">
              Wait until April to switch SBI and Axis funds to avoid STCG on recent purchases. HDFC Mid-Cap can be switched immediately. Switching triggers capital gains tax — the system calculates the break-even period where Direct plan savings exceed the one-time tax cost.
            </p>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default BadAdvice;