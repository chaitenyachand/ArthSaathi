import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, TrendingUp, PieChart, AlertTriangle, BarChart3, Sparkles, FileText } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const sampleResult = {
  xirr: 8.4,
  apparentReturn: 38,
  benchmark: 12.1,
  overlap: 73,
  expenseRatioPaid: 47300,
  expenseProjected: 180000,
  funds: [
    { name: "SBI Bluechip Fund", type: "Regular", er: 1.65, directEr: 0.42, value: 320000, xirr: 7.8 },
    { name: "Axis Bluechip Fund", type: "Regular", er: 1.48, directEr: 0.38, value: 280000, xirr: 9.2 },
    { name: "Mirae Large Cap", type: "Direct", er: 0.55, directEr: 0.55, value: 210000, xirr: 11.4 },
    { name: "HDFC Mid-Cap Opp", type: "Regular", er: 1.72, directEr: 0.65, value: 190000, xirr: 14.1 },
  ],
  overlapData: [
    { subject: "HDFC Bank", A: 18, B: 22, C: 15 },
    { subject: "Infosys", A: 12, B: 14, C: 10 },
    { subject: "Reliance", A: 15, B: 16, C: 18 },
    { subject: "TCS", A: 8, B: 11, C: 9 },
    { subject: "ICICI Bank", A: 10, B: 8, C: 12 },
  ],
};

const returnComparison = [
  { label: "Apparent Return", value: 38, color: "hsl(var(--muted-foreground))" },
  { label: "True XIRR", value: 8.4, color: "hsl(var(--coral))" },
  { label: "Nifty 50 Benchmark", value: 12.1, color: "hsl(var(--gold))" },
];

