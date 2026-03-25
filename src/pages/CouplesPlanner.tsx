import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Users, IndianRupee, ArrowRight, HeartPulse, PieChart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { api } from "@/lib/api";

const CouplesPlanner = () => {
  const [partnerA, setPartnerA] = useState({ name: "Partner A", corpus: "500000", sip: "30000", cagr: "0.12" });
  const [partnerB, setPartnerB] = useState({ name: "Partner B", corpus: "200000", sip: "15000", cagr: "0.10" });
  const [target, setTarget] = useState("50000000"); // 5 Cr default target
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const formatRupee = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const handleCalculate = async () => {
    if (!partnerA.corpus || !partnerB.corpus || !target) return;
    
    setLoading(true);
    try {
      const payload = {
        person_a: {
          name: partnerA.name,
          current_corpus: parseFloat(partnerA.corpus),
          sip: parseFloat(partnerA.sip),
          expected_cagr: parseFloat(partnerA.cagr)
        },
        person_b: {
          name: partnerB.name,
          current_corpus: parseFloat(partnerB.corpus),
          sip: parseFloat(partnerB.sip),
          expected_cagr: parseFloat(partnerB.cagr)
        },
        joint_target_corpus: parseFloat(target),
        joint_monthly_expenses: 100000 // Mock variable placeholder
      };
      const data = await api.simulateCouplesFire(payload);
      // We only need the roadmap up to FIRE date + 5 years to keep the chart clean
      const fireYear = Math.ceil(data.years_to_fire);
      data.roadmap = data.roadmap.slice(0, Math.min(fireYear + 5, 40));
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
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Couples FIRE Aggregator</h1>
            <p className="text-sm text-muted-foreground">Intersect two vastly different portfolio profiles into one shared target date.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left column: Parameters */}
        <div className="lg:col-span-4 space-y-6">
          {/* Partner A */}
          <div className="p-6 rounded-2xl bg-violet/5 border border-violet/20 shadow-card">
            <h3 className="text-sm font-semibold text-violet mb-4 flex items-center gap-2"><HeartPulse className="w-4 h-4"/> Partner A Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Current Corpus (₹)</label>
                <input type="number" value={partnerA.corpus} onChange={e => setPartnerA({...partnerA, corpus: e.target.value})} className="w-full text-sm rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground focus:ring-1 focus:ring-violet outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Monthly SIP (₹)</label>
                <input type="number" value={partnerA.sip} onChange={e => setPartnerA({...partnerA, sip: e.target.value})} className="w-full text-sm rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground focus:ring-1 focus:ring-violet outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Expected CAGR (e.g. 0.12)</label>
                <input type="number" step="0.01" value={partnerA.cagr} onChange={e => setPartnerA({...partnerA, cagr: e.target.value})} className="w-full text-sm rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground focus:ring-1 focus:ring-violet outline-none" />
              </div>
            </div>
          </div>

          {/* Partner B */}
          <div className="p-6 rounded-2xl bg-coral/5 border border-coral/20 shadow-card">
            <h3 className="text-sm font-semibold text-coral mb-4 flex items-center gap-2"><HeartPulse className="w-4 h-4"/> Partner B Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Current Corpus (₹)</label>
                <input type="number" value={partnerB.corpus} onChange={e => setPartnerB({...partnerB, corpus: e.target.value})} className="w-full text-sm rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground focus:ring-1 focus:ring-coral outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Monthly SIP (₹)</label>
                <input type="number" value={partnerB.sip} onChange={e => setPartnerB({...partnerB, sip: e.target.value})} className="w-full text-sm rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground focus:ring-1 focus:ring-coral outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Expected CAGR (e.g. 0.10)</label>
                <input type="number" step="0.01" value={partnerB.cagr} onChange={e => setPartnerB({...partnerB, cagr: e.target.value})} className="w-full text-sm rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground focus:ring-1 focus:ring-coral outline-none" />
              </div>
            </div>
          </div>

          {/* Target */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
            <label className="text-sm font-semibold text-foreground block mb-2">Joint Target Corpus (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={target} onChange={e => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-3 text-foreground focus:ring-2 focus:ring-pink-500 outline-none font-bold" />
            </div>
          </div>

          <Button onClick={handleCalculate} disabled={loading} className="w-full py-6 mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg rounded-xl shadow-xl">
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Merge Portfolios"}
          </Button>
        </div>

        {/* Right column: Results & Stacked Chart */}
        <div className="lg:col-span-8">
          {result ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-violet/10 border border-violet/20 flex flex-col justify-center">
                  <p className="text-xs font-semibold text-violet mb-1 uppercase tracking-wider">{partnerA.name} Share</p>
                  <p className="text-2xl font-heading font-bold text-foreground">{formatRupee(result.person_a_final)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-coral/10 border border-coral/20 flex flex-col justify-center">
                  <p className="text-xs font-semibold text-coral mb-1 uppercase tracking-wider">{partnerB.name} Share</p>
                  <p className="text-2xl font-heading font-bold text-foreground">{formatRupee(result.person_b_final)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/30 flex flex-col justify-center items-center text-center">
                  <p className="text-xs font-semibold text-pink-500 mb-1 uppercase tracking-wider">Joint FIRE Timeline</p>
                  <h2 className="text-4xl font-heading font-black text-foreground">{result.years_to_fire} <span className="text-xl">Years</span></h2>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-card h-[450px]">
                <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Joint Stacked Growth Projection</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.roadmap} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff7e67" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ff7e67" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `Yr ${v}`} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v/10000000).toFixed(1)}Cr`} width={60} />
                    <Tooltip 
                      formatter={(value: number) => formatRupee(value)}
                      labelFormatter={(label) => `Year ${label}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend />
                    <ReferenceLine y={parseFloat(target)} label={{ position: 'top', value: 'Joint Target', fill: '#ec4899', fontSize: 12, fontWeight: 'bold' }} stroke="#ec4899" strokeDasharray="3 3" />
                    <Area type="monotone" stackId="1" dataKey="person_a_corpus" name={partnerA.name} stroke="#8b5cf6" fillOpacity={1} fill="url(#colorA)" />
                    <Area type="monotone" stackId="1" dataKey="person_b_corpus" name={partnerB.name} stroke="#ff7e67" fillOpacity={1} fill="url(#colorB)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </motion.div>
          ) : (
             <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-muted/30">
                <PieChart className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">Awaiting Partner Data</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Enter both individuals' current balances, SIP capacities, and risk profiles (CAGR). Our engine will compound them entirely separately but visually merge them to hunt down your shared FIRE date natively.
                </p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CouplesPlanner;