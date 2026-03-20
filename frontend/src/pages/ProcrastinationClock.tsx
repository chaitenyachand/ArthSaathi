import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Clock, IndianRupee, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProcrastinationClock = () => {
  const [running, setRunning] = useState(false);
  const [lostWealth, setLostWealth] = useState(0);
  const [sipAmount] = useState(38500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Per second: (38500 * 12% / 365 / 24 / 3600) compounded over 28 years
  // Simplified: ~6.80 per second at 12% CAGR over 28 years
  const perSecond = 6.80;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setLostWealth(prev => prev + perSecond);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const dailyLoss = perSecond * 86400;
  const yearlyLoss = dailyLoss * 365;
  const decadeLoss = yearlyLoss * 10;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Procrastination Cost Clock</h1>
            <p className="text-sm text-muted-foreground">Every second you delay, your retirement corpus shrinks</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 space-y-8">
        {/* Main counter */}
        <div className="text-center py-12 rounded-2xl bg-card border border-border shadow-card">
          <p className="text-sm text-muted-foreground mb-4">Retirement Wealth Lost Since You Opened This Page</p>
          <div className="flex items-center justify-center mb-6">
            <IndianRupee className="w-10 h-10 text-coral" />
            <span className={`text-6xl md:text-8xl font-heading font-bold text-coral tabular-nums ${running ? "animate-counter-tick" : ""}`}>
              {lostWealth.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            Based on SIP of INR {sipAmount.toLocaleString()}/month at 12% CAGR over 28 years
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant={running ? "outline" : "hero"}
              onClick={() => setRunning(!running)}
              className="min-w-[160px]"
            >
              {running ? <><Pause className="w-4 h-4 mr-2" /> Pause Counter</> : <><Play className="w-4 h-4 mr-2" /> Start Counter</>}
            </Button>
            {running && (
              <Button variant="hero" onClick={() => { setRunning(false); setLostWealth(0); }}>
                Set Up My SIP Now
              </Button>
            )}
          </div>
        </div>

        {/* Extrapolation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-card border border-border p-5 shadow-card text-center">
            <p className="text-xs text-muted-foreground mb-1">One Day of Delay</p>
            <p className="text-2xl font-heading font-bold text-coral flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />{Math.round(dailyLoss).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-card border border-border p-5 shadow-card text-center">
            <p className="text-xs text-muted-foreground mb-1">One Year of Delay</p>
            <p className="text-2xl font-heading font-bold text-coral flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />{(yearlyLoss / 100000).toFixed(2)}L
            </p>
          </div>
          <div className="rounded-xl bg-card border border-border p-5 shadow-card text-center">
            <p className="text-xs text-muted-foreground mb-1">A Decade of Delay</p>
            <p className="text-2xl font-heading font-bold text-coral flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />{(decadeLoss / 100000).toFixed(0)}L
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-muted border border-border p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is not a guilt trip. This is the truth made visible. Every second the counter runs, it represents the compounding growth you are forgoing. The moment you act, the loss stops. The cost of procrastination is the most underestimated expense in personal finance.
          </p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProcrastinationClock;