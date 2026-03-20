import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLanding ? "bg-transparent" : "glass border-b border-border"
    }`}>
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <span className="text-sm font-heading font-bold text-accent-foreground">A</span>
          </div>
          <span className={`text-lg font-heading font-bold ${isLanding ? "text-gold" : "text-foreground"}`}>
            ArthSaathi
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-gold-light ${
            isLanding ? "text-gold" : "text-muted-foreground hover:text-gold"
          }`}>
            Dashboard
          </Link>
          <Link to="/health-score" className={`text-sm font-medium transition-colors hover:text-gold-light ${
            isLanding ? "text-gold" : "text-muted-foreground hover:text-gold"
          }`}>
            Health Score
          </Link>
          <Link to="/portfolio-xray" className={`text-sm font-medium transition-colors hover:text-gold-light ${
            isLanding ? "text-gold" : "text-muted-foreground hover:text-gold"
          }`}>
            Portfolio X-Ray
          </Link>
          <Button variant="hero" size="sm" asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>

        <button
          className={`md:hidden ${isLanding ? "text-gold" : "text-foreground"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-border overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-3">
              <Link to="/dashboard" className="text-sm font-medium text-foreground py-2" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/health-score" className="text-sm font-medium text-foreground py-2" onClick={() => setOpen(false)}>Health Score</Link>
              <Link to="/portfolio-xray" className="text-sm font-medium text-foreground py-2" onClick={() => setOpen(false)}>Portfolio X-Ray</Link>
              <Button variant="hero" size="sm" asChild>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;