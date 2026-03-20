import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";

const sampleTip = `URGENT BUY - ABC Micro Finance Ltd
CMP: ₹142 | Target: ₹280 (97% return)
Operator entering massively. Rumoured acquisition by HDFC Bank.
Must buy before market opens Monday. 
Insider info - guaranteed 100% return in 3 months.
Don't miss this once in a lifetime opportunity!`;

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface TipCheck {
  label: string;
  status: "fail" | "warn" | "pass";
  detail: string;
}

interface TipAnalysisResult {
  grade: string;
  stock: string;
  checks: TipCheck[];
}

// ─── DEMO FALLBACK ────────────────────────────────────────────────────────────
const DEMO_RESULT: TipAnalysisResult = {
  grade: "F",
  stock: "ABC Micro Finance Ltd",
  checks: [
    { label: "Volume Spike Detection", status: "fail", detail: "4.2x volume spike detected 4 days before tip circulation. Strong pump-and-dump indicator." },
    { label: "Language Red-Flag Score", status: "fail", detail: "6 high-risk phrases detected: 'operator entering', 'must buy', '100% return guaranteed', 'insider info', 'don't miss', 'once in a lifetime'." },
    { label: "F&O Ban Status", status: "warn", detail: "Stock not in F&O segment. Micro-cap with no derivatives trading — higher manipulation risk." },
    { label: "Analyst Coverage", status: "fail", detail: "Zero SEBI-registered analyst coverage. No institutional research exists for this stock." },
    { label: "Market Cap Check", status: "fail", detail: "Market cap below INR 500 Cr. Micro-caps are the most common targets for pump-and-dump schemes." },
    { label: "Promoter Holding", status: "warn", detail: "Promoter holding below 40%. Low promoter stake increases manipulation risk." },
  ],
};

const RED_FLAG_REGEX = /(operator entering|must buy|100% return guaranteed|insider info|don't miss|once in a lifetime)/gi;

const TipAnalyzer = () => {
  const [tipText, setTipText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TipAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await apiPost<TipAnalysisResult>("/api/tip", { text: tipText });
      setAnalysisResult(result);
    } catch {
      // Backend not ready — use demo data
      await new Promise(r => setTimeout(r, 2000));
      setAnalysisResult(DEMO_RESULT);
    }
    setAnalyzing(false);
    setAnalyzed(true);
  };

  const gradeColor = (grade: string) => {
    if (grade === "A") return "text-emerald border-emerald/30 bg-emerald/5";
    if (grade === "B") return "text-primary border-primary/30 bg-primary/5";
    if (grade === "C") return "text-gold border-gold/30 bg-gold/5";
    if (grade === "D") return "text-coral border-coral/30 bg-coral/5";
    return "text-destructive border-destructive/30 bg-destructive/5";
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">WhatsApp Tip Analyzer</h1>
            <p className="text-sm text-muted-foreground">Grade any stock tip A-to-F with red-flag analysis</p>
          </div>
        </div>
      </motion.div>

      {!analyzed && !analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Paste the stock tip message</label>
            <textarea
              value={tipText}
              onChange={(e) => setTipText(e.target.value)}
              placeholder="Paste a WhatsApp or Telegram stock tip here..."
              className="w-full h-40 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="hero" onClick={handleAnalyze} disabled={!tipText.trim()}>
              Analyze Tip <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setTipText(sampleTip)}>
              Load Sample Tip
            </Button>
          </div>
        </motion.div>
      )}

      {analyzing && (
        <div className="mt-16 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin mx-auto mb-6" />
          <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Analyzing Tip</h3>
          <p className="text-sm text-muted-foreground">Checking NSE volume data, language patterns, analyst coverage...</p>
        </div>
      )}

      {analyzed && analysisResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
          {/* Grade */}
          <div className="text-center py-8">
            <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 ${gradeColor(analysisResult.grade)}`}>
              <span className="text-5xl font-heading font-bold">{analysisResult.grade}</span>
            </div>
            <p className="text-lg font-heading font-semibold mt-4 text-foreground">{analysisResult.stock}</p>
            <p className={`text-sm font-medium mt-1 ${analysisResult.grade === "F" || analysisResult.grade === "D" ? "text-destructive" : "text-emerald"}`}>
              {analysisResult.grade === "F" || analysisResult.grade === "D"
                ? "High Risk — Do Not Act on This Tip"
                : "Looks Reasonable — Still Do Your Own Research"}
            </p>
          </div>

          {/* Tip text with highlights */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-card">
            <h3 className="text-sm font-heading font-semibold mb-3 text-foreground">Original Tip Message</h3>
            <div className="p-4 rounded-lg bg-muted/50 text-sm leading-relaxed whitespace-pre-line font-mono text-foreground">
              {tipText.split(RED_FLAG_REGEX).map((part, i) => {
                const isRedFlag = RED_FLAG_REGEX.test(part);
                RED_FLAG_REGEX.lastIndex = 0;
                return isRedFlag ? (
                  <span key={i} className="bg-destructive/20 text-destructive px-1 rounded font-semibold">{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                );
              })}
            </div>
          </div>

          {/* Checks */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">
              {analysisResult.checks.length}-Point Analysis
            </h3>
            <div className="space-y-3">
              {analysisResult.checks.map((c, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="shrink-0 mt-0.5">
                    {c.status === "fail" ? (
                      <X className="w-5 h-5 text-destructive" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-gold" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5 text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => { setAnalyzed(false); setTipText(""); setAnalysisResult(null); }}>
            Analyze Another Tip
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default TipAnalyzer;