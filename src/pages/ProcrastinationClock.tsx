import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Clock, IndianRupee, ArrowRight, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { api } from "@/lib/api";

interface OpportunityCostResponse {
  total_saved_uninvested: number;
  total_compounding_lost: number;
  final_immediate_corpus: number;
  final_delayed_corpus: number;
  roadmap: { age: number; immediate_corpus: number; delayed_corpus: number }[];
}

const ProcrastinationClock = () => {
  const [sip, setSip] = useState("");
  const [currentAge, setCurrentAge] = useState("25");
  const [delayYears, setDelayYears] = useState("5");
  const [result, setResult] = useState<OpportunityCostResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const formatRupee = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const handleCalculate = async () => {
    const monthlySip = parseInt(sip.replace(/,/g, ""));
    const age = parseInt(currentAge);
    const delay = parseInt(delayYears);

    if (!monthlySip || !age || !delay) return;
    
    setLoading(true);
    try {
      const data = await api.calculateOpportunityCost({
        monthly_sip: monthlySip,
        current_age: age,
        delay_years: delay,
        retirement_age: 60,
        expected_cagr: 0.12
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-coral/10 border border-coral/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">The Procrastination Clock</h1>
            <p className="text-sm text-muted-foreground">Calculate the massive, irreversible compounded cost of waiting.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Monthly SIP (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={sip}
                  onChange={(e) => setSip(e.target.value)}
                  placeholder="20000"
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-3 text-foreground focus:ring-2 focus:ring-coral outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-coral outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Years Delayed</label>
              <input
                type="number"
                value={delayYears}
                onChange={(e) => setDelayYears(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-coral outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="py-6 px-10 bg-coral hover:bg-coral/90 text-white font-bold rounded-xl text-lg"
              onClick={handleCalculate}
              disabled={loading || !sip}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Calculate The Damage"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-coral/5 border border-red-500/20 p-8 flex flex-col justify-center text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4 mx-auto" />
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">You saved {formatRupee(result.total_saved_uninvested)}</p>
                <p className="text-sm text-muted-foreground mb-4">But because you delayed compounding, at Age 60 you lost a devastating</p>
                <h2 className="text-5xl font-heading font-black text-red-500 block tabular-nums">
                  -{formatRupee(result.total_compounding_lost)}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-card border border-border h-full flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Path A: Start Today</p>
                      <p className="text-3xl font-heading font-bold text-emerald">{formatRupee(result.final_immediate_corpus)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald" />
                  </div>
                  
                  <div className="w-full h-px bg-border my-2"></div>

                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Path B: Start {delayYears} Years Later</p>
                      <p className="text-3xl font-heading font-bold text-foreground">{formatRupee(result.final_delayed_corpus)}</p>
                    </div>
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-card mt-6">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-6">The Divergence Chart (Age to 60)</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.roadmap} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorImmediate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `Age ${Math.floor(v)}`} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v/10000000).toFixed(1)}Cr`} width={80} />
                    <Tooltip 
                      formatter={(value: number) => formatRupee(value)}
                      labelFormatter={(label) => `Age ${label}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="immediate_corpus" name="Start Today" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorImmediate)" />
                    <Area type="monotone" dataKey="delayed_corpus" name="Start Later" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDelayed)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default ProcrastinationClock;