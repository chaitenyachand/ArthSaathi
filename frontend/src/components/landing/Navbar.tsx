import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ArthSaathi logo" className="w-9 h-9 object-contain" />
          <span className="text-lg font-heading font-bold text-foreground">
            <span className="text-foreground">Arth</span>
            <span className="text-primary">Saathi</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Features</Link>
          <Link to="/#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">How it Works</Link>
          <Link to="/#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">About</Link>
          <Button variant="hero" size="sm" asChild>
            <Link to="/dashboard">Get Started Free</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
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
                <Link to="/dashboard" onClick={() => setOpen(false)}>Get Started Free</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;