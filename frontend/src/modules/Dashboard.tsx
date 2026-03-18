import { ALL_MODULES, COLORS, DIM_META, scoreColor, type ScoreMap, type ModuleId } from "../utils/constants";

// ─── MODULE ICON COLORS ───────────────────────────────────────────────────────
const MODULE_COLORS: Record<string, { bg: string; color: string }> = {
  score:      { bg: "rgba(139,92,246,0.15)",  color: "#8B5CF6" },
  xray:       { bg: "rgba(0,200,150,0.12)",   color: "#00C896" },
  tax:        { bg: "rgba(245,166,35,0.15)",  color: "#F5A623" },
  fire:       { bg: "rgba(248,113,113,0.12)", color: "#F87171" },
  life:       { bg: "rgba(245,166,35,0.15)",  color: "#F5A623" },
  couples:    { bg: "rgba(0,200,150,0.12)",   color: "#00C896" },
  badadvice:  { bg: "rgba(248,113,113,0.12)", color: "#F87171" },
  bias:       { bg: "rgba(139,92,246,0.15)",  color: "#8B5CF6" },
  tip:        { bg: "rgba(0,200,150,0.12)",   color: "#00C896" },
  clock:      { bg: "rgba(248,113,113,0.12)", color: "#F87171" },
  mirror:     { bg: "rgba(139,92,246,0.15)",  color: "#8B5CF6" },
  translator: { bg: "rgba(245,166,35,0.15)",  color: "#F5A623" },
};

// ─── MODULE ICONS (SVG paths) ─────────────────────────────────────────────────
const MODULE_ICONS: Record<string, string | string[]> = {
  score:      ["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z", "M3.22 12H9.5l1.5-3 2 4.5 1.5-3H20.78"],
  xray:       ["M3 7V5a2 2 0 0 1 2-2h2","M17 3h2a2 2 0 0 1 2 2v2","M21 17v2a2 2 0 0 1-2 2h-2","M7 21H5a2 2 0 0 1-2-2v-2","M7 12h10","M12 7v10"],
  tax:        ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  fire:       "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z",
  life:       ["M3 9h18","M8 2v4","M16 2v4","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"],
  couples:    ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"],
  badadvice:  ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"],
  bias:       ["M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.6A3 3 0 0 1 4 11c0-1.38.93-2.54 2.2-2.9A2.5 2.5 0 0 1 9.5 2z","M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.6A3 3 0 0 0 20 11c0-1.38-.93-2.54-2.2-2.9A2.5 2.5 0 0 0 14.5 2z"],
  tip:        ["M7.9 20A9 9 0 1 0 4 16.1L2 22Z","M12 8v4","M12 16h.01"],
  clock:      ["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"],
  mirror:     ["M12 3v18","M3 9l4-4 4 4","M17 15l4 4-4 4","M3 9h8","M13 15h8"],
  translator: ["M21 12V7H5a2 2 0 0 1 0-4h14v4","M3 5v14a2 2 0 0 0 2 2h16v-5","M18 12a2 2 0 0 0 0 4h4v-4Z"],
};

const SvgIcon = ({ id, size = 22 }: { id: string; size?: number }) => {
  const d = MODULE_ICONS[id] ?? MODULE_ICONS.score;
  const color = MODULE_COLORS[id]?.color ?? COLORS.primary;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block" }}>
      {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
};

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface DashboardProps {
  onNavigate:   (id: ModuleId) => void;
  healthScore?: number;
  scores?:      ScoreMap;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Dashboard({ onNavigate, healthScore, scores }: DashboardProps) {
  const coreModules   = ALL_MODULES.filter(m => m.group === "core");
  const uniqueModules = ALL_MODULES.filter(m => m.group === "unique");

  return (
    <div>
      {/* Welcome header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>
          Welcome to ArthSaathi
        </h1>
        <p style={{ fontSize: 15, color: COLORS.muted }}>
          Your AI-powered personal finance mentor. Choose a module to begin.
        </p>
      </div>

      {/* Health score summary (if taken) */}
      {healthScore !== undefined && scores && (
        <div style={{
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
          borderRadius: 16, padding: 24, marginBottom: 28,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
                Your Money Health Score
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif",
                color: healthScore < 40 ? COLORS.red : healthScore < 65 ? COLORS.accent : COLORS.primary }}>
                {healthScore} <span style={{ fontSize: 16, color: COLORS.muted, fontWeight: 400 }}>/100</span>
              </div>
            </div>
            <button onClick={() => onNavigate("score")} style={{
              padding: "9px 18px", borderRadius: 9, border: `1px solid ${COLORS.border}`,
              background: "transparent", color: COLORS.muted, fontSize: 13,
              cursor: "pointer", fontFamily: "Inter,sans-serif", fontWeight: 500,
            }}>
              View Full Report
            </button>
          </div>

          {/* Mini dimension bars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {Object.entries(scores).map(([dim, val]) => {
              const color = scoreColor(val);
              return (
                <div key={dim} onClick={() => onNavigate(DIM_META[dim as keyof typeof DIM_META].module as ModuleId)}
                  style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>{DIM_META[dim as keyof typeof DIM_META].label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'Space Grotesk',monospace" }}>{val}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: color, borderRadius: 2, width: `${val}%`, transition: "width .8s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Core modules */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
          Core Modules
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
          {coreModules.map(m => {
            const mc = MODULE_COLORS[m.id];
            const isStart = m.id === "score" && !healthScore;
            return (
              <div key={m.id} onClick={() => onNavigate(m.id as ModuleId)}
                style={{
                  background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                  borderRadius: 16, padding: 22, cursor: "pointer",
                  transition: "all .2s", position: "relative",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = mc?.color + "50";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {isStart && (
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    background: COLORS.accent, color: "#000",
                    fontSize: 9, fontWeight: 800, padding: "2px 8px",
                    borderRadius: 20, letterSpacing: ".06em", textTransform: "uppercase",
                  }}>
                    START HERE
                  </div>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: mc?.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 14,
                }}>
                  <SvgIcon id={m.id} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5, color: COLORS.fg }}>{m.label}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.55 }}>{m.sub}</div>

                {/* Tag */}
                <div style={{ marginTop: 14 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: COLORS.primaryDim, color: COLORS.primary,
                    border: `1px solid rgba(0,200,150,0.2)`, letterSpacing: ".06em", textTransform: "uppercase",
                  }}>
                    {m.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unique modules */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
          Unique Features — Found Nowhere Else in India
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {uniqueModules.map(m => {
            const mc = MODULE_COLORS[m.id];
            return (
              <div key={m.id} onClick={() => onNavigate(m.id as ModuleId)}
                style={{
                  background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                  borderRadius: 16, padding: 22, cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = mc?.color + "50";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: mc?.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 14,
                }}>
                  <SvgIcon id={m.id} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5, color: COLORS.fg }}>{m.label}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.55 }}>{m.sub}</div>
                <div style={{ marginTop: 14 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: COLORS.accentDim, color: COLORS.accent,
                    border: `1px solid rgba(245,166,35,0.2)`, letterSpacing: ".06em", textTransform: "uppercase",
                  }}>
                    {m.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}