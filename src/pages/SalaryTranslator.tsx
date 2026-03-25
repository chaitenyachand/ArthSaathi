import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Wallet, IndianRupee, ArrowRight, TrendingDown, Percent, Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface SalaryResponse {
  gross_monthly: number;
  basic_monthly: number;
  epf_deduction: number;
  pt_deduction: number;
  tax_deduction: number;
  net_take_home: number;
}

const SalaryTranslator = () => {
  const [ctc, setCtc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SalaryResponse | null>(null);

  const handleCalculate = async () => {
    const numericCtc = parseInt(ctc.replace(/,/g, ""));
    if (!numericCtc || numericCtc < 10000) return;
    
    setLoading(true);
    try {
      const data = await api.translateSalary({ annual_ctc: numericCtc });
      setResult(data);
    } catch (e) {
      console.error("Failed to fetch salary breakdown", e);
    }
    setLoading(false);
  };

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">CTC to Take-Home Translator</h1>
            <p className="text-sm text-muted-foreground">Strip away EPF, PT, and New Regime Income Tax mathematically.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 max-w-3xl">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card mb-8">
          <label className="block text-sm font-semibold text-foreground mb-3">Gross Annual CTC (₹)</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="e.g. 1500000"
                className="w-full text-lg rounded-xl border border-input bg-background pl-12 pr-4 py-4 text-foreground focus:ring-2 focus:ring-emerald outline-none transition-all"
              />
            </div>
            <Button 
              className="py-4 h-auto px-8 bg-emerald hover:bg-emerald/90 text-background font-bold rounded-xl"
              onClick={handleCalculate}
              disabled={loading || !ctc}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deconstruct CTC"}
            </Button>
          </div>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* The Leakage Column (Red) */}
            <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-heading font-bold text-foreground">Government Deductions</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-card border border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Gross Monthly Base</p>
                  </div>
                  <p className="font-mono text-muted-foreground">{formatRupee(result.gross_monthly)}</p>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div>
                    <p className="text-sm font-semibold text-red-400">EPF Contribution</p>
                    <p className="text-xs text-red-400/70">12% of Basic ({formatRupee(result.basic_monthly)})</p>
                  </div>
                  <p className="font-mono font-bold text-red-400">-{formatRupee(result.epf_deduction)}</p>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div>
                    <p className="text-sm font-semibold text-red-400">Professional Tax</p>
                    <p className="text-xs text-red-400/70">Standard Slice</p>
                  </div>
                  <p className="font-mono font-bold text-red-400">-{formatRupee(result.pt_deduction)}</p>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div>
                    <p className="text-sm font-semibold text-red-400">Income Tax (New Regime)</p>
                    <p className="text-xs text-red-400/70">Dynamic Slabs Applied</p>
                  </div>
                  <p className="font-mono font-bold text-red-400">-{formatRupee(result.tax_deduction)}</p>
                </div>
              </div>
            </div>

            {/* The Reality Column (Green) */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald/10 to-teal/5 border border-emerald/20 p-6 flex flex-col justify-center text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald/20 flex items-center justify-center mb-6">
                <Calculator className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm font-semibold text-emerald mb-2 uppercase tracking-wider">Absolute Take-Home</p>
              <h2 className="text-5xl font-heading font-black text-foreground mb-4 tabular-nums block">
                {formatRupee(result.net_take_home)}
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                This is the exact net liquid cash hitting your bank account every month after all aggressive state deductions.
              </p>
            </div>

          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default SalaryTranslator;