import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Flame, IndianRupee, MessageSquareWarning, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const TheMirror = () => {
  const [params, setParams] = useState({
    income: "",
    investments: "",
    dumb_purchases: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState("");
  const [displayedRoast, setDisplayedRoast] = useState("");

  const handleSubmit = async () => {
    if (!params.income || !params.investments || !params.dumb_purchases) return;
    
    setLoading(true);
    setRoast("");
    setDisplayedRoast("");
    try {
      const data = await api.askMirror({
        income: parseInt(params.income),
        investments: parseInt(params.investments),
        dumb_purchases: params.dumb_purchases
      });
      setRoast(data.roast);
    } catch (err) {
      console.error(err);
      setRoast("You broke the mirror. Probably because your finances are too painful to render.");
    }
    setLoading(false);
  };

  // Aggressive typewriter effect
  useEffect(() => {
    if (!roast) return;
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedRoast(roast.slice(0, i));
      i++;
      if (i > roast.length) clearInterval(intervalId);
    }, 25); // Fast typing speed
    
    return () => clearInterval(intervalId);
  }, [roast]);

  // If roast exists, we auto-darken background using Tailwind arbitrary overrides inside the div
  return (
    <DashboardLayout>
      <div className={`transition-all duration-1000 ${roast ? 'bg-[#050505] -m-6 p-6 min-h-[calc(100vh-80px)]' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className={`text-2xl font-heading font-bold ${roast ? 'text-red-50' : 'text-foreground'}`}>The Mirror</h1>
              <p className={`text-sm ${roast ? 'text-red-500/70' : 'text-muted-foreground'}`}>A brutally honest AI financial auditor. Prepare to be destroyed.</p>
            </div>
          </div>
        </motion.div>

        {!roast && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 max-w-2xl">
            <div className="p-8 rounded-3xl bg-card border border-border shadow-card space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Monthly Income (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="number" value={params.income} onChange={e => setParams({...params, income: e.target.value})} className="w-full text-base rounded-xl border border-input bg-background/50 pl-9 pr-4 py-3 text-foreground focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Monthly Investments (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="number" value={params.investments} onChange={e => setParams({...params, investments: e.target.value})} className="w-full text-base rounded-xl border border-input bg-background/50 pl-9 pr-4 py-3 text-foreground focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Confess your 3 dumbest recent purchases</label>
                <textarea 
                  value={params.dumb_purchases} 
                  onChange={e => setParams({...params, dumb_purchases: e.target.value})} 
                  placeholder="e.g. A ₹1.2L iPhone on EMI, ₹15k on Zomato, and overpriced shoes..."
                  className="w-full h-32 text-base rounded-xl border border-input bg-background/50 px-4 py-3 text-foreground focus:ring-2 focus:ring-red-500 outline-none resize-none"
                />
              </div>

              <Button onClick={handleSubmit} disabled={!params.income} className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-xl transition-colors mt-6">
                 Summon The Auditor
              </Button>
            </div>
          </motion.div>
        )}

        {loading && (
           <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
             <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
             <p className="text-red-500 font-mono animate-pulse">Analyzing your mistakes...</p>
           </div>
        )}

        {(displayedRoast || roast) && !loading && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-full bg-red-950 border border-red-500 flex items-center justify-center my-auto shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <MessageSquareWarning className="w-6 h-6 text-red-500" />
              </div>
              
              <div className="flex-1 p-6 md:p-8 rounded-3xl bg-red-950/20 border-2 border-red-900 shadow-2xl relative">
                {/* Visual Glitch / Tech UI elements */}
                <div className="absolute top-0 right-8 w-1 h-8 bg-red-500 opacity-50 font-mono text-xs text-red-500">SYS.ERR</div>
                <div className="absolute bottom-0 left-8 w-8 h-1 bg-red-500 opacity-50"></div>
                
                <h3 className="text-red-500 font-mono font-bold uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4"/> AI Auditor Terminal Active
                </h3>
                
                <div className="font-mono text-lg md:text-xl text-red-100 leading-relaxed whitespace-pre-wrap">
                  {displayedRoast}
                  {displayedRoast.length < roast.length && <span className="inline-block w-2 bg-red-500 h-5 ml-1 animate-ping"></span>}
                </div>
              </div>
            </div>

            {displayedRoast.length === roast.length && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex justify-center">
                <Button onClick={() => setRoast("")} className="bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-500 font-mono uppercase tracking-widest text-xs px-6">
                  [ Reboot Interface ]
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TheMirror;