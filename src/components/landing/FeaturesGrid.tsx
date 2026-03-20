import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, FileText, Target, Heart, CalendarDays, Users,
  AlertTriangle, Brain, MessageCircle, Clock, Eye, Wallet, TrendingUp
} from "lucide-react";

const coreFeatures = [
  { icon: Search, title: "MF Portfolio X-Ray", description: "Upload CAMS statement → true XIRR, overlap, hidden fees & rebalancing plan in 10 seconds.", path: "/portfolio-xray" },
  { icon: FileText, title: "Tax Wizard", description: "Upload Form 16 → old vs new regime comparison + every deduction you're missing.", path: "/tax-wizard" },
  { icon: Target, title: "FIRE Path Planner", description: "Enter life goals → month-by-month roadmap to financial independence with exact SIP amounts.", path: "/fire-planner" },
  { icon: Heart, title: "Money Health Score", description: "5-minute quiz → score across 6 financial dimensions. Every weak score links to its fix.", path: "/health-score" },
  { icon: CalendarDays, title: "Life Event Advisor", description: "Enter a life event → ranked, personalised action plan with exact rupee amounts.", path: "/life-event" },
  { icon: Users, title: "Couple's Money Planner", description: "Both partners enter data → joint optimisation of HRA, NPS, LTCG, and net worth.", path: "/couples-planner" },
];

const uniqueFeatures = [
  { icon: AlertTriangle, title: "Cost of Bad Advice Detector", description: "Exact rupees your agent earned from your portfolio.", path: "/bad-advice" },
  { icon: Brain, title: "Behavioral Bias Fingerprint", description: "Your dominant bias → every output adapts to your psychology.", path: "/bias-fingerprint" },
  { icon: MessageCircle, title: "WhatsApp Tip Analyzer", description: "Paste any tip → A-to-F grade with red-flag analysis.", path: "/tip-analyzer" },
  { icon: Clock, title: "Procrastination Cost Clock", description: "Live counter showing wealth lost every second you delay.", path: "/procrastination-clock" },
  { icon: Eye, title: "The Mirror", description: "Your answers vs actual CAMS behaviour — reality check.", path: "/the-mirror" },
  { icon: Wallet, title: "Salary-to-Wealth Translator", description: "Any rupee amount → its 30-year retirement corpus equivalent.", path: "/salary-translator" },
];

const FeaturesGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-background relative">
      <div className="container">
        {/* Scrolling ticker */}
        <div className="overflow-hidden mb-20 -mx-8 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap"
          >
            {["Save 40K+ in taxes", "Detect hidden fees", "60-second financial plan", "Behavioral bias detection", "WhatsApp tip analysis", "FIRE date calculator", "The Mirror — stated vs actual", "Save 40K+ in taxes", "Detect hidden fees", "60-second financial plan", "Behavioral bias detection", "WhatsApp tip analysis"].map((text, i) => (
              <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Core modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Core Modules</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Six Powerful <span className="text-gradient-emerald">AI Modules</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each module is a fully working product solving a specific financial problem for Indian retail investors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {coreFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(feature.path)}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Unique features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-3 block">What Sets Us Apart</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Features <span className="text-gradient-gold">Found Nowhere Else</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {uniqueFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(feature.path)}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 text-gold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-heading font-semibold mb-2 group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
