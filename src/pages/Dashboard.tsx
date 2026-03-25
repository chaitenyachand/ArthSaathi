import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, FileText, Target, Heart, CalendarDays, Users, Flame, LayoutDashboard, Database,
  AlertTriangle, Brain, MessageCircle, Clock, Eye, Wallet, ArrowRight, Sparkles, PieChart, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const moduleGroups = [
  {
    title: "Core Planning",
    description: "Build your financial foundation",
    accent: "primary" as const,
    modules: [
      { icon: Heart, title: "Money Health Score", desc: "Absolute mathematical calculation of systemic health", path: "/health-score" },
      { icon: Target, title: "FIRE Path Planner", desc: "Month-by-month roadmap to financial freedom", path: "/fire-planner" },
      { icon: FileText, title: "Tax Wizard", desc: "Engine detecting highest mathematical tax deduction strategy", path: "/tax-wizard" },
    ],
  },
  {
    title: "AI Analysis",
    description: "Uncover hidden costs and forensic truths",
    accent: "gold" as const,
    modules: [
      { icon: Search, title: "MF Portfolio X-Ray", desc: "Parse CAMS statements for true XIRR overlap analysis", path: "/portfolio-xray" },
      { icon: AlertTriangle, title: "Influencer Dissection", desc: "Destroy terrible financial marketing advice via AI", path: "/bad-advice" },
      { icon: MessageCircle, title: "WhatsApp Tip Analyzer", desc: "Forensic reality mapping grading text tips A-to-F", path: "/tip-analyzer" },
    ],
  },
  {
    title: "Simulators",
    description: "Plan finances around variable trajectories",
    accent: "coral" as const,
    modules: [
      { icon: CalendarDays, title: "Life Event Simulator", desc: "Aggressive cash flow shocks against your retirement plan", path: "/life-event" },
      { icon: Users, title: "Couple's Engine", desc: "Joint optimisation mapping for dual-income households", path: "/couples-planner" },
      { icon: Wallet, title: "Salary Translator", desc: "Strip Indian tax/EPF dynamically converting Gross to Take-Home", path: "/salary-translator" },
    ],
  },
  {
    title: "Behavioral Drivers",
    description: "Understand the psychology of your money decisions",
    accent: "indigo" as const,
    modules: [
      { icon: Brain, title: "Bias Fingerprint", desc: "Detect and adapt to your psychological investing biases", path: "/bias-fingerprint" },
      { icon: Flame, title: "The Mirror", desc: "Savage AI Auditor built to aggressively roast bad habits", path: "/the-mirror" },
      { icon: Clock, title: "Procrastination Clock", desc: "Live mapping of geometric compounding lost due to delays", path: "/procrastination-clock" },
    ],
  },
];

const accentStyles = {
  primary: { icon: "bg-emerald/10 border-emerald/20 text-emerald", hover: "hover:border-emerald/40", title: "group-hover:text-emerald", arrow: "text-emerald" },
  gold: { icon: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500", hover: "hover:border-yellow-500/40", title: "group-hover:text-yellow-500", arrow: "text-yellow-500" },
  coral: { icon: "bg-coral/10 border-coral/20 text-coral", hover: "hover:border-coral/40", title: "group-hover:text-coral", arrow: "text-coral" },
  indigo: { icon: "bg-indigo-500/10 border-indigo-500/20 text-indigo-500", hover: "hover:border-indigo-500/40", title: "group-hover:text-indigo-500", arrow: "text-indigo-500" },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getDashboardSummary().then(res => setData(res)).catch(e => console.error(e));
  }, []);

  const formatRupee = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
           <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-black text-foreground">Global Navigation Hub</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
             <Database className="w-3 h-3 text-emerald"/> Mock Database Connected. User: <span className="font-bold text-foreground">{data?.user_profile?.name || "Loading..."}</span>
          </p>
        </div>
      </div>

      {/* Hero Dashboard Datastate Map */}
      {data && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           
           <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 shadow-md flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Health Rating</p>
              </div>
              <div>
                 <h3 className="text-5xl font-heading font-black text-foreground">{data.health_summary.score}<span className="text-xl text-muted-foreground">/100</span></h3>
                 <p className="text-sm text-muted-foreground mt-2">Overall Grade: <span className="font-bold text-blue-500">{data.health_summary.grade}</span></p>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/20 shadow-md flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-500" />
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">FIRE Liability</p>
              </div>
              <div>
                 <h3 className="text-5xl font-heading font-black text-foreground">{formatRupee(data.fire_summary.required_sip)}</h3>
                 <p className="text-sm text-muted-foreground mt-2">Required Monthly SIP to reach {formatRupee(data.fire_summary.target_corpus)} target.</p>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-emerald/5 border border-emerald/20 shadow-md flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-emerald" />
                <p className="text-xs font-semibold text-emerald uppercase tracking-wider">Tax Optimizer</p>
              </div>
              <div>
                 <h3 className="text-5xl font-heading font-black text-foreground">{formatRupee(data.tax_summary.savings_generated)}</h3>
                 <p className="text-sm text-muted-foreground mt-2">Saved automatically by utilizing the <span className="font-bold text-emerald">{data.tax_summary.regime.replace(/_/g, " ").toUpperCase()}</span>.</p>
              </div>
           </div>

        </motion.div>
      )}

      {/* Application Module Grids */}
      <div className="space-y-12">
        {moduleGroups.map((group, gi) => {
          const styles = accentStyles[group.accent as keyof typeof accentStyles];
          return (
            <motion.section key={group.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}>
              <div className="flex items-baseline gap-3 mb-5">
                <h2 className="text-xl font-heading font-semibold text-foreground">{group.title}</h2>
                <span className="text-xs font-mono text-muted-foreground hidden sm:inline">// {group.description}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.modules.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.path}
                      onClick={() => navigate(m.path)}
                      className={`group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.hover}`}
                    >
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${styles.icon}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className={`text-base font-heading font-bold mb-2 transition-colors text-foreground ${styles.title}`}>{m.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 h-10">{m.desc}</p>
                      <div className={`flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity ${styles.arrow}`}>
                        Access System <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
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

export default Dashboard;