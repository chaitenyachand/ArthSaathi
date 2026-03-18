import { COLORS } from "../utils/constants";

interface RadarChartProps {
  scores: number[];                // 6 values, 0–100
  labels: string[];                // 6 labels
  size?:  number;                  // SVG width/height
  theme?: "light" | "dark";        // light = quiz results, dark = dashboard
}

export default function RadarChart({
  scores,
  labels,
  size = 300,
  theme = "light",
}: RadarChartProps) {
  const N   = scores.length;
  const cx  = size / 2;
  const cy  = size / 2;
  const r   = size * 0.34;      // ring radius
  const lr  = size * 0.45;      // label radius

  const angle = (i: number) => (i * 2 * Math.PI) / N - Math.PI / 2;

  const pt = (val: number, i: number): [number, number] => [
    cx + (val / 100) * r * Math.cos(angle(i)),
    cy + (val / 100) * r * Math.sin(angle(i)),
  ];

  const labelPt = (i: number): [number, number] => [
    cx + lr * Math.cos(angle(i)),
    cy + lr * Math.sin(angle(i)),
  ];

  const gridColor  = theme === "light" ? "#E5E7EB" : COLORS.border;
  const labelColor = theme === "light" ? "#9CA3AF" : COLORS.muted;
  const fillColor  = theme === "light" ? "rgba(245,166,35,0.18)" : "rgba(0,200,150,0.12)";
  const strokeClr  = theme === "light" ? "#F5A623" : COLORS.primary;
  const dotFill    = theme === "light" ? "#F5A623" : COLORS.primary;

  const gridLevels = [20, 40, 60, 80, 100];

  const polyPoints = (level: number) =>
    scores.map((_, i) => pt(level, i).join(",")).join(" ");

  const fillPoints = scores.map((s, i) => pt(s, i).join(",")).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      style={{ maxWidth: size, display: "block", margin: "0 auto" }}
    >
      {/* Grid rings */}
      {gridLevels.map(g => (
        <polygon
          key={g}
          points={polyPoints(g)}
          fill="none"
          stroke={gridColor}
          strokeWidth={g === 100 ? 1 : 0.6}
        />
      ))}

      {/* Axis spokes */}
      {scores.map((_, i) => {
        const [x2, y2] = pt(100, i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={x2} y2={y2}
            stroke={gridColor}
            strokeWidth={0.6}
          />
        );
      })}

      {/* Filled area */}
      <polygon
        points={fillPoints}
        fill={fillColor}
        stroke={strokeClr}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Score dots */}
      {scores.map((s, i) => {
        const [x, y] = pt(s, i);
        return (
          <circle
            key={i}
            cx={x} cy={y} r={4.5}
            fill={dotFill}
            stroke={theme === "light" ? "#fff" : COLORS.bg}
            strokeWidth={1.5}
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, i) => {
        const [x, y] = labelPt(i);
        return (
          <text
            key={i}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: size * 0.038,
              fontFamily: "'Inter', sans-serif",
              fill: labelColor,
            }}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}