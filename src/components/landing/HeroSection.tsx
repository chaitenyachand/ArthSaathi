import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import financeGrowth from "@/assets/finance-growth.png";

const stats = [
  { value: "14.2 Cr+", label: "Demat Accounts" },
  { value: "95%", label: "Have No Plan" },
  { value: "25K+", label: "Advisor Fee/Yr" },
  { value: "1:177", label: "Advisor Ratio" },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="container relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-emerald" />
              <span className="text-sm font-medium text-primary">AI-Powered Financial Mentor</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 leading-[1.1]"
            >
              <span className="text-foreground">Your AI</span>
              <br />
              <span className="text-gradient-emerald">Money Mentor</span>
              <br />
              <span className="text-gradient-gold">for India</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base md:text-lg text-muted-foreground mb-10 max-w-md"
            >
              A CA, a financial advisor, and a tax consultant — free, in 60 seconds, for every Indian with a smartphone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={() => navigate("/dashboard")}>
                Start Free Analysis
                <ArrowRight className="ml-2" />
              </Button>
              <Button variant="heroOutline" size="lg" className="text-base px-8 py-6" onClick={() => navigate("/dashboard")}>
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-8 border-t border-border"
            >
              <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-xl md:text-2xl font-heading font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — finance growth image + demo card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden">
              <img
                src={financeGrowth}
                alt="Financial growth visualization with coins and greenery"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm font-semibold text-primary">Portfolio X-Ray — Demo</span>
                </div>
                <div className="flex justify-center gap-12 mb-6">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">True XIRR</div>
                    <div className="text-3xl font-heading font-bold text-primary">12.1%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Overlap</div>
                    <div className="text-3xl font-heading font-bold text-coral">73%</div>
                  </div>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end justify-center gap-1.5 h-16 mb-4">
                  {[40, 60, 35, 70, 85, 50, 90, 65, 45, 75, 55, 80].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-sm bg-primary/60"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-3">
                  {["Tax: 36K saved", "FIRE: Age 52", "Direct plan"].map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;