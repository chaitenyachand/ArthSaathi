import { useState } from "react";
import type { ModuleId } from "../utils/constants";
import { ALL_MODULES, COLORS } from "../utils/constants";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Ic = ({
  d, size = 18, color = "currentColor", sw = 2,
}: { d: string | string[]; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, display: "block" }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS: Record<string, JSX.Element> = {
  dashboard:   <Ic d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} />,
  score:       <Ic d={["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z","M3.22 12H9.5l1.5-3 2 4.5 1.5-3H20.78"]} />,
  xray:        <Ic d={["M3 7V5a2 2 0 0 1 2-2h2","M17 3h2a2 2 0 0 1 2 2v2","M21 17v2a2 2 0 0 1-2 2h-2","M7 21H5a2 2 0 0 1-2-2v-2","M7 12h10","M12 7v10"]} />,
  tax:         <Ic d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />,
  fire:        <Ic d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />,
  life:        <Ic d={["M3 9h18","M8 2v4","M16 2v4","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"]} />,
  couples:     <Ic d={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]} />,
  badadvice:   <Ic d={["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]} />,
  bias:        <Ic d={["M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.6A3 3 0 0 1 4 11c0-1.38.93-2.54 2.2-2.9A2.5 2.5 0 0 1 9.5 2z","M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.6A3 3 0 0 0 20 11c0-1.38-.93-2.54-2.2-2.9A2.5 2.5 0 0 0 14.5 2z"]} />,
  tip:         <Ic d={["M7.9 20A9 9 0 1 0 4 16.1L2 22Z","M12 8v4","M12 16h.01"]} />,
  clock:       <Ic d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"]} />,
  mirror:      <Ic d={["M12 3v18","M3 9l4-4 4 4","M17 15l4 4-4 4","M3 9h8","M13 15h8"]} />,
  translator:  <Ic d={["M21 12V7H5a2 2 0 0 1 0-4h14v4","M3 5v14a2 2 0 0 0 2 2h16v-5","M18 12a2 2 0 0 0 0 4h4v-4Z"]} />,
};

// ─── SIDEBAR ITEMS ────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS: { id: ModuleId | "dashboard"; label: string }[] = [
  { id: "dashboard",  label: "Dashboard"     },
  { id: "score",      label: "Health Score"  },
  { id: "xray",       label: "Portfolio X-Ray" },
  { id: "tax",        label: "Tax Wizard"    },
  { id: "fire",       label: "FIRE Planner"  },
  { id: "life",       label: "Life Event"    },
  { id: "couples",    label: "Couple's Planner" },
  { id: "badadvice",  label: "Bad Advice"    },
  { id: "bias",       label: "Bias Fingerprint" },
  { id: "tip",        label: "Tip Analyzer"  },
  { id: "clock",      label: "Cost Clock"    },
  { id: "mirror",     label: "The Mirror"    },
  { id: "translator", label: "Salary Translator" },
];

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface LayoutProps {
  activeModule: ModuleId | "dashboard";
  onNavigate:   (id: ModuleId | "dashboard") => void;
  onBackHome?:  () => void;
  children:     React.ReactNode;
  healthScore?: number;
}

export default function Layout({
  activeModule, onNavigate, onBackHome, children, healthScore,
}: LayoutProps) {
  const current = ALL_MODULES.find(m => m.id === activeModule);

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: COLORS.bg, fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "rgba(14,14,14,0.95)",
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 18px 16px",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: "linear-gradient(135deg,#00C896,#008F6A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#000",
            fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0,
          }}>
            A
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 17, fontWeight: 700, color: COLORS.fg,
          }}>
            ArthSaathi
          </span>
        </div>

        {/* Health score pill */}
        {healthScore !== undefined && (
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{
              background: COLORS.accentDim, border: `1px solid rgba(245,166,35,0.25)`,
              borderRadius: 10, padding: "10px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>Health Score</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20, fontWeight: 800, color: COLORS.accent,
              }}>
                {healthScore}
              </span>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "10px 10px" }}>
          {SIDEBAR_ITEMS.map(item => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ModuleId | "dashboard")}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "9px 12px", borderRadius: 9,
                  border: "none", cursor: "pointer", textAlign: "left",
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                  background: isActive ? "rgba(245,166,35,0.12)" : "transparent",
                  color: isActive ? COLORS.accent : COLORS.muted,
                  transition: "all .15s",
                }}
              >
                <span style={{ color: isActive ? COLORS.accent : COLORS.muted }}>
                  {ICONS[item.id] ?? ICONS["dashboard"]}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Back to home */}
        {onBackHome && (
          <div style={{ padding: "12px 10px", borderTop: `1px solid ${COLORS.border}` }}>
            <button
              onClick={onBackHome}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "9px 12px", borderRadius: 9,
                border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: 13, color: COLORS.muted,
                background: "transparent", transition: "color .15s",
              }}
            >
              <Ic d="M19 12H5M12 19l-7-7 7-7" size={14} color={COLORS.muted} />
              Back to Home
            </button>
          </div>
        )}
      </aside>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{
          height: 60, display: "flex", alignItems: "center",
          padding: "0 32px", borderBottom: `1px solid ${COLORS.border}`,
          background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 50,
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.fg }}>
              {activeModule === "dashboard" ? "Dashboard" : current?.label ?? ""}
            </span>
            {current && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                background: current.group === "core" ? COLORS.primaryDim : COLORS.accentDim,
                color: current.group === "core" ? COLORS.primary : COLORS.accent,
                border: `1px solid ${current.group === "core" ? "rgba(0,200,150,0.25)" : "rgba(245,166,35,0.25)"}`,
                letterSpacing: ".06em", textTransform: "uppercase" as const,
              }}>
                {current.tag}
              </span>
            )}
          </div>
          <span style={{
            fontSize: 11, color: COLORS.dim,
            fontFamily: "'Space Grotesk', monospace",
          }}>
            ET AI Hackathon 2026
          </span>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1, overflowY: "auto",
          padding: "36px 32px",
          maxWidth: 1100, width: "100%", margin: "0 auto",
          boxSizing: "border-box" as const,
        }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          padding: "14px 32px", borderTop: `1px solid ${COLORS.border}`,
          fontSize: 11, color: COLORS.dim, textAlign: "center" as const,
        }}>
          ArthSaathi is an educational tool and is not SEBI-registered investment advice.
          Always consult a qualified financial advisor before making investment decisions.
        </footer>
      </div>
    </div>
  );
}