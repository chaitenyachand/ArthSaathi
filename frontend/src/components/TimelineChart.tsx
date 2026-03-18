import { COLORS } from "../utils/constants";
import { formatINR } from "../utils/formatINR";

interface TimelinePoint {
  year:  number;
  value: number;
  label?: string;   // milestone label e.g. "Child Education"
}

interface TimelineChartProps {
  points:       TimelinePoint[];
  targetCorpus: number;
  currentYear:  number;
  fireYear:     number;
  height?:      number;
}

export default function TimelineChart({
  points,
  targetCorpus,
  currentYear,
  fireYear,
  height = 200,
}: TimelineChartProps) {
  if (points.length < 2) return null;

  const W = 600;
  const H = height;
  const PAD = { t: 20, r: 20, b: 40, l: 60 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const minYear = points[0].year;
  const maxYear = points[points.length - 1].year;
  const maxVal  = Math.max(targetCorpus, ...points.map(p => p.value)) * 1.1;

  const xScale = (year: number) =>
    PAD.l + ((year - minYear) / (maxYear - minYear)) * innerW;

  const yScale = (val: number) =>
    PAD.t + innerH - (val / maxVal) * innerH;

  // Build SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.year).toFixed(1)},${yScale(p.value).toFixed(1)}`)
    .join(" ");

  // Fill path (close to bottom)
  const fillD =
    pathD +
    ` L${xScale(maxYear).toFixed(1)},${(PAD.t + innerH).toFixed(1)}` +
    ` L${xScale(minYear).toFixed(1)},${(PAD.t + innerH).toFixed(1)} Z`;

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    val: maxVal * f,
    y:   yScale(maxVal * f),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
      style={{ display: "block", fontFamily: "'Inter', sans-serif" }}>

      <defs>
        <linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={COLORS.primary} stopOpacity={0.3} />
          <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Y-axis grid */}
      {yTicks.map(tick => (
        <g key={tick.y}>
          <line
            x1={PAD.l} y1={tick.y} x2={W - PAD.r} y2={tick.y}
            stroke={COLORS.border} strokeWidth={0.6} strokeDasharray="4 4"
          />
          <text x={PAD.l - 6} y={tick.y} textAnchor="end" dominantBaseline="middle"
            style={{ fontSize: 9, fill: COLORS.muted }}>
            {formatINR(tick.val)}
          </text>
        </g>
      ))}

      {/* Target line */}
      <line
        x1={PAD.l} y1={yScale(targetCorpus)}
        x2={W - PAD.r} y2={yScale(targetCorpus)}
        stroke={COLORS.accent} strokeWidth={1} strokeDasharray="6 3"
      />
      <text x={W - PAD.r + 3} y={yScale(targetCorpus)} dominantBaseline="middle"
        style={{ fontSize: 9, fill: COLORS.accent }}>
        Target
      </text>

      {/* FIRE year marker */}
      {fireYear >= minYear && fireYear <= maxYear && (
        <line
          x1={xScale(fireYear)} y1={PAD.t}
          x2={xScale(fireYear)} y2={PAD.t + innerH}
          stroke={COLORS.primary} strokeWidth={1} strokeDasharray="4 3"
        />
      )}

      {/* Area fill */}
      <path d={fillD} fill="url(#timelineFill)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke={COLORS.primary} strokeWidth={2} strokeLinejoin="round" />

      {/* Milestone dots */}
      {points
        .filter(p => p.label)
        .map(p => {
          const x = xScale(p.year);
          const y = yScale(p.value);
          return (
            <g key={p.year}>
              <circle cx={x} cy={y} r={5} fill={COLORS.accent} stroke={COLORS.bg} strokeWidth={1.5} />
              <text x={x} y={y - 10} textAnchor="middle"
                style={{ fontSize: 9, fill: COLORS.accent }}>
                {p.label}
              </text>
            </g>
          );
        })}

      {/* X-axis labels */}
      {[minYear, currentYear, fireYear, maxYear]
        .filter((y, i, arr) => arr.indexOf(y) === i)
        .map(year => (
          <text key={year} x={xScale(year)} y={H - 8} textAnchor="middle"
            style={{ fontSize: 9, fill: COLORS.muted }}>
            {year}
          </text>
        ))}
    </svg>
  );
}