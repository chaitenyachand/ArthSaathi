import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Wallet, IndianRupee, ArrowRight, TrendingUp, Coffee, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mode = "salary" | "expense" | "income";

const calculateCorpus = (monthly: number, years: number, rate: number = 0.12) => {
  const r = rate / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
};

const formatCrore = (amount: number) => {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} Cr`;
  return `${(amount / 100000).toFixed(1)} L`;
};

const SalaryTranslator = () => {
  const [mode, setMode] = useState<Mode>("salary");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<{ input: string; corpus: number; narrative: string } | null>(null);

  const handleCalculate = () => {
    const num = parseInt(amount.replace(/,/g, "")) || 0;
    let monthly: number;
    let years = 28;
    let narrative = "";

    if (mode === "salary") {
      monthly = Math.round(num / 12);
      const corpus = calculateCorpus(monthly, years);
      narrative = `This INR ${(num / 100000).toFixed(1)}L increment, if invested for ${years} years, is worth INR ${formatCrore(corpus)} at retirement. Your next appraisal conversation is worth INR ${formatCrore(corpus)}.`;
      setResult({ input: `${(num / 100000).toFixed(1)}L/yr increment`, corpus, narrative });
    } else if (mode === "expense") {
      monthly = num;
      const corpus = calculateCorpus(monthly, years);
      narrative = `Your INR ${num.toLocaleString()}/month spend, if redirected to a SIP, would create INR ${formatCrore(corpus)} over ${years} years at 12% CAGR. You are trading INR ${formatCrore(corpus)} for this expense.`;
      setResult({ input: `${num.toLocaleString()}/mo expense`, corpus, narrative });
    } else {
      monthly = num;
      const corpus = calculateCorpus(monthly, 20);
      narrative = `Your INR ${num.toLocaleString()}/month side income, invested for 20 years, creates INR ${formatCrore(corpus)}. You are not running a side hustle. You are building a INR ${formatCrore(corpus)} business.`;
      setResult({ input: `${num.toLocaleString()}/mo income`, corpus, narrative });
    }
  };

  const modes: { key: Mode; icon: typeof TrendingUp; label: string; placeholder: string; desc: string }[] = [
    { key: "salary", icon: TrendingUp, label: "Salary Increment", placeholder: "300000", desc: "Enter annual increment amount" },
    { key: "expense", icon: Coffee, label: "Expense Trade-off", placeholder: "18000", desc: "Enter monthly expense to translate" },
    { key: "income", icon: Briefcase, label: "Side Income", placeholder: "30000", desc: "Enter monthly additional income" },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-violet" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Salary-to-Wealth Translator</h1>
            <p className="text-sm text-muted-foreground">Convert any rupee amount to its retirement corpus equivalent</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-6">
        {/* Mode selector */}
        <div className="grid grid-cols-3 gap-3">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => { setMode(m.key); setResult(null); setAmount(""); }}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  mode === m.key ? "border-violet bg-violet/5" : "border-border bg-card hover:border-violet/30"
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${mode === m.key ? "text-violet" : "text-muted-foreground"}`} />
                <p className="text-sm font-heading font-semibold text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block text-foreground">
              {modes.find(m => m.key === mode)?.desc}
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={modes.find(m => m.key === mode)?.placeholder}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
          </div>
          <Button variant="hero" onClick={handleCalculate} disabled={!amount.trim()}>
            Translate <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-gradient-hero text-center py-12 px-8"
          >
            <p className="text-sm text-primary-foreground/60 mb-2">{result.input}</p>
            <div className="flex items-center justify-center mb-4">
              <IndianRupee className="w-8 h-8 text-gold" />
              <span className="text-5xl md:text-6xl font-heading font-bold text-gold">
                {formatCrore(result.corpus)}
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-lg mx-auto leading-relaxed">
              {result.narrative}
            </p>
          </motion.div>
        )}

        {/* Quick examples */}
        {!result && (
          <div className="rounded-xl bg-muted border border-border p-5">
            <h3 className="text-sm font-heading font-semibold mb-3 text-foreground">Example Translations (at 12% CAGR, 28 years)</h3>
            <div className="space-y-2">
              {[
                { input: "INR 3L/yr salary hike", output: "INR 8.94 Cr at retirement" },
                { input: "INR 18,000/mo dining out", output: "INR 5.37 Cr opportunity cost" },
                { input: "INR 30,000/mo freelance", output: "INR 3.97 Cr wealth creation" },
                { input: "INR 500/mo gym membership", output: "INR 14.9L retirement corpus" },
              ].map((ex, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{ex.input}</span>
                  <span className="font-heading font-semibold text-gold">{ex.output}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default SalaryTranslator;