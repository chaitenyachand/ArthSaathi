import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Search, Loader2, AlertTriangle, MessageCircleOff, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const BadAdvice = () => {
  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!statement.trim()) return;
    setLoading(true);
    try {
      const data = await api.askDebunker({ raw_statement: statement });
      setResult(data);
    } catch (err) {
      console.error("Failed to debunk statement", err);
    }
    setLoading(false);
  };

  const getDangerColor = (level: number) => {
    if (level >= 8) return "text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
    if (level >= 5) return "text-orange-500 bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]";
    return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
  };

  const getDangerPulse = (level: number) => {
    if (level >= 8) return "animate-pulse";
    return "";
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <MessageCircleOff className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Finfluencer Dissection</h1>
            <p className="text-sm text-muted-foreground">Paste toxic financial advice from social media. Our AI logic engine will destroy it mathematically.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-5 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-3xl bg-card border border-border shadow-card">
            <label className="text-sm font-semibold text-foreground block mb-3">Paste the Opinion / Tweet / Reel Subtitles</label>
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground opacity-50" />
              <textarea 
                value={statement} 
                onChange={(e) => setStatement(e.target.value)} 
                placeholder="e.g. 'Mutual funds are a scam designed by the matrix, just buy crypto on 100x leverage bro.'"
                className="w-full h-40 text-base rounded-2xl border border-input bg-background/50 pl-12 pr-4 py-4 text-foreground focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
            
            <Button onClick={handleSubmit} disabled={loading || !statement} className="w-full py-6 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-[0_4px_20px_rgba(79,70,229,0.3)] transition-all">
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Dissection Matrix"}
            </Button>
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          {loading && (
             <div className="h-full min-h-[300px] flex flex-col items-center justify-center space-y-4 border border-dashed border-indigo-500/30 rounded-3xl bg-indigo-500/5">
                <BrainCircuit className="w-12 h-12 text-indigo-500 animate-pulse" />
                <p className="text-indigo-500 font-mono text-sm tracking-widest uppercase">Cross-Referencing SEC Data...</p>
             </div>
          )}

          {result && !loading && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-md">
                   <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">Cognitive Fallacy Detected</p>
                   <h3 className="text-xl font-heading font-bold text-indigo-500">{result.fallacy_detected}</h3>
                </div>
                
                <div className={`p-6 rounded-2xl border flex items-center gap-4 ${getDangerColor(result.danger_level)}`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-background/50 ${getDangerPulse(result.danger_level)}`}>
                      <AlertTriangle className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Systemic Danger Level (1-10)</p>
                     <p className="text-4xl font-heading font-black">{result.danger_level}/10</p>
                   </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-card border-l-4 border-l-indigo-500 border-y border-r border-y-border border-r-border shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-indigo-500"/> The Mathematical Reality</h3>
                <p className="text-foreground/90 leading-relaxed text-lg">
                  {result.mathematical_truth}
                </p>
              </div>
              
            </motion.div>
          )}

          {!result && !loading && (
             <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-3xl bg-muted/20">
                <MessageCircleOff className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">Awaiting Target Parameters</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Paste terrible advice here. The Claude AI architecture will strip the emotional marketing and present the raw mathematical reality.
                </p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BadAdvice;