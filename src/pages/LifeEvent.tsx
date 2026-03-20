import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { CalendarDays, IndianRupee, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  { id: "bonus", label: "Annual Bonus Received", icon: "bonus" },
  { id: "inheritance", label: "Inheritance or Windfall", icon: "windfall" },
  { id: "married", label: "Getting Married", icon: "married" },
  { id: "baby", label: "New Baby", icon: "baby" },
  { id: "home", label: "Buying a Home", icon: "home" },
  { id: "jobchange", label: "Job Change or Loss", icon: "job" },
];

const bonusResult = {
  bonusAmount: 500000,
  actions: [
    { priority: 1, action: "Clear personal loan", amount: 150000, reason: "Risk-free 14% return. Highest-cost debt eliminated first.", tag: "Debt" },
    { priority: 2, action: "Top up emergency fund", amount: 180000, reason: "Bring emergency savings from 1.5 months to 3 months of expenses.", tag: "Safety" },
    { priority: 3, action: "Invest in ELSS", amount: 170000, reason: "Fills remaining 80C gap. Tax saving of INR 51,000 at 30% bracket.", tag: "Tax + Growth" },
  ],
  taxSaving: 51000,
};

const LifeEvent = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Life Event Advisor</h1>
            <p className="text-sm text-muted-foreground">The right financial advice at the right moment</p>
          </div>
        </div>
      </motion.div>

      {!showResult ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-6">
          <h3 className="text-base font-heading font-semibold text-foreground">Select your life event</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                  selected === e.id
                    ? "border-gold bg-gold/5 shadow-gold"
                    : "border-border bg-card hover:border-gold/30"
                }`}
              >
                <CalendarDays className={`w-5 h-5 mb-3 ${selected === e.id ? "text-gold" : "text-muted-foreground"}`} />
                <p className="text-sm font-heading font-semibold text-foreground">{e.label}</p>
              </button>
            ))}
          </div>

          {selected === "bonus" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground">Bonus Amount</label>
                <input
                  type="text"
                  defaultValue="500000"
                  className="w-full max-w-xs rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground">Existing Personal Loan (at 14%)</label>
                <input
                  type="text"
                  defaultValue="450000"
                  className="w-full max-w-xs rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground">Emergency Fund Covers</label>
                <input
                  type="text"
                  defaultValue="1.5 months"
                  className="w-full max-w-xs rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <Button variant="hero" onClick={() => setShowResult(true)}>
                Get Action Plan <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {selected && selected !== "bonus" && (
            <div className="p-4 rounded-xl bg-muted border border-border">
              <p className="text-sm text-muted-foreground">Select "Annual Bonus Received" for the full interactive demo. Other events follow the same pattern.</p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
          <div className="rounded-xl bg-card border border-gold/20 p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-2 text-foreground">Ranked Action Plan for INR {bonusResult.bonusAmount.toLocaleString()} Bonus</h3>
            <p className="text-sm text-muted-foreground mb-6">Actions ordered by financial impact — highest priority first.</p>
            <div className="space-y-4">
              {bonusResult.actions.map((a) => (
                <div key={a.priority} className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-heading font-bold shrink-0">
                    {a.priority}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-semibold text-sm text-foreground">{a.action}</span>
                      <span className="font-heading font-bold text-sm flex items-center text-gold">
                        <IndianRupee className="w-3 h-3" />{a.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.reason}</p>
                    <span className="inline-block mt-2 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/10 text-gold">{a.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-emerald/5 border border-emerald/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-emerald" />
              <span className="font-heading font-semibold text-sm text-foreground">Tax Benefit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The INR 1,70,000 ELSS investment saves INR {bonusResult.taxSaving.toLocaleString()} in tax this year at the 30% bracket.
            </p>
          </div>

          <Button variant="outline" onClick={() => { setShowResult(false); setSelected(null); }}>
            Try Another Event
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default LifeEvent;