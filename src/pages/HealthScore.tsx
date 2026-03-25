import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Activity, IndianRupee, ArrowRight, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const HealthScore = () => {
  const [inputs, setInputs] = useState({
    monthly_income: "150000",
    monthly_rent_emi: "40000",
    monthly_sip: "20000",
    emergency_fund_balance: "300000",
    total_debt: "1000000"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const handleCalculate = async () => {
    setLoading(true);
    setAnimatedScore(0);
    try {
      const payload = {
        monthly_income: parseFloat(inputs.monthly_income),
        monthly_rent_emi: parseFloat(inputs.monthly_rent_emi),
        monthly_sip: parseFloat(inputs.monthly_sip),
        emergency_fund_balance: parseFloat(inputs.emergency_fund_balance),
        total_debt: parseFloat(inputs.total_debt),
      };
      const data = await api.calculateHealthScore(payload);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setAnimatedScore(result.score), 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const getColor = (grade: string) => {
    switch(grade) {
      case "A+": return "text-emerald border-emerald";
      case "B": return "text-blue-500 border-blue-500";
      case "C": return "text-yellow-500 border-yellow-500";
      case "D": return "text-orange-500 border-orange-500";
      case "F": return "text-red-500 border-red-500";
      default: return "text-emerald border-emerald";
    }
  };

  const getStroke = (grade: string) => {
    switch(grade) {
      case "A+": return "#10b981";
      case "B": return "#3b82f6";
      case "C": return "#eab308";
      case "D": return "#f97316";
      case "F": return "#ef4444";
      default: return "#10b981";
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Financial Health Score</h1>
            <p className="text-sm text-muted-foreground">The ultimate geometric proof of your systemic financial security.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left column: Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Input Global Metrics</h3>
            <div className="space-y-4">
              {Object.entries(inputs).map(([key, val]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1 uppercase tracking-wider">{key.replace(/_/g, " ")}</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => setInputs({...inputs, [key]: e.target.value})} 
                      className="w-full text-sm rounded-lg border border-input bg-background/50 pl-9 pr-3 py-3 text-foreground focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleCalculate} disabled={loading} className="w-full py-6 mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-xl transition-colors">
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run Full Diagnostic"}
            </Button>
          </div>
        </div>

        {/* Right column: The Gauge */}
        <div className="lg:col-span-7">
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 flex flex-col items-center">
              
              <div className="p-8 rounded-3xl bg-card border border-border shadow-2xl relative w-full flex flex-col items-center overflow-hidden">
                {/* Background glow mapping to grade */}
                <div className="absolute inset-0 opacity-5 blur-3xl pointer-events-none" style={{ backgroundColor: getStroke(result.grade) }} />
                
                <h3 className="text-lg font-heading font-bold text-foreground mb-8 z-10">Systemic Health Diagnostic</h3>
                
                {/* SVG Animated Circular Gauge */}
                <div className="relative w-64 h-64 z-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="110" className="stroke-muted" strokeWidth="20" fill="none" />
                    <motion.circle 
                      cx="128" 
                      cy="128" 
                      r="110" 
                      stroke={getStroke(result.grade)} 
                      strokeWidth="20" 
                      fill="none" 
                      strokeLinecap="round"
                      strokeDasharray="691"
                      initial={{ strokeDashoffset: 691 }}
                      animate={{ strokeDashoffset: 691 - (691 * animatedScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-heading font-black">{animatedScore}</span>
                    <span className={`text-xl font-bold mt-1 px-3 py-1 rounded-md border ${getColor(result.grade)}`}>
                      Grade: {result.grade}
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Analysis */}
                <div className="w-full mt-10 space-y-3 z-10">
                   {result.breakdown.map((item: any, idx: number) => (
                     <div key={idx} className={`p-4 rounded-xl flex items-center justify-between border ${item.points_deducted > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald/5 border-emerald/20'}`}>
                        <div className="flex items-center gap-3">
                          {item.points_deducted > 0 ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-emerald" />}
                          <div>
                            <p className="text-sm font-semibold text-foreground">{item.rule}</p>
                            <p className="text-xs text-muted-foreground">{item.status}</p>
                          </div>
                        </div>
                        {item.points_deducted > 0 ? (
                          <span className="font-mono font-bold text-red-500">-{item.points_deducted} Pts</span>
                        ) : (
                          <span className="font-mono font-bold text-emerald">Perfect</span>
                        )}
                     </div>
                   ))}
                </div>

              </div>
            </motion.div>
          ) : (
             <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-muted/30">
                <ShieldCheck className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">Awaiting Diagnostic Data</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Punch in your foundational financial parameters. Our engine deducts strictly defined points for violating the 50/30/20 rule, excessive rent burdens, and dangerous emergency float sizes.
                </p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HealthScore;