const PortfolioXRay = () => {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setUploaded(true);
      }, 2500);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDemoUpload = () => {
    setFileName("demo_cams_statement.pdf");
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploaded(true);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">MF Portfolio X-Ray</h1>
            <p className="text-sm text-muted-foreground">Upload your CAMS statement for a complete portfolio analysis</p>
          </div>
        </div>
      </motion.div>

      {!uploaded && !analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-border rounded-2xl p-16 text-center cursor-pointer hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 group"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-gold transition-colors" />
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Upload CAMS Statement (PDF)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download from camsonline.com — Consolidated Account Statement (PDF)
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
              <FileText className="w-4 h-4" />
              <span>Accepted format: PDF only</span>
            </div>
            <Button variant="hero" size="sm" onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}>
              Select PDF File
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="mt-6 p-4 rounded-xl bg-muted border border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Don't have your CAMS statement handy? Try a demo analysis to see what insights you'll get.
            </p>
            <Button variant="outline" size="sm" onClick={handleDemoUpload} className="shrink-0 ml-4 text-foreground border-border">
              Try Demo
            </Button>
          </div>
        </motion.div>
      )}

      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin mx-auto mb-6" />
          <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">Analyzing Your Portfolio</h3>
          {fileName && <p className="text-sm text-gold mb-2">{fileName}</p>}
          <p className="text-sm text-muted-foreground">Parsing transactions, computing XIRR, checking overlaps...</p>
        </motion.div>
      )}

      {uploaded && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 text-gold" />
              Analyzed: <span className="text-gold font-medium">{fileName}</span>
              <Button variant="ghost" size="sm" className="ml-auto text-foreground" onClick={() => { setUploaded(false); setFileName(null); }}>
                Upload New
              </Button>
            </div>
          )}

          {/* Headline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-card border border-border p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">Apparent Return</p>
              <p className="text-3xl font-heading font-bold text-muted-foreground">{sampleResult.apparentReturn}%</p>
              <p className="text-xs text-muted-foreground mt-1">Misleading absolute return</p>
            </div>
            <div className="rounded-xl bg-card border border-coral/30 p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">True XIRR (Annualised)</p>
              <p className="text-3xl font-heading font-bold text-coral">{sampleResult.xirr}%</p>
              <p className="text-xs text-coral mt-1">Your real return is much lower</p>
            </div>
            <div className="rounded-xl bg-card border border-gold/30 p-5 shadow-card">
              <p className="text-xs text-muted-foreground mb-1">Nifty 50 Benchmark</p>
              <p className="text-3xl font-heading font-bold text-gold">{sampleResult.benchmark}%</p>
              <p className="text-xs text-gold mt-1">You underperformed the index</p>
            </div>
          </div>

          {/* Return comparison chart */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 flex items-center gap-2 text-foreground">
              <BarChart3 className="w-4 h-4 text-gold" /> Return Comparison
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={returnComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 40]} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <YAxis type="category" dataKey="label" width={130} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} labelStyle={{ color: 'hsl(var(--foreground))' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {returnComparison.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Overlap */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-2 flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-4 h-4 text-coral" /> Portfolio Overlap: {sampleResult.overlap}%
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your portfolio has {sampleResult.overlap}% overlap across 3 large-cap funds. You are paying for three funds but effectively owning one.
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={sampleResult.overlapData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="SBI Bluechip" dataKey="A" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.2} />
                <Radar name="Axis Bluechip" dataKey="B" stroke="hsl(var(--emerald))" fill="hsl(var(--emerald))" fillOpacity={0.2} />
                <Radar name="Mirae Large Cap" dataKey="C" stroke="hsl(var(--violet))" fill="hsl(var(--violet))" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Fund holdings table */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card overflow-x-auto">
            <h3 className="text-base font-heading font-semibold mb-4 flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" /> Fund-wise Analysis
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Fund Name</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Expense Ratio</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Direct ER</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Value</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">XIRR</th>
                </tr>
              </thead>
              <tbody>
                {sampleResult.funds.map((f, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">{f.name}</td>
                    <td className="text-center py-3 px-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        f.type === "Regular" ? "bg-coral/10 text-coral" : "bg-primary/10 text-primary"
                      }`}>{f.type}</span>
                    </td>
                    <td className="text-right py-3 px-2 text-foreground">{f.er}%</td>
                    <td className="text-right py-3 px-2 text-primary">{f.directEr}%</td>
                    <td className="text-right py-3 px-2 font-mono text-foreground">{f.value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</td>
                    <td className="text-right py-3 px-2 font-mono text-foreground">{f.xirr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expense ratio */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 text-foreground">Expense Ratio Drag</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-coral/5 border border-coral/20">
                <p className="text-xs text-muted-foreground mb-1">Paid in Last 5 Years</p>
                <p className="text-2xl font-heading font-bold text-coral">{sampleResult.expenseRatioPaid.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</p>
              </div>
              <div className="p-4 rounded-lg bg-coral/5 border border-coral/20">
                <p className="text-xs text-muted-foreground mb-1">Projected 20-Year Cost</p>
                <p className="text-2xl font-heading font-bold text-coral">{sampleResult.expenseProjected.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>

          {/* AI Rebalancing */}
          <div className="rounded-xl bg-card border border-gold/20 p-6 shadow-card">
            <h3 className="text-base font-heading font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Sparkles className="w-4 h-4 text-gold" /> AI Rebalancing Plan
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p className="text-foreground"><strong>Merge large-cap funds:</strong> SBI Bluechip and Axis Bluechip have 73% overlap. Switch both to a single Nifty 50 index fund (UTI Nifty 50 Direct — 0.1% ER). This eliminates overlap and saves 1.2% in annual fees.</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p className="text-foreground"><strong>Switch Regular to Direct:</strong> HDFC Mid-Cap Opportunities is in Regular plan. Switch to Direct to save 1.07% annually. Wait until April to avoid STCG on recent purchases.</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p className="text-foreground"><strong>Add debt allocation:</strong> Portfolio is 100% equity. Add 20-30% in a short-duration debt fund or liquid fund for stability and rebalancing opportunities during corrections.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default PortfolioXRay;