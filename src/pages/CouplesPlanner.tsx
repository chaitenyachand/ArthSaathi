import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Users, ArrowRight, IndianRupee, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const optimisations = [
  {
    title: "HRA Optimisation",
    saving: 58000,
    detail: "Split rent declaration as 60% Partner A, 40% Partner B based on salary brackets. Combined HRA saving: INR 58,000 per year.",
  },
  {
    title: "NPS Employer Matching",
    saving: 60000,
    detail: "Partner A's employer matches up to INR 60,000 in NPS. This is free money. Maximise this before any other investment.",
  },
  {
    title: "LTCG Tax Splitting",
    saving: 20000,
    detail: "By holding equity funds across both names, you get INR 2L LTCG exemption per year instead of INR 1L. Estimated annual savings.",
  },
  {
    title: "Insurance Joint Review",
    saving: 18000,
    detail: "Switch two individual health policies to a family floater. Same coverage, 28% lower premium.",
  },
];

const CouplesPlanner = () => {
  const [started, setStarted] = useState(false);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Couple's Money Planner</h1>
            <p className="text-sm text-muted-foreground">Joint financial optimisation for dual-income households</p>
          </div>
        </div>
      </motion.div>

      {!started ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Partner A", "Partner B"].map((partner) => (
              <div key={partner} className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-heading font-semibold text-base text-foreground">{partner}</h3>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-foreground">Annual Income</label>
                  <input
                    type="text"
                    defaultValue={partner === "Partner A" ? "18,00,000" : "12,00,000"}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-foreground">Monthly Rent</label>
                  <input
                    type="text"
                    defaultValue="25,000"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-foreground">City</label>
                  <input
                    type="text"
                    defaultValue="Mumbai"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                {partner === "Partner A" && (
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="accent-gold" />
                    <span className="text-foreground">Employer offers NPS matching</span>
                  </label>
                )}
              </div>
            ))}
          </div>
          <Button variant="hero" onClick={() => setStarted(true)}>
            Find Joint Optimisations <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
          <div className="rounded-xl bg-emerald/5 border border-emerald/20 p-5 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Annual Savings Found</p>
            <p className="text-3xl font-heading font-bold text-emerald flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />{optimisations.reduce((a, o) => a + o.saving, 0).toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            {optimisations.map((o, i) => (
              <div key={i} className="rounded-xl bg-card border border-border p-5 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald" />
                    <h3 className="font-heading font-semibold text-sm text-foreground">{o.title}</h3>
                  </div>
                  <span className="font-heading font-bold text-sm text-emerald flex items-center">
                    <IndianRupee className="w-3 h-3" />{o.saving.toLocaleString()}/yr
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{o.detail}</p>
              </div>
            ))}
          </div>

          {/* Combined Net Worth */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="font-heading font-semibold text-base mb-4 text-foreground">Combined Net Worth Dashboard</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Mutual Funds", value: "18.5L" },
                { label: "EPF + PPF", value: "12.2L" },
                { label: "Fixed Deposits", value: "5.0L" },
                { label: "Stocks", value: "3.8L" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-heading font-bold text-sm text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Household Net Worth</p>
              <p className="text-2xl font-heading font-bold text-gold">INR 39.5 Lakhs</p>
            </div>
          </div>

          <Button variant="outline" onClick={() => setStarted(false)}>Edit Details</Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default CouplesPlanner;