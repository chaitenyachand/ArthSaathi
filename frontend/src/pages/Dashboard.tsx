import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, FileText, Target, Heart, CalendarDays, Users,
  AlertTriangle, Brain, MessageCircle, Clock, Eye, Wallet, ArrowRight, Sparkles, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";

const moduleGroups = [
  {
    title: "Core Planning",
    description: "Build your financial foundation",
    accent: "primary" as const,
    modules: [
      { icon: Heart, title: "Money Health Score", desc: "5-min quiz across 6 dimensions with a personalised score", path: "/health-score", tag: "Start Here" },
      { icon: Target, title: "FIRE Path Planner", desc: "Month-by-month roadmap to financial freedom", path: "/fire-planner" },
      { icon: FileText, title: "Tax Wizard", desc: "Old vs new regime with missing deductions", path: "/tax-wizard" },
    ],
  },
  {
    title: "Portfolio & Analysis",
    description: "Uncover hidden costs in your investments",
    accent: "primary" as const,
    modules: [
      { icon: Search, title: "MF Portfolio X-Ray", desc: "Upload CAMS for true XIRR and overlap analysis", path: "/portfolio-xray" },
      { icon: AlertTriangle, title: "Cost of Bad Advice", desc: "See what your distributor really earned", path: "/bad-advice" },
      { icon: MessageCircle, title: "WhatsApp Tip Analyzer", desc: "Grade any forwarded stock tip A-to-F", path: "/tip-analyzer" },
    ],
  },
  {
    title: "Life & Relationships",
    description: "Plan finances around life's biggest moments",
    accent: "gold" as const,
    modules: [
      { icon: CalendarDays, title: "Life Event Advisor", desc: "Ranked action plan for major life moments", path: "/life-event" },
      { icon: Users, title: "Couple's Money Planner", desc: "Joint optimisation for dual-income households", path: "/couples-planner" },
      { icon: Wallet, title: "Salary-to-Wealth Translator", desc: "Convert any amount to retirement corpus", path: "/salary-translator" },
    ],
  },
  {
    title: "Behavioral Insights",
    description: "Understand the psychology of your money decisions",
    accent: "gold" as const,
    modules: [
      { icon: Brain, title: "Bias Fingerprint", desc: "Detect and adapt to your investing biases", path: "/bias-fingerprint" },
      { icon: Eye, title: "The Mirror", desc: "Stated vs actual investment behaviour", path: "/the-mirror" },
      { icon: Clock, title: "Procrastination Cost Clock", desc: "Live counter of wealth lost per second", path: "/procrastination-clock" },
    ],
  },
];

const accentStyles = {
  primary: {
    icon: "bg-primary/10 border-primary/20 text-primary",
    hover: "hover:border-primary/40",
    tag: "bg-primary/15 text-primary",
    title: "group-hover:text-primary",
    arrow: "text-primary",
  },
  gold: {
    icon: "bg-gold/10 border-gold/20 text-gold",
    hover: "hover:border-gold/40",
    tag: "bg-gold/15 text-gold",
    title: "group-hover:text-gold",
    arrow: "text-gold",
  },
};

const STORAGE_KEY = "arthsaathi-health-score";

const Dashboard = () => {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState<{ dimensions: { key: string; score: number }[]; timestamp: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setHealthData(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const overall = healthData
    ? Math.round(healthData.dimensions.reduce((a, d) => a + d.score, 0) / healthData.dimensions.length)
    : null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Welcome to ArthSaathi</h1>
            <p className="text-sm text-muted-foreground">Your AI-powered personal finance mentor</p>
          </div>
        </motion.div>
      </div>

      {/* Health Score Card on Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-10"
      >
        {overall !== null ? (
          <div className="rounded-xl border border-gold/20 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-gold" /> Your Money Health
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Last taken: {new Date(healthData!.timestamp).toLocaleDateString("en-IN")}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigate("/health-score")} className="gap-1 text-foreground border-border text-xs">
                  <RotateCcw className="w-3 h-3" /> Retake
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={overall >= 60 ? "hsl(var(--emerald))" : "hsl(var(--coral))"} strokeWidth="8" strokeDasharray={`${overall * 2.64} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-foreground">{overall}</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {healthData!.dimensions.map((d) => (
                  <div key={d.key} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{d.key}</p>
                    <p className={`text-lg font-heading font-bold ${d.score < 50 ? "text-coral" : "text-primary"}`}>{d.score}</p>
                  </div>
                ))}
              </div>
            </div>
            {healthData!.dimensions.some(d => d.score < 50) && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Areas needing attention:</p>
                <div className="flex flex-wrap gap-2">
                  {healthData!.dimensions.filter(d => d.score < 50).map(d => (
                    <span key={d.key} className="text-xs px-2.5 py-1 rounded-full bg-coral/10 text-coral font-medium">{d.key}: {d.score}/100</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => navigate("/health-score")}
            className="cursor-pointer rounded-xl border border-dashed border-gold/30 bg-gold/5 p-8 text-center hover:border-gold/50 transition-all"
          >
            <Heart className="w-10 h-10 text-gold mx-auto mb-3" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">Take Your Money Health Quiz</h3>
            <p className="text-sm text-muted-foreground">Get a personalised score across 6 financial dimensions with actionable suggestions</p>
          </div>
        )}
      </motion.div>

      {/* Module groups */}
      <div className="space-y-12">
        {moduleGroups.map((group, gi) => {
          const styles = accentStyles[group.accent];
          return (
            <motion.section
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.1 }}
            >
              <div className="flex items-baseline gap-3 mb-5">
                <h2 className="text-lg font-heading font-semibold text-foreground">{group.title}</h2>
                <span className="text-xs text-muted-foreground hidden sm:inline">{group.description}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {group.modules.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={m.path}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gi * 0.1 + i * 0.05 }}
                      onClick={() => navigate(m.path)}
                      className={cn(
                        "group cursor-pointer relative rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
                        styles.hover
                      )}
                    >
                      {m.tag && (
                        <span className={cn("absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full", styles.tag)}>
                          {m.tag}
                        </span>
                      )}
                      <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center mb-4", styles.icon)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className={cn("text-sm font-heading font-semibold mb-1 transition-colors text-foreground", styles.title)}>{m.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{m.desc}</p>
                      <div className={cn("flex items-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity", styles.arrow)}>
                        Open Module <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;