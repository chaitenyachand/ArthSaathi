import { COLORS } from "../utils/constants";

interface BarData {
  label?: string;
  value:  number;
  color?: string;
}

interface MiniBarChartProps {
  data:        BarData[];
  height?:     number;
  showLabels?: boolean;
  highlightLast?: boolean;
}

export default function MiniBarChart({
  data,
  height = 56,
  showLabels = false,
  highlightLast = true,
}: MiniBarChartProps) {
  const max = Math.max(...data.map(d => Math.abs(d.value)), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {data.map((d, i) => {
        const barH    = (Math.abs(d.value) / max) * (height - (showLabels ? 18 : 0));
        const isLast  = i === data.length - 1;
        const color   = d.color
          ? d.color
          : d.value < 0
            ? COLORS.red
            : (highlightLast && isLast)
              ? COLORS.primary
              : `rgba(0,200,150,${0.2 + (i / data.length) * 0.6})`;

        return (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
          >
            <div style={{
              width: "100%", height: barH,
              background: color,
              borderRadius: "3px 3px 0 0",
              minHeight: 3,
              transition: "height .6s ease",
            }} />
            {showLabels && d.label && (
              <span style={{
                fontSize: 9, color: COLORS.muted,
                fontFamily: "'Space Grotesk', monospace",
                whiteSpace: "nowrap",
              }}>
                {d.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}