import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Loader2 } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { apiPost } from "@/lib/api";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface BiasScore {
  bias: string;
  score: number;
}

interface BiasResultData {
  scores: BiasScore[];
  dominant: string;
  adaptations: { bias: string; adaptation: string }[];
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const quizQuestions = [
  {
    q: "A fund you bought at INR 100 is now at INR 85. What do you do?",
    options: ["Hold until it comes back to 100", "Sell and reinvest in a better fund", "Buy more at the lower price", "Do nothing and avoid checking"],
  },
  {
    q: "Which return metric catches your eye first?",
    options: ["Last 1-month return", "Last 1-year return", "5-year CAGR", "Since inception CAGR"],
  },
  {
    q: "Your colleague made 40% on a stock tip. Your reaction?",
    options: ["Ask for the next tip", "Research the stock yourself", "Ignore — you stick to mutual funds", "Feel anxious about missing out"],
  },
  {
    q: "A new NFO launched by your favourite AMC. What do you do?",
    options: ["Invest on day 1", "Wait for 3-year track record", "Compare with existing category funds", "Invest because friends are investing"],
  },
  {
    q: "Market drops 15% in a week. Your portfolio is red. What do you do?",
    options: ["Sell everything to stop losses", "Do nothing and wait", "Invest more at lower prices", "Switch to FDs for safety"],
  },
];

// Demo fallback data
const DEMO_RESULT: BiasResultData = {
  dominant: "Loss Aversion",
  scores: [
    { bias: "Loss Aversion", score: 82 },
    { bias: "Recency Bias", score: 55 },
    { bias: "Overconfidence", score: 30 },
    { bias: "Herd Mentality", score: 45 },
    { bias: "Anchoring", score: 70 },
  ],
  adaptations: [
    { bias: "Loss Aversion (Dominant)", adaptation: "Rebalancing shown as 'locking in gains on winners' not 'cutting losers'. Insurance gaps shown as losses avoided, not purchases made." },
    { bias: "Anchoring (High)", adaptation: "Opportunity cost of waiting calculated: 'If this fund returns to your buy price in 3 years, you earn only 2.4% CAGR. Nifty would return 12%.'" },
    { bias: "Recency Bias (Moderate)", adaptation: "10-year returns shown first, 1-year last. Warning label on top-ranked funds from last year." },
  ],
};

const BiasFingerprint = () => {
  const [step, setStep] = useState(0); // 0=quiz, 1=loading, 2=result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [biasResult, setBiasResult] = useState<BiasResultData | null>(null);

  const radarData = biasResult?.scores.map(b => ({
    subject: b.bias,
    score: b.score,
    fullMark: 100,
  })) ?? [];

  const handleAnswer = async (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Last answer — submit to backend
      setStep(1);
      try {
        const result = await apiPost<BiasResultData>("/api/bias", {
          answers: newAnswers,
        });
        setBiasResult(result);
      } catch {
        // Backend not ready — use demo
        await new Promise(r => setTimeout(r, 1200));
        setBiasResult(DEMO_RESULT);
      }
      setStep(2);
    }
  };

  const handleRetake = () => {
    setStep(0);
    setCurrentQ(0);
    setAnswers([]);
    setBiasResult(null);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Behavioral Bias Fingerprint</h1>
            <p className="text-sm text-muted-foreground">Detect your dominant investing bias. Every output adapts.</p>
          </div>
        </div>
      </motion.div>

      {step === 0 && (
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-8 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">Question {currentQ + 1} of {quizQuestions.length}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-violet transition-all"
                style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold mb-6 text-foreground">{quizQuestions[currentQ].q}</h3>
          <div className="space-y-3">
            {quizQuestions[currentQ].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-violet/40 hover:bg-violet/5 transition-all text-sm font-medium group flex items-center justify-between text-foreground"
              >
                {opt}
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <div className="mt-16 text-center">
          <Loader2 className="w-12 h-12 text-violet animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Analysing Your Responses</h3>
          <p className="text-sm text-muted-foreground">Building your behavioral bias fingerprint...</p>
        </div>
      )}

      {step === 2 && biasResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
          {/* Radar chart */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-heading font-semibold text-foreground">Your Bias Fingerprint</h3>
              <button onClick={handleRetake} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Retake Quiz
              </button>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="hsl(var(--violet))" fill="hsl(var(--violet))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {biasResult.scores.map((b) => (
              <div
                key={b.bias}
                className={`rounded-xl p-4 text-center border ${b.score >= 70 ? "border-coral/30 bg-coral/5" : "border-border bg-card"}`}
              >
                <p className="text-xs text-muted-foreground mb-1">{b.bias}</p>
                <p className={`text-2xl font-heading font-bold ${b.score >= 70 ? "text-coral" : "text-foreground"}`}>
                  {b.score}
                </p>
              </div>
            ))}
          </div>

          {/* Adaptations */}
          <div className="rounded-xl bg-violet/5 border border-violet/20 p-6">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">
              How ArthSaathi Adapts to Your Profile
            </h3>
            <div className="space-y-4">
              {biasResult.adaptations.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1 rounded-full bg-violet shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-1 text-foreground">{a.bias}</p>
                    <p className="text-sm text-muted-foreground">{a.adaptation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default BiasFingerprint;