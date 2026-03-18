import { scoreColor } from "../utils/constants";

interface ScoreCardProps {
  label:    string;
  score:    number;
  onClick?: () => void;
}

export default function ScoreCard({ label, score, onClick }: ScoreCardProps) {
  const barColor = scoreColor(score);
  const isWeak   = score < 65;

  return (
    <div
      onClick={onClick}
      style={{
        background: isWeak ? `${barColor}0A` : "#fff",
        border:     `1.5px solid ${isWeak ? `${barColor}30` : "#F3F4F6"}`,
        borderRadius: 14,
        padding:    "18px 20px",
        cursor:     onClick ? "pointer" : "default",
        transition: "all .18s",
      }}
    >
      {/* Header row */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 10,
      }}>
        <span style={{
          fontSize: 14, fontWeight: 700, color: "#111827",
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 22, fontWeight: 800, color: barColor,
          fontFamily: "'Space Grotesk', monospace",
          fontVariantNumeric: "tabular-nums",
        }}>
          {score}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 6, background: "#F3F4F6",
        borderRadius: 3, overflow: "hidden", marginBottom: 10,
      }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: barColor,
          width: `${score}%`,
          transition: "width 1s ease",
        }} />
      </div>

      {/* Go to fix */}
      {onClick && (
        <div style={{
          display: "flex", justifyContent: "flex-end",
          alignItems: "center", gap: 3,
        }}>
          <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>
            Go to fix
          </span>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
            stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      )}
    </div>
  );
}