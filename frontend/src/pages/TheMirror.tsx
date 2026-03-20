import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Eye, AlertTriangle } from "lucide-react";

const mirrorData = [
  { stated: "I am a long-term investor with a 7-10 year horizon", actual: "Average holding period across all funds: 11 months", match: false },
  { stated: "I do not panic in market downturns", actual: "Redeemed INR 2.3 lakhs in March-April 2020 (COVID crash bottom)", match: false },
  { stated: "I prefer equity over debt", actual: "63% of current portfolio is in debt and liquid funds", match: false },
  { stated: "I have an aggressive risk profile", actual: "Sold at 18% loss in 2020, never re-entered equity", match: false },
  { stated: "Comfortable with 30% temporary loss", actual: "Actual revealed preference is Conservative-Moderate", match: false },
];

const TheMirror = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-coral/10 border border-coral/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">The Mirror</h1>
            <p className="text-sm text-muted-foreground">Stated vs actual investment behaviour — side-by-side reality check</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 space-y-6">
        <div className="rounded-xl bg-card border border-border p-6 shadow-card">
          <p className="text-sm text-muted-foreground mb-6">
            This analysis compares your questionnaire answers against your actual CAMS transaction history. Upload your CAMS statement in Portfolio X-Ray to see your personalised Mirror.
          </p>

          <div className="space-y-0">
            {/* Header */}
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border mb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What You Said</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What Your Transactions Show</div>
            </div>

            {mirrorData.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="grid grid-cols-2 gap-4 py-4 border-b border-border/50 last:border-0"
              >
                <div className="flex gap-2">
                  <div className="w-1 rounded-full bg-emerald shrink-0" />
                  <p className="text-sm text-foreground">{row.stated}</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1 rounded-full bg-coral shrink-0" />
                  <p className="text-sm text-coral">{row.actual}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Revised assessment */}
        <div className="rounded-xl bg-gold/5 border border-gold/20 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-semibold text-base mb-2 text-foreground">Revised Risk Assessment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your actual risk tolerance, based on your behaviour rather than your stated preference, is <strong>Conservative-Moderate</strong>. Your optimal portfolio should have 50-60% equity and 40-50% debt. This is not a judgment — it is the most honest financial assessment you will receive. A portfolio that matches who you actually are is more likely to be held through a crash.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 shadow-card">
          <h3 className="font-heading font-semibold text-base mb-4 text-foreground">Recommended Portfolio Adjustment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-coral/5 border border-coral/20">
              <p className="text-xs text-muted-foreground mb-1">Current Allocation</p>
              <p className="text-sm font-semibold text-foreground">37% Equity / 63% Debt</p>
              <p className="text-xs text-coral mt-1">Misaligned — too conservative for stated goals</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald/5 border border-emerald/20">
              <p className="text-xs text-muted-foreground mb-1">Recommended Allocation</p>
              <p className="text-sm font-semibold text-foreground">55% Equity / 45% Debt</p>
              <p className="text-xs text-emerald mt-1">Matches actual risk tolerance and goals</p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TheMirror;