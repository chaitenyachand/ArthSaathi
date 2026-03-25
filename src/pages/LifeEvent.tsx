import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Plus, IndianRupee, ArrowRight, TrendingUp, X, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";

interface LifeEvent {
  name: string;
  cost: number;
  years_from_now: number;
}

const LifeEventComponent = () => {
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [years, setYears] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addEvent = () => {
    if (!name || !cost || !years) return;
    setEvents([...events, { name, cost: parseFloat(cost), years_from_now: parseFloat(years) }]);
    setName(""); setCost(""); setYears("");
  };

  const removeEvent = (index: number) => {
    const arr = [...events];
    arr.splice(index, 1);
    setEvents(arr);
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await api.simulateFirePath({
        current_age: 30, // hardcoded baseline to show relative anomalies
        target_age: 50,
        current_corpus: 1000000,
        target_corpus: 30000000,
        expected_cagr: 0.12,
        inflation_rate: 0.06,
        life_events: events
      });
      // Convert monthly to yearly for safe smooth rendering
      const compressed = data.roadmap.filter((r: any) => r.month % 12 === 0);
      data.roadmap = compressed;
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const formatRupee = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Life Event Simulator</h1>
            <p className="text-sm text-muted-foreground">Inject massive cash flow shocks into your FIRE trajectory.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left column: Event Builder */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Add Liquidity Shock</h3>
            <div className="space-y-3">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Event Name (e.g. Wedding)" className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-orange-500 outline-none" />
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Total Cost (₹)" className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-orange-500 outline-none" />
              <input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="Years from now" className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-orange-500 outline-none" />
              <Button onClick={addEvent} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" /> Add Shock Event
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex justify-between items-center bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{ev.name}</p>
                    <p className="text-xs text-muted-foreground">-{formatRupee(ev.cost)} in Year {ev.years_from_now}</p>
                  </div>
                  <button onClick={() => removeEvent(i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-500/20 text-orange-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button onClick={handleSimulate} disabled={loading || events.length === 0} className="w-full py-6 mt-4 bg-foreground hover:bg-foreground/90 text-background font-bold text-lg rounded-xl shadow-xl">
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Simulation Matrix"}
          </Button>
        </div>

        {/* Right column: Results & Chart */}
        <div className="lg:col-span-8">
          {result ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <p className="text-sm font-semibold text-muted-foreground mb-1 tracking-wider uppercase">Baseline Target</p>
                  <p className="text-3xl font-heading font-black text-foreground">{formatRupee(30000000)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center flex flex-col justify-center items-center">
                  <p className="text-sm font-semibold text-orange-500 mb-1 tracking-wider uppercase">New Adjusted SIP Required</p>
                  <p className="text-4xl font-heading font-black text-orange-500">{formatRupee(result.summary.required_monthly_sip)}/mo</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-card h-[450px]">
                <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Trajectory Deficit Map</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.roadmap} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `Age ${Math.floor(v)}`} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v/10000000).toFixed(1)}Cr`} width={60} />
                    <Tooltip 
                      formatter={(value: number) => formatRupee(value)}
                      labelFormatter={(label) => `Age ${label}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="projected_corpus" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorProjected)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ) : (
             <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-muted/30">
                <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">Simulation Sandbox Empty</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Add major future expenses like a Wedding, House Downpayment, or Sabbatical. We will recalculate the exact required systemic SIP jump to survive the anomaly.
                </p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LifeEventComponent;