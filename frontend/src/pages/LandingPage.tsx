import { useState, useEffect, useRef } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const LS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0A0A0A; color: #F0F0F0; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    .sg  { font-family: 'Space Grotesk', sans-serif; }
    .gp  { background: linear-gradient(135deg,#00C896,#00A878); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .ga  { background: linear-gradient(135deg,#F5A623,#E8891A); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes goldPulse { 0%,100%{opacity:1} 50%{opacity:.75} }
    .lnav { position:sticky;top:0;z-index:100;background:rgba(10,10,10,0.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.08); }
    .lnav-inner { max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:64px; }
    .lnav-logo { display:flex;align-items:center;gap:10px; }
    .lnav-links { display:flex;gap:36px; }
    .lnav-link { color:#6B7280;font-size:14px;font-weight:500;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;transition:color .18s; }
    .lnav-link:hover { color:#F0F0F0; }
    .lbtn-g { background:#00C896;color:#000;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;padding:10px 20px;border-radius:10px;border:none;cursor:pointer;transition:all .18s; }
    .lbtn-g:hover { background:#00DDA8;transform:translateY(-1px); }
    .lbtn-g-lg { background:#00C896;color:#000;font-family:'Inter',sans-serif;font-size:16px;font-weight:700;padding:15px 34px;border-radius:12px;border:none;cursor:pointer;transition:all .18s;display:inline-flex;align-items:center;gap:8px; }
    .lbtn-g-lg:hover { background:#00DDA8;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,200,150,0.25); }
    .lbtn-outline { background:transparent;color:#F0F0F0;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;padding:14px 28px;border-radius:12px;border:1px solid #333;cursor:pointer;transition:all .18s; }
    .lbtn-outline:hover { border-color:#555; }
    .lticker-bar { background:#111;border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);padding:11px 0;overflow:hidden;white-space:nowrap; }
    .lticker-track { display:inline-flex;animation:ticker 30s linear infinite; }
    .lticker-item { display:inline-flex;align-items:center;gap:7px;padding:0 32px;font-size:13px;font-weight:500;color:#6B7280; }
    .lwrap { max-width:1200px;margin:0 auto;padding:0 24px; }
    .lcard { background:rgba(20,20,20,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;transition:border-color .22s; }
    .lcard:hover { border-color:rgba(255,255,255,0.18); }
    .lcard-icon { width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:18px; }
    .lig { background:rgba(0,200,150,0.1); }
    .lia { background:rgba(245,166,35,0.1); }
    .luniq { display:flex;align-items:flex-start;gap:14px;padding:18px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07); }
    .lg3  { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
    .lstep-box { width:88px;height:88px;border-radius:20px;background:#141414;border:1px solid rgba(0,200,150,0.35);display:flex;align-items:center;justify-content:center;margin:0 auto 22px; }
    .lproc { background:#0D0D0D;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:56px 40px;text-align:center; }
    .lfooter { border-top:1px solid rgba(255,255,255,0.08);padding:28px 24px;display:flex;align-items:center;justify-content:space-between; }
    @media(max-width:768px){ .lg3{grid-template-columns:1fr} .lnav-links{display:none} .lwrap{padding:0 16px} .hero-grid{grid-template-columns:1fr !important} .hero-right{display:none !important} }
  `}</style>
);

// ─── ICON ─────────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 18, color = "currentColor" }: { d: string | string[]; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function Counter({ end, dec = 0, suffix = "", prefix = "" }: { end: number; dec?: number; suffix?: string; prefix?: string }) {
  const [v, setV] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const t0 = performance.now();
    const run = (now: number) => {
      const p = Math.min((now - t0) / 1800, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(parseFloat((e * end).toFixed(dec)));
      if (p < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [end, dec]);
  return <>{prefix}{dec ? v.toFixed(dec) : v.toLocaleString("en-IN")}{suffix}</>;
}

// ─── PROCRASTINATION CLOCK ────────────────────────────────────────────────────
const SIP   = 5000;
const YEARS = 30;
const FV_T  = SIP * ((Math.pow(1 + 0.12 / 12, YEARS * 12) - 1) / (0.12 / 12)) * (1 + 0.12 / 12);
const PPS   = FV_T / (YEARS * 365.25 * 24 * 3600);

function ProcClock({ onEnter }: { onEnter: () => void }) {
  const [secs, setSecs] = useState(0);
  const t0 = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => setSecs((Date.now() - t0.current) / 1000), 100);
    return () => clearInterval(id);
  }, []);
  const lost = Math.floor(secs * PPS);
  return (
    <div className="lproc">
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#00C896", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
        <Ic d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"]} size={14} color="#00C896" />
        Live Procrastination Cost Clock
      </div>
      <h2 className="sg" style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, marginBottom: 28, lineHeight: 1.2 }}>
        While you've been on this page...
      </h2>
      <div className="sg" style={{ fontSize: "clamp(60px,9vw,104px)", fontWeight: 900, color: "#F5A623", lineHeight: 1, fontVariantNumeric: "tabular-nums", animation: "goldPulse 2s ease-in-out infinite" }}>
        ₹{lost.toLocaleString("en-IN")}
      </div>
      <p style={{ fontSize: 16, color: "#6B7280", margin: "18px 0 8px" }}>
        in potential wealth has been lost by not starting a ₹5,000/month SIP
      </p>
      <p style={{ fontSize: 13, color: "#374151", marginBottom: 36 }}>
        At 12% CAGR over 30 years, even ₹{PPS.toFixed(1)}/second adds up.
      </p>
      <button className="lbtn-g-lg" onClick={onEnter}>Stop Losing Money — Start Now</button>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CORE = [
  { a: "lig", t: "MF Portfolio X-Ray",    d: "Upload CAMS statement → true XIRR, overlap, hidden fees & rebalancing plan in 10 seconds." },
  { a: "lia", t: "Tax Wizard",            d: "Upload Form 16 → old vs new regime comparison + every deduction you're missing." },
  { a: "lig", t: "FIRE Path Planner",     d: "Enter life goals → month-by-month roadmap to financial independence with exact SIP amounts." },
  { a: "lia", t: "Money Health Score",    d: "5-minute quiz → score across 6 financial dimensions with navigation to fixes." },
  { a: "lig", t: "Life Event Advisor",    d: "Enter a life event → ranked, personalised action plan in exact rupee amounts." },
  { a: "lia", t: "Couple's Money Planner",d: "Both partners enter data → joint optimisation of HRA, NPS, SIP, and insurance." },
];
const UNIQUE = [
  { t: "Cost of Bad Advice Detector",   d: "Exact rupees your agent earned from your portfolio." },
  { t: "Behavioral Bias Fingerprint",   d: "Your dominant bias → every output adapts to your psychology." },
  { t: "WhatsApp Tip Analyzer",         d: "Paste any tip → A-to-F grade with red-flag analysis." },
  { t: "Procrastination Cost Clock",    d: "Live counter showing wealth lost every second you delay." },
  { t: "The Mirror",                    d: "Your answers vs actual CAMS behaviour — reality check." },
  { t: "Salary-to-Wealth Translator",   d: "Any rupee amount → its 30-year retirement corpus equivalent." },
];
const TICKERS = ["True XIRR in 10 seconds","Save ₹40K+ in taxes","Detect hidden fees","60-second financial plan","Behavioral bias detection","WhatsApp tip analysis","FIRE date calculator","The Mirror — stated vs actual"];
const STEPS = [
  { n:"01", title:"Upload Your Data",       desc:"Upload your CAMS statement, Form 16, or simply answer a quick questionnaire. Your data stays private and secure.", icon:["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"] },
  { n:"02", title:"AI Analyses Everything", desc:"Our multi-agent AI system powered by real financial mathematics and Indian tax law processes your data in seconds.", icon:["M9 3H5a2 2 0 0 0-2 2v4","M9 21H5a2 2 0 0 1-2-2v-4","M15 3h4a2 2 0 0 1 2 2v4","M15 21h4a2 2 0 0 0 2-2v-4","M9 9h6v6H9z"] },
  { n:"03", title:"Get Actionable Insights", desc:"Receive your personalised financial blueprint — exact numbers, specific recommendations, and a clear roadmap.", icon:["M3 3v18h18","M18 17V9","M13 17V5","M8 17v-3"] },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <LS />

      {/* NAV */}
      <nav className="lnav">
        <div className="lnav-inner">
          <div className="lnav-logo">
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#00C896,#008F6A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#000", fontFamily: "'Space Grotesk',sans-serif", flexShrink: 0 }}>A</div>
            <span className="sg" style={{ fontSize: 18, fontWeight: 800 }}>Arth<span className="gp">Saathi</span></span>
          </div>
          <div className="lnav-links">
            {["Features", "How it Works", "About"].map(l => <button key={l} className="lnav-link">{l}</button>)}
          </div>
          <button className="lbtn-g" onClick={onEnter}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="lwrap">
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "center", padding: "80px 0 64px", position: "relative" }}>
          {/* Faint ₹ watermark */}
          <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {[15,33,51,69,87].map((l, i) => (
              <div key={i} style={{ position: "absolute", fontSize: 180, fontWeight: 900, color: "#00C896", opacity: .025, left: `${l}%`, top: i % 2 === 0 ? "-10%" : "20%", transform: "rotate(-12deg)", lineHeight: 1, userSelect: "none" }}>₹</div>
            ))}
          </div>

          <div style={{ position: "relative" }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "7px 16px", marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00C896", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#6B7280" }}>AI-Powered Financial Mentor</span>
            </div>

            <h1 className="sg" style={{ fontSize: "clamp(44px,5.5vw,72px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 22 }}>
              Your AI<br />
              <span className="gp">Money Mentor</span><br />
              <span className="ga">for India</span>
            </h1>

            <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.72, marginBottom: 36, maxWidth: 480 }}>
              A CA, a financial advisor, and a tax consultant — free, in 60 seconds, for every Indian with a smartphone.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="lbtn-g-lg" onClick={onEnter}>Start Free Analysis →</button>
              <button className="lbtn-outline">Watch Demo</button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { e: 14.2, d: 1, s: " Cr+", l: "Demat Accounts" },
                { e: 95,   d: 0, s: "%",    l: "Have No Plan"   },
                { e: 25,   d: 0, p: "₹", s: "K+", l: "Advisor Fee/Yr" },
                { e: 177,  d: 0, p: "1:", l: "Advisor Ratio"  },
              ].map(st => (
                <div key={st.l}>
                  <div className="sg" style={{ fontSize: "clamp(22px,2.5vw,34px)", fontWeight: 900, lineHeight: 1.1 }}>
                    <Counter end={st.e} dec={st.d} suffix={st.s ?? ""} prefix={st.p ?? ""} />
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{st.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero-right" style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: "#0E1A14", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 18, minHeight: 340 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#00C896", marginBottom: 10 }}>Portfolio X-Ray — Demo</div>
              <div style={{ display: "flex", justifyContent: "space-around", gap: 28, marginBottom: 18 }}>
                {[{ l:"True XIRR", v:"12.1%", c:"#00C896" },{ l:"Overlap", v:"73%", c:"#F87171" }].map(x => (
                  <div key={x.l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{x.l}</div>
                    <div className="sg" style={{ fontSize: 32, fontWeight: 900, color: x.c }}>{x.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 52 }}>
                {[28,42,35,55,48,65,72,60,80,90,75,95].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", background: i === 11 ? "#00C896" : `rgba(0,200,150,${0.15 + i * 0.07})` }} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {["Tax: ₹36K saved","FIRE: Age 52","Direct plan"].map(t => (
                <div key={t} style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: "#00C896", fontWeight: 600 }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="lticker-bar">
        <div className="lticker-track">
          {[...TICKERS,...TICKERS,...TICKERS].map((t, i) => (
            <span key={i} className="lticker-item"><span style={{ color: "#00C896" }}>◆</span>{t}</span>
          ))}
        </div>
      </div>

      {/* CORE MODULES */}
      <div style={{ background: "#0F0F0F", padding: "80px 0" }}>
        <div className="lwrap" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#00C896", marginBottom: 12 }}>Core Modules</div>
          <h2 className="sg" style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 800, marginBottom: 14 }}>
            Six Powerful <span className="gp">AI Modules</span>
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Each module is a fully working product solving a specific financial problem for Indian retail investors.
          </p>
          <div className="lg3">
            {CORE.map((f, i) => (
              <div key={i} className="lcard" style={{ textAlign: "left" }}>
                <div className={`lcard-icon ${f.a}`}>
                  <Ic d={["M22 7 13.5 15.5l-5-5L2 17","M16 7h6v6"]} size={20} color={f.a === "lig" ? "#00C896" : "#F5A623"} />
                </div>
                <div className="sg" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.t}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UNIQUE FEATURES */}
      <div style={{ padding: "80px 0" }}>
        <div className="lwrap" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#F5A623", marginBottom: 12 }}>What Sets Us Apart</div>
          <h2 className="sg" style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 800, marginBottom: 40 }}>
            Features <span className="ga">Found Nowhere Else</span>
          </h2>
          <div className="lg3" style={{ textAlign: "left" }}>
            {UNIQUE.map((f, i) => (
              <div key={i} className="luniq">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ic d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={18} color="#F5A623" />
                </div>
                <div>
                  <div className="sg" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.t}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: "#0F0F0F", padding: "80px 0" }}>
        <div className="lwrap" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#00C896", marginBottom: 12 }}>Simple Process</div>
          <h2 className="sg" style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 800, marginBottom: 56 }}>
            How <span className="gp">ArthSaathi</span> Works
          </h2>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {STEPS.map((step, i) => (
              <div key={step.n} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className="lstep-box">
                    <Ic d={step.icon} size={32} color="#00C896" />
                  </div>
                  <div style={{ color: "#F5A623", fontSize: 13, fontWeight: 700, letterSpacing: ".05em", marginBottom: 10 }}>{step.n}</div>
                  <div className="sg" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.68, maxWidth: 260, textAlign: "center" }}>{step.desc}</div>
                </div>
                {i < 2 && (
                  <div style={{ display: "flex", alignItems: "center", paddingTop: 36, minWidth: 48, justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ flex: 1, height: 2, background: "rgba(0,200,150,0.35)", borderRadius: 1 }} />
                    <Ic d="M5 12h14M12 5l7 7-7 7" size={18} color="rgba(0,200,150,0.6)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROCRASTINATION CLOCK */}
      <div className="lwrap" style={{ padding: "0 24px 80px" }}>
        <ProcClock onEnter={onEnter} />
      </div>

      {/* FINAL CTA */}
      <div style={{ background: "#0F0F0F", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "80px 24px", textAlign: "center" }}>
        <h2 className="sg" style={{ fontSize: "clamp(30px,5vw,54px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 18 }}>
          Your <span className="gp">Wealth Journey</span><br />Starts Here
        </h2>
        <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 40px" }}>
          Join millions of Indians who deserve professional financial advice. ArthSaathi gives you the power of a CA, financial advisor, and tax consultant — completely free.
        </p>
        <button className="lbtn-g-lg" onClick={onEnter} style={{ fontSize: 17 }}>
          Get Your Free Money Health Score
        </button>
      </div>

      {/* FOOTER */}
      <div className="lfooter">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#00C896,#008F6A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#000", fontFamily: "'Space Grotesk',sans-serif" }}>A</div>
          <span className="sg" style={{ fontSize: 16, fontWeight: 700 }}>Arth<span className="gp">Saathi</span></span>
        </div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>India's AI-Powered Personal Finance Mentor</div>
        <div style={{ fontSize: 12, color: "#374151" }}>© 2026 ArthSaathi. All rights reserved.</div>
      </div>
    </div>
  );
}