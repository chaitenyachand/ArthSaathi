import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, ChevronRight, RotateCcw } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const questions = [
  { q: "How many months of expenses do you have saved in liquid cash?", options: ["Less than 1", "1-3 months", "3-6 months", "More than 6"], scores: [15, 40, 70, 95] },
  { q: "What is your life insurance cover relative to your annual income?", options: ["No cover", "1-3x income", "3-8x income", "More than 8x"], scores: [10, 35, 65, 90] },
  { q: "How diversified is your investment portfolio?", options: ["Single fund", "Multiple funds, same type", "Equity + Debt", "Global diversification"], scores: [20, 40, 70, 95] },
  { q: "What is your total EMI as a percentage of monthly income?", options: ["Above 50%", "30-50%", "20-30%", "Below 20%"], scores: [15, 40, 70, 95] },
  { q: "How much of your 80C limit have you utilised?", options: ["Nothing", "Less than half", "Most of it", "Fully utilised + NPS"], scores: [10, 35, 65, 95] },
  { q: "What percentage of your required retirement corpus have you accumulated?", options: ["None", "Less than 25%", "25-50%", "More than 50%"], scores: [10, 30, 55, 85] },
];

const dimensionMeta = [
  { key: "Emergency", link: "/fire-planner" },
  { key: "Insurance", link: "/fire-planner" },
  { key: "Diversification", link: "/portfolio-xray" },
  { key: "Debt Health", link: "/fire-planner" },
  { key: "Tax Efficiency", link: "/tax-wizard" },
  { key: "Retirement", link: "/fire-planner" },
];

const getSuggestions = (dimensions: { key: string; score: number; link: string }[]) => {
  const suggestions: { title: string; desc: string; priority: "high" | "medium" | "low" }[] = [];
  dimensions.forEach((d) => {
    if (d.key === "Emergency" && d.score < 50) suggestions.push({ title: "Build Emergency Fund", desc: "Start a recurring deposit or liquid fund SIP to accumulate 6 months of expenses. Automate transfers on salary day.", priority: "high" });
    if (d.key === "Insurance" && d.score < 50) suggestions.push({ title: "Get Term Life Insurance", desc: "Buy a pure term plan covering 10-15x your annual income. Avoid ULIPs and endowment policies.", priority: "high" });
    if (d.key === "Diversification" && d.score < 50) suggestions.push({ title: "Diversify Your Portfolio", desc: "Move beyond single asset classes. Add debt funds for stability and consider international index funds for global exposure.", priority: "medium" });
    if (d.key === "Debt Health" && d.score < 50) suggestions.push({ title: "Reduce EMI Burden", desc: "Aim to keep total EMIs below 30% of income. Prioritize paying off high-interest debt first (credit cards > personal loans > home loan).", priority: "high" });
    if (d.key === "Tax Efficiency" && d.score < 50) suggestions.push({ title: "Maximise Tax Deductions", desc: "Utilise full 80C limit (1.5L), claim 80D for health insurance, contribute to NPS for extra 50K deduction under 80CCD(1B).", priority: "medium" });
    if (d.key === "Retirement" && d.score < 50) suggestions.push({ title: "Start Retirement SIP", desc: "Begin with even 10% of income in an index fund SIP. Every year of delay costs lakhs due to compounding.", priority: "high" });
    if (d.key === "Emergency" && d.score >= 50 && d.score < 75) suggestions.push({ title: "Strengthen Emergency Buffer", desc: "You have a decent start. Target 6 months and keep it in a liquid fund earning 5-6% instead of savings account.", priority: "low" });
    if (d.key === "Tax Efficiency" && d.score >= 50 && d.score < 75) suggestions.push({ title: "Optimise Tax Further", desc: "Consider NPS contributions for the additional 50K deduction. Review HRA claims and medical insurance premiums.", priority: "low" });
  });
  return suggestions;
};

const STORAGE_KEY = "arthsaathi-health-score";

const HealthScore = () => {
  const [step, setStep] = useState<"quiz" | "result">("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [dimensions, setDimensions] = useState<{ key: string; score: number; link: string }[]>([]);
  const navigate = useNavigate();

  // Load saved score on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDimensions(parsed.dimensions);
        setAnswers(parsed.answers);
        setStep("result");
      } catch { /* ignore */ }
    }
  }, []);

  const overall = dimensions.length > 0
    ? Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length)
    : 0;

  const radarData = dimensions.map(d => ({ subject: d.key, score: d.score, fullMark: 100 }));

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, questions[currentQ].scores[optionIndex]];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const dims = dimensionMeta.map((m, i) => ({
        key: m.key,
        score: newAnswers[i],
        link: m.link,
      }));
      setDimensions(dims);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dimensions: dims, answers: newAnswers, timestamp: Date.now() }));
      setStep("result");
    }
  };

  const handleRetake = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStep("quiz");
    setCurrentQ(0);
    setAnswers([]);
    setDimensions([]);
  };

  const suggestions = getSuggestions(dimensions);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Money Health Score</h1>
              <p className="text-sm text-muted-foreground">6-dimension financial health assessment</p>
            </div>
          </div>
          {step === "result" && (
            <Button variant="outline" size="sm" onClick={handleRetake} className="gap-2 text-foreground border-border">
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </Button>
          )}
        </div>
      </motion.div>

      {step === "quiz" && (
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-8 max-w-xl"
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-gold transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
              </div>
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">{questions[currentQ].q}</h3>
          </div>

          <div className="space-y-3">
            {questions[currentQ].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-gold/40 hover:bg-gold/5 transition-all duration-200 text-sm font-medium group flex items-center justify-between text-foreground"
              >
                {opt}
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === "result" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
          {/* Overall score */}
          <div className="text-center py-8">
            <div className="relative inline-flex items-center justify-center w-36 h-36 rounded-full border-4 border-gold/20">
              <div className="absolute inset-2 rounded-full bg-gradient-gold opacity-10" />
              <div className="text-center z-10">
                <span className="text-4xl font-heading font-bold text-foreground">{overall}</span>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">Your overall financial health score</p>
          </div>

          {/* Radar chart */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dimensions.map((d) => {
              const isWeak = d.score < 50;
              return (
                <motion.div
                  key={d.key}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(d.link)}
                  className={`cursor-pointer rounded-xl border p-5 shadow-card transition-all duration-200 ${
                    isWeak ? "border-coral/30 bg-coral/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-heading font-semibold text-foreground">{d.key}</span>
                    <span className={`text-lg font-heading font-bold ${isWeak ? "text-coral" : "text-primary"}`}>{d.score}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${isWeak ? "bg-coral" : "bg-primary"}`}
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
                    Go to fix <ChevronRight className="w-3 h-3 ml-0.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="rounded-xl bg-card border border-gold/20 p-6 shadow-card">
              <h3 className="text-base font-heading font-semibold text-foreground mb-4">Improvement Suggestions</h3>
              <div className="space-y-4">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      s.priority === "high" ? "bg-coral/15 text-coral" : s.priority === "medium" ? "bg-gold/15 text-gold" : "bg-primary/15 text-primary"
                    }`}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default HealthScore;