import { useState, useEffect, useRef } from "react";
import { procrastinationPerSecond, futureValue } from "../utils/finance";
import { formatINR, formatINRFull } from "../utils/formatINR";
import { COLORS } from "../utils/constants";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5, display: "block" }}>{children}</label>
);
const Inp = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <input type="number" value={value} onChange={e => onChange(+e.target.value)}
    style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.fg, fontFamily: "Inter,sans-serif", fontSize: 14, padding: "11px 14px", width: "100%", outline: "none" }}
    onFocus={e => (e.target.style.borderColor = COLORS.primary)}
    onBlur={e  => (e.target.style.borderColor = COLORS.border)}
  />
);

export default function ProcrastinationClock() {
  const [sip,    setSip]    = useState(5000);
  const [years,  setYears]  = useState(30);
  const [active, setActive] = useState(false);
  const [locked, setLocked] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const t0 = useRef<number>(0);

  const perSec = procrastinationPerSecond(sip, years);
  const fvTotal = futureValue(12, years * 12, sip);

  useEffect(() => {
    if (!active || locked) return;
    const id = setInterval(() => setElapsed((Date.now() - t0.current) / 1000), 100);
    return () => clearInterval(id);
  }, [active, locked]);

  const start = () => {
    t0.current = Date.now();
    setElapsed(0);
    setActive(true);
    setLocked(false);
  };

  const lock = () => setLocked(true);

  const lost = elapsed * perSec;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Unique Feature U4</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>Procrastination Cost Clock</h2>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
          Every second you delay starting your SIP, compounding works against you.
          This clock shows exactly what that delay costs — in real time.
        </p>
      </div>

      {/* Config */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div>
          <Label>Monthly SIP Amount (₹)</Label>
          <Inp value={sip} onChange={v => { setSip(v); setActive(false); }} />
        </div>
        <div>
          <Label>Investment Horizon (years)</Label>
          <Inp value={years} onChange={v => { setYears(v); setActive(false); }} />
        </div>
      </div>

      {/* Target corpus */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24,
      }}>
        {[
          { l: "Target Corpus at " + years + " years",  v: formatINR(fvTotal),        c: COLORS.primary },
          { l: "Wealth Lost Per Second",                 v: formatINR(perSec),         c: COLORS.red     },
          { l: "Wealth Lost Per Day",                    v: formatINR(perSec * 86400), c: COLORS.red     },
          { l: "Wealth Lost Per Year of Delay",          v: formatINR(perSec * 365.25 * 86400), c: COLORS.red },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'Space Grotesk',monospace" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Clock face */}
      <div style={{
        padding: "48px 28px", borderRadius: 16, textAlign: "center",
        background: locked
          ? COLORS.primaryDim
          : active
            ? "rgba(248,113,113,0.07)"
            : COLORS.bgCard,
        border: `1px solid ${locked ? "rgba(0,200,150,0.25)" : active ? "rgba(248,113,113,0.25)" : COLORS.border}`,
        transition: "all .5s",
        position: "relative", overflow: "hidden",
      }}>
        {/* Pulsing bg */}
        {active && !locked && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(248,113,113,0.04)",
            animation: "pulse 2s ease-in-out infinite",
          }} />
        )}

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
            color: locked ? COLORS.primary : active ? COLORS.red : COLORS.muted, marginBottom: 12,
          }}>
            {locked ? "Wealth Locked In" : active ? "Live Procrastination Cost" : "Start the Clock"}
          </div>

          {active || locked ? (
            <>
              <div style={{
                fontSize: "clamp(56px,9vw,96px)", fontWeight: 900, lineHeight: 1,
                fontFamily: "'Space Grotesk',monospace", fontVariantNumeric: "tabular-nums",
                color: locked ? COLORS.primary : COLORS.accent,
              }}>
                {locked ? formatINR(fvTotal) : formatINR(lost)}
              </div>
              <p style={{ fontSize: 15, color: COLORS.muted, margin: "14px 0 0" }}>
                {locked
                  ? `You locked in ${formatINR(fvTotal)} in retirement wealth today.`
                  : `in potential wealth lost by not starting a ${formatINRFull(sip)}/month SIP`}
              </p>
              {!locked && (
                <p style={{ fontSize: 12, color: COLORS.dim, marginTop: 6 }}>
                  At 12% CAGR over {years} years — {formatINR(perSec)}/second is erased
                </p>
              )}
            </>
          ) : (
            <div style={{ fontSize: 72, fontWeight: 900, color: COLORS.muted, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>
              0.00
            </div>
          )}

          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {!active && !locked && (
              <button onClick={start} style={{
                padding: "13px 32px", borderRadius: 10, border: "none",
                background: COLORS.primary, color: "#000",
                fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}>
                Start Clock
              </button>
            )}
            {active && !locked && (
              <button onClick={lock} style={{
                padding: "13px 32px", borderRadius: 10, border: "none",
                background: COLORS.primary, color: "#000",
                fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}>
                Set Up My SIP Now
              </button>
            )}
            {locked && (
              <button onClick={() => { setActive(false); setLocked(false); setElapsed(0); }} style={{
                padding: "11px 24px", borderRadius: 10,
                border: `1px solid ${COLORS.border}`, background: "transparent",
                color: COLORS.muted, fontFamily: "Inter,sans-serif", fontSize: 14, cursor: "pointer",
              }}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}