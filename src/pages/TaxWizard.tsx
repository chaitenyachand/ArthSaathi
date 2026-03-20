import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Check, IndianRupee, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { apiPost } from "@/lib/api";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface MissingDeduction {
  section: string;
  desc: string;
  amount: number;
  taxSaved: number;
}

interface TaxResult {
  grossSalary: number;
  oldRegimeTax: number;
  newRegimeTax: number;
  savings: number;
  betterRegime: string;
  missingDeductions: MissingDeduction[];
  regimeComparison: { label: string; value: number }[];
}

// ─── DEMO FALLBACK ────────────────────────────────────────────────────────────
const DEMO_TAX_RESULT: TaxResult = {
  grossSalary: 1500000,
  oldRegimeTax: 117000,
  newRegimeTax: 151200,
  savings: 34200,
  betterRegime: "Old Regime",
  missingDeductions: [
    { section: "80CCD(1B)", desc: "NPS contribution", amount: 50000, taxSaved: 15000 },
    { section: "80D", desc: "Parents' health insurance (senior citizen)", amount: 50000, taxSaved: 15000 },
    { section: "80C", desc: "Remaining 80C capacity via ELSS", amount: 37500, taxSaved: 11250 },
  ],
  regimeComparison: [
    { label: "Old Regime", value: 117000 },
    { label: "New Regime", value: 151200 },
  ],
};

const TaxWizard = () => {
  const [step, setStep] = useState(0); // 0=form, 1=loading, 2=result
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [formData, setFormData] = useState({
    salary: "1500000",
    hra: "40000",
    rent: "20000",
    city: "Bangalore",
    hasHomeLoan: false,
    parentInsurance: true,
    nps: false,
  });

  const handleAnalyze = async () => {
    setStep(1);
    try {
      const result = await apiPost<TaxResult>("/api/tax", {
        salary: parseInt(formData.salary.replace(/,/g, "")),
        hra: parseInt(formData.hra.replace(/,/g, "")),
        rent: parseInt(formData.rent.replace(/,/g, "")),
        city: formData.city,
        hasHomeLoan: formData.hasHomeLoan,
        parentInsurance: formData.parentInsurance,
        nps: formData.nps,
      });
      setTaxResult(result);
    } catch {
      // Backend not ready — use demo data
      setTaxResult(DEMO_TAX_RESULT);
    }
    setStep(2);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Tax Wizard</h1>
            <p className="text-sm text-muted-foreground">Find every rupee in unclaimed deductions</p>
          </div>
        </div>
      </motion.div>

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground">Annual CTC</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground">Monthly HRA Component</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.hra}
                    onChange={(e) => setFormData({ ...formData, hra: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground">Monthly Rent Paid</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                >
                  <option>Bangalore</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Questions</h3>
              {[
                { key: "hasHomeLoan" as const, label: "Do you have a home loan?" },
                { key: "parentInsurance" as const, label: "Do you pay health insurance for parents?" },
                { key: "nps" as const, label: "Are you contributing to NPS?" },
              ].map((q) => (
                <label key={q.key} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData[q.key]}
                    onChange={(e) => setFormData({ ...formData, [q.key]: e.target.checked })}
                    className="w-4 h-4 rounded border-input accent-gold"
                  />
                  <span className="text-sm text-foreground">{q.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button variant="hero" onClick={handleAnalyze}>
            Analyze My Tax <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {step === 1 && (
        <div className="mt-16 text-center">
          <Loader2 className="w-12 h-12 text-emerald animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Calculating Your Tax</h3>
          <p className="text-sm text-muted-foreground">Comparing regimes and scanning for deductions...</p>
        </div>
      )}

      {step === 2 && taxResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
          {/* Regime comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-card border border-border p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">Old Regime Tax</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {taxResult.oldRegimeTax.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="rounded-xl bg-card border border-border p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">New Regime Tax</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {taxResult.newRegimeTax.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="rounded-xl bg-card border border-emerald/30 p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">You Save With {taxResult.betterRegime}</p>
              <p className="text-2xl font-heading font-bold text-emerald">
                {taxResult.savings.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">Regime Comparison</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={taxResult.regimeComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                  <Cell fill="hsl(var(--emerald))" />
                  <Cell fill="hsl(var(--muted-foreground))" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Missing deductions */}
          <div className="rounded-xl bg-card border border-gold/20 p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">Missing Deductions Found</h3>
            <div className="space-y-3">
              {taxResult.missingDeductions.map((d, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-gold/5 border border-gold/10">
                  <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-foreground">Section {d.section}: {d.desc}</span>
                      <span className="text-sm font-heading font-bold text-emerald">
                        Save {d.taxSaved.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Invest {d.amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })} to claim this deduction
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-emerald/5 border border-emerald/20">
              <p className="text-sm font-heading font-semibold text-emerald">
                Total Additional Savings:{" "}
                {taxResult.missingDeductions
                  .reduce((a, d) => a + d.taxSaved, 0)
                  .toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                /year
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                That is{" "}
                {Math.round(taxResult.missingDeductions.reduce((a, d) => a + d.taxSaved, 0) / 12).toLocaleString()}{" "}
                per month — enough for a new SIP.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={() => { setStep(0); setTaxResult(null); }}>
            Recalculate
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default TaxWizard;