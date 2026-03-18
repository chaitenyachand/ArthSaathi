import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Faithful reconstruction of the uploaded component files:
   Navbar · HeroSection · StatsRibbon · FeaturesSection · HowItWorksSection
   ProcrastinationClock · CTASection · Footer
   
   All framer-motion animations replicated with CSS keyframes + inline styles.
   All lucide-react icons replicated as inline SVGs.
   All Tailwind class meanings replicated as inline styles + a global stylesheet.
   Color tokens: primary=#00C896 accent=#F5A623 background=#0A0A0A
─────────────────────────────────────────────────────────────────────────────*/

/* ── ICONS (lucide-react replacements) ───────────────────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  ScanSearch:   () => <Icon d={["M3 3l18 18","M10.5 10.5a3 3 0 1 1 4.24 4.24","M11 5H5v14h14v-6"]} />,
  Calculator:   () => <Icon d={["M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M8 6h8M8 10h4M8 14h2","M16 14l2 2 2-2"]} />,
  Target:       () => <Icon d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z","M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"]} />,
  HeartPulse:   () => <Icon d={["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z","M3.22 12H9.5l1.5-3 2 4.5 1.5-3H20.78"]} />,
  CalendarHeart:() => <Icon d={["M3 9h18","M8 2v4","M16 2v4","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z","M12 17c-1-1.5-2-2-2-3a2 2 0 0 1 4 0c0 1-1 1.5-2 3z"]} />,
  Users:        () => <Icon d={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]} />,
  AlertTriangle:() => <Icon d={["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]} />,
  Brain:        () => <Icon d={["M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.6A3 3 0 0 1 4 11c0-1.38.93-2.54 2.2-2.9A2.5 2.5 0 0 1 9.5 2z","M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.6A3 3 0 0 0 20 11c0-1.38-.93-2.54-2.2-2.9A2.5 2.5 0 0 0 14.5 2z"]} />,
  MsgWarn:      () => <Icon d={["M7.9 20A9 9 0 1 0 4 16.1L2 22Z","M12 8v4","M12 16h.01"]} />,
  Timer:        () => <Icon d={["M10 2h4","M12 14l4-4","M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"]} />,
  FlipVertical: () => <Icon d={["M21 8H3","M21 16H3","M12 3v4","M12 21v-4","M4.5 6.5 3 8l1.5 1.5","M19.5 6.5 21 8l-1.5 1.5","M4.5 17.5 3 16l1.5-1.5","M19.5 17.5 21 16l-1.5-1.5"]} />,
  Wallet:       () => <Icon d={["M21 12V7H5a2 2 0 0 1 0-4h14v4","M3 5v14a2 2 0 0 0 2 2h16v-5","M18 12a2 2 0 0 0 0 4h4v-4Z"]} />,
  Upload:       () => <Icon d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]} />,
  Cpu:          () => <Icon d={["M9 3H5a2 2 0 0 0-2 2v4","M9 21H5a2 2 0 0 1-2-2v-4","M15 3h4a2 2 0 0 1 2 2v4","M15 21h4a2 2 0 0 0 2-2v-4","M9 9h6v6H9z"]} />,
  BarChart3:    () => <Icon d={["M3 3v18h18","M18 17V9","M13 17V5","M8 17v-3"]} />,
  TrendingUp:   () => <Icon d={["M22 7 13.5 15.5l-5-5L2 17","M16 7h6v6"]} />,
  Shield:       () => <Icon d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]} />,
  Clock:        () => <Icon d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"]} />,
  Rupee:        () => <Icon d={["M6 3h12","M6 8h12","M6 13l8.5 8","M6 13h3a4 4 0 0 0 0-5H6"]} />,
  ArrowRight:   () => <Icon d={["M5 12h14","M12 5l7 7-7 7"]} />,
  Lightning:    () => <Icon d={["M13 2 3 14h9l-1 8 10-12h-9l1-8z"]} />,
};

/* ── GLOBAL STYLES ────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #0A0A0A;
      color: #F0F0F0;
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .stat-number  { font-family: 'Space Grotesk', monospace; font-variant-numeric: tabular-nums; }

    /* ── CSS tokens matching Tailwind config ── */
    :root {
      --primary:   #00C896;
      --accent:    #F5A623;
      --bg:        #0A0A0A;
      --card:      #141414;
      --secondary: #1A1A1A;
      --border:    rgba(255,255,255,0.08);
      --muted:     #6B7280;
      --fg:        #F0F0F0;
    }

    /* ── Gradient text ── */
    .text-gradient-primary {
      background: linear-gradient(135deg, #00C896, #00A878);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .text-gradient-gold {
      background: linear-gradient(135deg, #F5A623, #E8891A);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Glass card — matches glass-card Tailwind plugin ── */
    .glass-card {
      background: rgba(20, 20, 20, 0.7);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }

    /* ── Glow shadows ── */
    .shadow-glow-primary { box-shadow: 0 0 30px rgba(0,200,150,0.2); }
    .shadow-elevated     { box-shadow: 0 24px 64px rgba(0,0,0,0.5); }

    /* ── Animations ── */
    @keyframes fadeUp     { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
    @keyframes slideInX   { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
    @keyframes ticker     { from { transform:translateX(0); } to { transform:translateX(-50%); } }
    @keyframes floatY     { 0%,100% { transform:translateY(-10px); } 50% { transform:translateY(10px); } }
    @keyframes pulseGlow  { 0%,100% { box-shadow:0 0 20px rgba(0,200,150,0.2); } 50% { box-shadow:0 0 40px rgba(0,200,150,0.45); } }
    @keyframes goldPulse  { 0%,100% { opacity:1; text-shadow:0 0 40px rgba(245,166,35,0.4); } 50% { opacity:.85; text-shadow:0 0 70px rgba(245,166,35,0.7); } }
    @keyframes bgPulse    { 0%,100% { opacity:.03; } 50% { opacity:.08; } }
    @keyframes particleFloat { 0%,100% { transform:translateY(-20px); opacity:.2; } 50% { transform:translateY(20px); opacity:.6; } }
    @keyframes scaleIn    { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }

    .anim-fade-up  { animation: fadeUp  0.6s cubic-bezier(.16,1,.3,1) forwards; }
    .anim-fade-in  { animation: fadeIn  0.5s ease forwards; }
    .anim-slide-x  { animation: slideInX 0.8s cubic-bezier(.16,1,.3,1) forwards; }
    .anim-scale-in { animation: scaleIn 0.5s cubic-bezier(.16,1,.3,1) forwards; }

    /* ── Nav ── */
    .nav {
      position: fixed; top:0; left:0; right:0; z-index:50;
      background: rgba(10,10,10,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .nav-inner {
      max-width:1200px; margin:0 auto;
      display:flex; align-items:center; justify-content:space-between;
      padding:14px 24px;
    }
    .nav-logo { display:flex; align-items:center; gap:10px; }
    .nav-logo-icon {
      width:44px; height:44px; border-radius:10px;
      background: linear-gradient(135deg,#00C896,#008F6A);
      display:flex; align-items:center; justify-content:center;
      font-size:20px; font-weight:900; color:#000;
      font-family:'Space Grotesk',sans-serif;
    }
    .nav-logo-text { font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:700; color:#F0F0F0; }
    .nav-links { display:flex; gap:32px; }
    .nav-link {
      color:#6B7280; font-size:14px; font-weight:500;
      background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif;
      transition:color .18s; text-decoration:none;
    }
    .nav-link:hover { color:#F0F0F0; }
    .btn-primary {
      background: var(--primary); color:#000;
      font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
      padding:10px 20px; border-radius:10px; border:none; cursor:pointer;
      transition:opacity .18s, transform .18s;
    }
    .btn-primary:hover { opacity:.9; transform:translateY(-1px); }

    /* ── Ticker ── */
    .ticker-wrap {
      overflow:hidden; white-space:nowrap;
      border-top:1px solid rgba(255,255,255,0.08);
      border-bottom:1px solid rgba(255,255,255,0.08);
      background: rgba(26,26,26,0.5); padding:14px 0;
    }
    .ticker-track { display:inline-flex; gap:0; animation:ticker 20s linear infinite; }
    .ticker-item  { display:inline-flex; align-items:center; gap:10px; padding:0 36px; font-size:13px; font-weight:500; color:#6B7280; }

    /* ── Cards ── */
    .feat-card {
      background: rgba(20,20,20,0.7);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius:16px; padding:32px;
      backdrop-filter:blur(12px);
      transition:transform .3s, box-shadow .3s, border-color .3s;
      cursor:default;
    }
    .feat-card:hover {
      transform:translateY(-8px);
      box-shadow:0 0 30px rgba(0,200,150,0.15);
      border-color:rgba(0,200,150,0.25);
    }
    .feat-card .card-title { transition:color .2s; }
    .feat-card:hover .card-title { color:var(--primary); }

    .unique-card {
      display:flex; align-items:flex-start; gap:16px; padding:20px;
      border-radius:12px;
      background:rgba(255,255,255,0.03);
      border:1px solid rgba(255,255,255,0.07);
      transition:background .2s;
    }
    .unique-card:hover { background:rgba(255,255,255,0.06); }

    .icon-wrap-primary { background:rgba(0,200,150,0.1); border-radius:12px; width:48px; height:48px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .icon-wrap-accent  { background:rgba(245,166,35,0.1);  border-radius:12px; width:48px; height:48px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .icon-wrap-accent-sm { background:rgba(245,166,35,0.1); border-radius:10px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

    /* ── How it works ── */
    .step-icon-wrap {
      width:104px; height:104px; border-radius:24px;
      background:var(--card);
      border:2px solid rgba(0,200,150,0.2);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 28px;
      box-shadow:0 0 30px rgba(0,200,150,0.12);
      transition:transform .25s;
    }
    .step-icon-wrap:hover { transform:scale(1.08); }

    /* ── Proc clock ── */
    .proc-card {
      background: rgba(20,20,20,0.7);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:20px; backdrop-filter:blur(12px);
      padding:64px 48px; text-align:center; position:relative; overflow:hidden;
    }
    .proc-bg-pulse {
      position:absolute; inset:0; border-radius:20px;
      background:rgba(0,200,150,0.05);
      animation:bgPulse 3s ease-in-out infinite;
      pointer-events:none;
    }
    .proc-amount {
      font-family:'Space Grotesk',sans-serif; font-variant-numeric:tabular-nums;
      font-weight:900; line-height:1;
      background:linear-gradient(135deg,#F5A623,#E8891A);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
      animation:goldPulse 2s ease-in-out infinite;
    }
    .btn-primary-lg {
      background:var(--primary); color:#000;
      font-family:'Inter',sans-serif; font-size:16px; font-weight:700;
      padding:16px 36px; border-radius:12px; border:none; cursor:pointer;
      box-shadow:0 0 30px rgba(0,200,150,0.25);
      transition:opacity .18s, transform .18s;
      animation:pulseGlow 3s ease-in-out infinite;
    }
    .btn-primary-lg:hover { opacity:.9; transform:translateY(-2px); }

    .btn-outline {
      background:transparent; color:#F0F0F0;
      font-family:'Inter',sans-serif; font-size:16px; font-weight:500;
      padding:15px 32px; border-radius:12px;
      border:1px solid rgba(255,255,255,0.15); cursor:pointer;
      transition:background .18s, border-color .18s;
    }
    .btn-outline:hover { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.25); }

    /* ── Grid ── */
    .g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
    .g3u{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }

    /* ── Section spacing ── */
    .section { padding:96px 0; }
    .container { max-width:1200px; margin:0 auto; padding:0 24px; }

    /* ── Hero bg ── */
    .hero-bg {
      position:absolute; inset:0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0,200,150,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 20%, rgba(245,166,35,0.04) 0%, transparent 60%),
        linear-gradient(180deg,#0A0A0A 0%,#0D0D0D 100%);
    }

    /* ── Particle ── */
    .particle {
      position:absolute; width:4px; height:4px; border-radius:50%;
      background:rgba(0,200,150,0.4);
    }

    @media(max-width:768px){
      .g3,.g3u { grid-template-columns:1fr; }
      .hero-grid { grid-template-columns:1fr !important; }
      .hero-right { display:none !important; }
      .nav-links { display:none; }
      .how-connector { display:none !important; }
      .proc-card { padding:40px 24px; }
      .nav-inner { padding:12px 20px; }
    }
  `}</style>
);

/* ── CountUpNumber (from HeroSection.tsx) ────────────────────────────────── */
function CountUpNumber({ end, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const r = useRef(null);
  useEffect(() => {
    const duration = 2000, steps = 60, inc = end / steps;
    let cur = 0;
    r.current = setInterval(() => {
      cur += inc;
      if (cur >= end) { setCount(end); clearInterval(r.current); }
      else setCount(Math.floor(cur * 10) / 10);
    }, duration / steps);
    return () => clearInterval(r.current);
  }, [end]);
  const display = typeof count === "number" && count % 1 !== 0 ? count.toFixed(1) : count;
  return (
    <span className="stat-number" style={{ fontSize:"clamp(28px,3.5vw,38px)", fontWeight:900, lineHeight:1.1 }}>
      {prefix}{display}{suffix}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NAVBAR  (Navbar.tsx)
══════════════════════════════════════════════════════════════════════════ */
function Navbar({ onEnter }) {
  return (
    <nav className="nav anim-fade-in" style={{ animationDelay:"0ms" }}>
      <div className="nav-inner">
        <div className="nav-logo">
          <div className="nav-logo-icon">₹</div>
          <span className="nav-logo-text">
            Arth<span className="text-gradient-primary">Saathi</span>
          </span>
        </div>
        <div className="nav-links">
          {["Features","How it Works","About"].map((item) => (
            <a key={item}
              href={`#${item.toLowerCase().replace(/\s/g,"-")}`}
              className="nav-link">{item}</a>
          ))}
        </div>
        <button className="btn-primary" onClick={onEnter}>Get Started Free</button>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HERO SECTION  (HeroSection.tsx)
══════════════════════════════════════════════════════════════════════════ */
function HeroSection({ onEnter }) {
  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", paddingTop:80 }}>
      {/* Background */}
      <div className="hero-bg" />

      {/* Floating particles — matches framer-motion particles */}
      {[0,1,2,3,4,5].map((i) => (
        <div key={i} className="particle" style={{
          left:`${15 + i * 15}%`, top:`${20 + (i % 3) * 25}%`,
          animation:`particleFloat ${4 + i}s ease-in-out infinite`,
          animationDelay:`${i * 0.5}s`,
        }} />
      ))}

      <div className="container" style={{ position:"relative", zIndex:10, padding:"112px 24px 64px", width:"100%" }}>
        <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>

          {/* ── Left ── */}
          <div>
            {/* Badge — glass-card inline */}
            <div className="glass-card anim-fade-up" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"8px 16px", marginBottom:24,
              animationDelay:"200ms", borderRadius:12,
            }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"var(--primary)", display:"block", animation:"pulseGlow 2s ease-in-out infinite" }} />
              <span style={{ fontSize:14, color:"#6B7280" }}>AI-Powered Financial Mentor</span>
            </div>

            {/* H1 */}
            <h1 className="font-display anim-fade-up" style={{
              fontSize:"clamp(48px,5.5vw,76px)", fontWeight:900, lineHeight:1.08,
              marginBottom:24, animationDelay:"300ms",
            }}>
              Your AI<br />
              <span className="text-gradient-primary">Money Mentor</span><br />
              <span className="text-gradient-gold">for India</span>
            </h1>

            {/* Subtext */}
            <p className="anim-fade-up" style={{
              fontSize:18, color:"#6B7280", lineHeight:1.72,
              maxWidth:480, marginBottom:32, animationDelay:"500ms",
            }}>
              A CA, a financial advisor, and a tax consultant — free, in 60 seconds,
              for every Indian with a smartphone.
            </p>

            {/* CTAs */}
            <div className="anim-fade-up" style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:48, animationDelay:"700ms" }}>
              <button className="btn-primary-lg" onClick={onEnter} style={{ fontSize:15, padding:"14px 30px" }}>
                Start Free Analysis →
              </button>
              <button className="btn-outline" style={{ fontSize:15, padding:"13px 28px" }}>
                Watch Demo
              </button>
            </div>

            {/* Stats grid */}
            <div className="anim-fade-up" style={{
              display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20,
              paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.08)",
              animationDelay:"900ms",
            }}>
              {[
                { value:14.2, suffix:" Cr+", label:"Demat Accounts" },
                { value:95,   suffix:"%",    label:"Have No Plan"   },
                { value:25,   prefix:"₹",    suffix:"K+", label:"Advisor Fee/Yr" },
                { value:177,  prefix:"1:",   label:"Advisor Ratio"  },
              ].map((s) => (
                <div key={s.label}>
                  <CountUpNumber end={s.value} suffix={s.suffix||""} prefix={s.prefix||""} />
                  <p style={{ fontSize:12, color:"#6B7280", marginTop:4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — hero image replacement ── */}
          <div className="hero-right anim-slide-x" style={{ animationDelay:"600ms" }}>
            <div style={{
              borderRadius:20, overflow:"hidden",
              border:"1px solid rgba(255,255,255,0.08)",
              background:"linear-gradient(135deg,#0E1A14,#0D150F)",
              padding:"40px 32px",
              animation:"floatY 6s ease-in-out infinite",
              boxShadow:"0 24px 64px rgba(0,0,0,0.5)",
            }}>
              {/* Mock dashboard */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#FF5F57" }} />
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#FFBD2E" }} />
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#28CA41" }} />
                <span style={{ fontSize:11, color:"#3A4A3A", marginLeft:4 }}>arthsaathi.ai — Portfolio X-Ray</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>TRUE XIRR</div>
                  <div className="stat-number" style={{ fontSize:42, fontWeight:900, color:"var(--primary)", lineHeight:1 }}>12.1%</div>
                  <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>vs 8.4% apparent</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>OVERLAP</div>
                  <div className="stat-number" style={{ fontSize:30, fontWeight:900, color:"#F87171" }}>73%</div>
                  <div style={{ fontSize:11, color:"#6B7280" }}>3 large-cap funds</div>
                </div>
              </div>
              {/* Mini bar chart */}
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:52, marginBottom:16 }}>
                {[28,42,35,55,48,65,72,60,80,90,75,95].map((h, i) => (
                  <div key={i} style={{
                    flex:1, height:`${h}%`, borderRadius:"3px 3px 0 0",
                    background: i === 11 ? "var(--primary)" : `rgba(0,200,150,${0.15 + i*0.07})`,
                  }} />
                ))}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["XIRR: 12.1%","Tax: ₹36K saved","FIRE: Age 52"].map((t) => (
                  <div key={t} style={{
                    background:"rgba(0,200,150,0.1)", border:"1px solid rgba(0,200,150,0.25)",
                    borderRadius:8, padding:"5px 12px", fontSize:11, color:"var(--primary)", fontWeight:600,
                  }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STATS RIBBON  (StatsRibbon.tsx)
══════════════════════════════════════════════════════════════════════════ */
const RIBBON_ITEMS = [
  { Icon: Icons.TrendingUp, text:"True XIRR in 10 seconds" },
  { Icon: Icons.Rupee,      text:"Save ₹40K+ in taxes"     },
  { Icon: Icons.Shield,     text:"Detect hidden fees"       },
  { Icon: Icons.Clock,      text:"60-second financial plan" },
  { Icon: Icons.TrendingUp, text:"True XIRR in 10 seconds" },
  { Icon: Icons.Rupee,      text:"Save ₹40K+ in taxes"     },
  { Icon: Icons.Shield,     text:"Detect hidden fees"       },
  { Icon: Icons.Clock,      text:"60-second financial plan" },
];

function StatsRibbon() {
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {[...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS].map((item, i) => (
          <div key={i} className="ticker-item">
            <span style={{ color:"var(--primary)", display:"flex" }}>
              <item.Icon />
            </span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FEATURES SECTION  (FeaturesSection.tsx)
══════════════════════════════════════════════════════════════════════════ */
const coreFeatures = [
  { Icon: Icons.ScanSearch,    title:"MF Portfolio X-Ray",     accent:"primary", desc:"Upload CAMS statement → true XIRR, overlap, hidden fees & rebalancing plan in 10 seconds." },
  { Icon: Icons.Calculator,    title:"Tax Wizard",              accent:"accent",  desc:"Upload Form 16 → old vs new regime comparison + every deduction you're missing." },
  { Icon: Icons.Target,        title:"FIRE Path Planner",       accent:"primary", desc:"Enter life goals → month-by-month roadmap to financial independence with exact SIP amounts." },
  { Icon: Icons.HeartPulse,    title:"Money Health Score",      accent:"accent",  desc:"5-minute quiz → score across 6 financial dimensions with navigation to fixes." },
  { Icon: Icons.CalendarHeart, title:"Life Event Advisor",      accent:"primary", desc:"Enter a life event → ranked, personalised action plan in exact rupee amounts." },
  { Icon: Icons.Users,         title:"Couple's Money Planner",  accent:"accent",  desc:"Both partners enter data → joint optimisation of HRA, NPS, SIP, and insurance." },
];

const uniqueFeatures = [
  { Icon: Icons.AlertTriangle, title:"Cost of Bad Advice Detector",   desc:"Exact rupees your agent earned from your portfolio." },
  { Icon: Icons.Brain,         title:"Behavioral Bias Fingerprint",   desc:"Your dominant bias → every output adapts to your psychology." },
  { Icon: Icons.MsgWarn,       title:"WhatsApp Tip Analyzer",         desc:"Paste any tip → A-to-F grade with red-flag analysis." },
  { Icon: Icons.Timer,         title:"Procrastination Cost Clock",    desc:"Live counter showing wealth lost every second you delay." },
  { Icon: Icons.FlipVertical,  title:"The Mirror",                    desc:"Your answers vs actual CAMS behaviour — reality check." },
  { Icon: Icons.Wallet,        title:"Salary-to-Wealth Translator",   desc:"Any rupee amount → its 30-year retirement corpus equivalent." },
];

function FeaturesSection() {
  return (
    <section id="features" className="section" style={{ background:"rgba(0,0,0,0.3)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <span style={{ color:"var(--primary)", fontSize:12, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase" }}>
            Core Modules
          </span>
          <h2 className="font-display" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:800, marginTop:12, marginBottom:16, lineHeight:1.15 }}>
            Six Powerful <span className="text-gradient-primary">AI Modules</span>
          </h2>
          <p style={{ color:"#6B7280", fontSize:17, maxWidth:600, margin:"0 auto", lineHeight:1.7 }}>
            Each module is a fully working product solving a specific financial problem for Indian retail investors.
          </p>
        </div>

        {/* Core features grid */}
        <div className="g3" style={{ marginBottom:96 }}>
          {coreFeatures.map((f, i) => (
            <div key={i} className="feat-card" style={{ animationDelay:`${i*0.1}s` }}>
              <div className={f.accent === "primary" ? "icon-wrap-primary" : "icon-wrap-accent"} style={{ marginBottom:20 }}>
                <span style={{ color: f.accent === "primary" ? "var(--primary)" : "var(--accent)", display:"flex" }}>
                  <f.Icon />
                </span>
              </div>
              <h3 className="font-display card-title" style={{ fontSize:19, fontWeight:700, marginBottom:12, color:"#F0F0F0" }}>
                {f.title}
              </h3>
              <p style={{ color:"#6B7280", fontSize:14, lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Unique features header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <span style={{ color:"var(--accent)", fontSize:12, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase" }}>
            What Sets Us Apart
          </span>
          <h2 className="font-display" style={{ fontSize:"clamp(28px,3.5vw,42px)", fontWeight:800, marginTop:12, lineHeight:1.15 }}>
            Features <span className="text-gradient-gold">Found Nowhere Else</span>
          </h2>
        </div>

        {/* Unique features grid */}
        <div className="g3u">
          {uniqueFeatures.map((f, i) => (
            <div key={i} className="unique-card">
              <div className="icon-wrap-accent-sm">
                <span style={{ color:"var(--accent)", display:"flex" }}><f.Icon /></span>
              </div>
              <div>
                <h4 className="font-display" style={{ fontSize:14, fontWeight:700, marginBottom:5, color:"#F0F0F0" }}>
                  {f.title}
                </h4>
                <p style={{ color:"#6B7280", fontSize:12, lineHeight:1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS  (HowItWorksSection.tsx)
══════════════════════════════════════════════════════════════════════════ */
const steps = [
  { Icon: Icons.Upload,    step:"01", title:"Upload Your Data",
    desc:"Upload your CAMS statement, Form 16, or simply answer a quick questionnaire. Your data stays private and secure." },
  { Icon: Icons.Cpu,       step:"02", title:"AI Analyses Everything",
    desc:"Our multi-agent AI system powered by real financial mathematics and Indian tax law processes your data in seconds." },
  { Icon: Icons.BarChart3, step:"03", title:"Get Actionable Insights",
    desc:"Receive your personalised financial blueprint — exact numbers, specific recommendations, and a clear roadmap." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section" style={{ background:"rgba(255,255,255,0.02)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:80 }}>
          <span style={{ color:"var(--primary)", fontSize:12, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase" }}>
            Simple Process
          </span>
          <h2 className="font-display" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:800, marginTop:12, lineHeight:1.15 }}>
            How <span className="text-gradient-primary">ArthSaathi</span> Works
          </h2>
        </div>

        {/* Steps */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr auto 1fr", alignItems:"flex-start", gap:0 }}>
          {steps.map((step, i) => (
            <>
              <div key={step.step} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
                <div className="step-icon-wrap">
                  <span style={{ color:"var(--primary)", display:"flex" }}>
                    <step.Icon size={40} />
                  </span>
                </div>
                <span style={{ color:"var(--accent)", fontSize:13, fontWeight:700, letterSpacing:"0.06em", marginBottom:10 }}>
                  {step.step}
                </span>
                <h3 className="font-display" style={{ fontSize:22, fontWeight:700, marginBottom:14, color:"#F0F0F0" }}>
                  {step.title}
                </h3>
                <p style={{ color:"#6B7280", fontSize:14, lineHeight:1.68, maxWidth:264 }}>{step.desc}</p>
              </div>
              {i < 2 && (
                <div key={`conn-${i}`} className="how-connector" style={{
                  display:"flex", alignItems:"center", paddingTop:44, gap:0, minWidth:48,
                }}>
                  <div style={{ flex:1, height:3, background:"linear-gradient(90deg,rgba(0,200,150,0.6),rgba(0,200,150,0.2))", borderRadius:2 }} />
                  <span style={{ color:"rgba(0,200,150,0.6)", marginLeft:2, display:"flex" }}>
                    <Icons.ArrowRight size={22} />
                  </span>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROCRASTINATION CLOCK  (ProcrastinationClock.tsx)
══════════════════════════════════════════════════════════════════════════ */
function ProcrastinationClock({ onEnter }) {
  const [seconds, setSeconds] = useState(0);
  // Matches uploaded file: perSecond = 1.9 (₹5000/mo SIP, 30yr, 12% CAGR ÷ seconds)
  const perSecond = 1.9;
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const lostAmount = Math.floor(seconds * perSecond);

  return (
    <section className="section">
      <div className="container">
        <div className="proc-card">
          <div className="proc-bg-pulse" />
          <span style={{ color:"var(--primary)", fontSize:12, fontWeight:700, letterSpacing:"0.13em",
            textTransform:"uppercase", position:"relative", zIndex:1,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Icons.Clock size={14} />
            Live Procrastination Cost Clock
          </span>

          <h2 className="font-display" style={{ fontSize:"clamp(28px,3.5vw,40px)", fontWeight:800,
            marginTop:16, marginBottom:8, position:"relative", zIndex:1, color:"#F0F0F0" }}>
            While you've been on this page...
          </h2>

          <div style={{ position:"relative", zIndex:1, margin:"32px 0" }}>
            <div className="proc-amount" style={{ fontSize:"clamp(64px,10vw,112px)" }}>
              ₹{lostAmount.toLocaleString("en-IN")}
            </div>
            <p style={{ color:"#6B7280", fontSize:17, marginTop:10 }}>
              in potential wealth has been lost by not starting a ₹5,000/month SIP
            </p>
          </div>

          <p style={{ color:"#4B5563", fontSize:14, marginBottom:36, position:"relative", zIndex:1 }}>
            Every second you delay, compounding works against you. At 12% CAGR over 30 years, even ₹1.9/second adds up.
          </p>

          <button className="btn-primary-lg" onClick={onEnter} style={{ position:"relative", zIndex:1 }}>
            Stop Losing Money — Start Now
          </button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CTA SECTION  (CTASection.tsx)
══════════════════════════════════════════════════════════════════════════ */
function CTASection({ onEnter }) {
  return (
    <section style={{ padding:"96px 24px", textAlign:"center",
      background:"rgba(255,255,255,0.01)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <h2 className="font-display" style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:800,
        lineHeight:1.15, marginBottom:18 }}>
        Your <span className="text-gradient-primary">Wealth Journey</span><br />Starts Here
      </h2>
      <p style={{ fontSize:17, color:"#6B7280", lineHeight:1.7,
        maxWidth:520, margin:"0 auto 40px" }}>
        Join millions of Indians who deserve professional financial advice. ArthSaathi gives you the
        power of a CA, financial advisor, and tax consultant — completely free.
      </p>
      <button className="btn-primary-lg" onClick={onEnter}>
        Get Your Free Money Health Score
      </button>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FOOTER  (Footer.tsx)
══════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)",
      padding:"40px 24px", background:"rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:8,
            background:"linear-gradient(135deg,#00C896,#008F6A)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, fontWeight:900, color:"#000", fontFamily:"'Space Grotesk',sans-serif" }}>₹</div>
          <span className="font-display" style={{ fontSize:17, fontWeight:700, color:"#F0F0F0" }}>
            Arth<span className="text-gradient-primary">Saathi</span>
          </span>
        </div>
        <p style={{ fontSize:14, color:"#6B7280" }}>India's AI-Powered Personal Finance Mentor</p>
        <p style={{ fontSize:12, color:"#4B5563" }}>© 2026 ArthSaathi. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT  (App.tsx assembles all components)
══════════════════════════════════════════════════════════════════════════ */
export default function Landing({ onEnter }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A" }}>
      <GlobalStyles />
      <Navbar onEnter={onEnter} />
      <HeroSection onEnter={onEnter} />
      <StatsRibbon />
      <FeaturesSection />
      <HowItWorksSection />
      <ProcrastinationClock onEnter={onEnter} />
      <CTASection onEnter={onEnter} />
      <Footer />
    </div>
  );
}