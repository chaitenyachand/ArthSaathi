import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search, FileText, Target, Heart, CalendarDays, Users,
  AlertTriangle, Brain, MessageCircle, Clock, Eye, Wallet,
  LayoutDashboard, ArrowLeft, ChevronDown, PanelLeftClose, PanelLeft, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ],
  },
  {
    label: "Core Planning",
    items: [
      { icon: Heart, label: "Health Score", path: "/health-score" },
      { icon: Target, label: "FIRE Planner", path: "/fire-planner" },
      { icon: FileText, label: "Tax Wizard", path: "/tax-wizard" },
    ],
  },
  {
    label: "Portfolio & Analysis",
    items: [
      { icon: Search, label: "Portfolio X-Ray", path: "/portfolio-xray" },
      { icon: AlertTriangle, label: "Bad Advice Detector", path: "/bad-advice" },
      { icon: MessageCircle, label: "Tip Analyzer", path: "/tip-analyzer" },
    ],
  },
  {
    label: "Life & Relationships",
    items: [
      { icon: CalendarDays, label: "Life Event Advisor", path: "/life-event" },
      { icon: Users, label: "Couple's Planner", path: "/couples-planner" },
      { icon: Wallet, label: "Salary Translator", path: "/salary-translator" },
    ],
  },
  {
    label: "Behavioral Insights",
    items: [
      { icon: Brain, label: "Bias Fingerprint", path: "/bias-fingerprint" },
      { icon: Eye, label: "The Mirror", path: "/the-mirror" },
      { icon: Clock, label: "Cost Clock", path: "/procrastination-clock" },
    ],
  },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      navGroups.forEach((g) => { initial[g.label] = true; });
      return initial;
    }
  );

  const toggleGroup = (label: string) => {
    if (collapsed) return;
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNav = (isMobile?: boolean) => (
    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
      {navGroups.map((group) => {
        const isExpanded = expandedGroups[group.label];
        const hasActive = group.items.some((item) => isActive(item.path));

        return (
          <div key={group.label}>
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-widest transition-colors",
                  hasActive ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                )}
              >
                <span>{group.label}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", !isExpanded && "-rotate-90")} />
              </button>
            )}

            {collapsed && <div className="mx-auto my-2 w-6 border-t border-border/40" />}

            <AnimatePresence initial={false}>
              {(collapsed || isExpanded) && (
                <motion.div
                  initial={collapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className={cn("space-y-0.5", !collapsed && "ml-1 pl-2 border-l border-border/30")}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={isMobile ? () => setMobileOpen(false) : undefined}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                            collapsed && "justify-center px-2",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          )}
                          title={collapsed ? item.label : undefined}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card/90 backdrop-blur-sm fixed top-0 left-0 h-full z-40 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <img src={logo} alt="ArthSaathi" className="w-8 h-8 shrink-0 object-contain" />
            {!collapsed && (
              <span className="text-lg font-heading font-bold text-foreground whitespace-nowrap">ArthSaathi</span>
            )}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground transition-colors">
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {renderNav()}

        <div className="p-4 border-t border-border">
          <Link to="/" className={cn("flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors", collapsed && "justify-center")}>
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Back to Home</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ArthSaathi" className="w-7 h-7 object-contain" />
            <span className="text-base font-heading font-bold text-foreground">ArthSaathi</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground hover:text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="lg:hidden fixed top-14 left-0 bottom-0 z-50 w-72 bg-card border-r border-border flex flex-col">
              {renderNav(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className={cn("flex-1 pt-14 lg:pt-0 transition-all duration-300", collapsed ? "lg:ml-[68px]" : "lg:ml-64")}>
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;