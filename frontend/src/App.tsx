import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./modules/Dashboard";
import MoneyHealthScore from "./modules/MoneyHealthScore";
import MFPortfolioXRay from "./modules/MFPortfolioXRay";
import TaxWizard from "./modules/TaxWizard";
import FirePlanner from "./modules/FirePlanner";
import LifeEventAdvisor from "./modules/LifeEventAdvisor";
import CouplesPlanner from "./modules/CouplesPlanner";
import BehavioralBiasFingerprint from "./modules/BehavioralBiasFingerprint";
import WhatsAppTipAnalyzer from "./modules/WhatsAppTipAnalyzer";
import ProcrastinationClock from "./modules/ProcrastinationClock";
import TheMirror from "./modules/TheMirror";
import SalaryWealthTranslator from "./modules/SalaryWealthTranslator";
import LandingPage from "./pages/LandingPage";
import type { ModuleId, ScoreMap } from "./utils/constants";

type View = "landing" | "app";

const BadAdviceDetector = () => (
  <div style={{ color: "#F0F0F0", padding: 32 }}>
    <h2>Cost of Bad Advice</h2>
    <p>
      This module is embedded inside MF Portfolio X-Ray. Upload your CAMS
      statement there to see exactly how much your distributor earned.
    </p>
  </div>
);

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [activeModule, setActiveModule] = useState<ModuleId | "dashboard">("dashboard");
  const [scores, setScores] = useState<ScoreMap | undefined>(undefined);

  const healthScore =
    scores
      ? Math.round(
          Object.values(scores).reduce((a, b) => a + b, 0) /
            Object.values(scores).length
        )
      : undefined;

  if (view === "landing") {
    return <LandingPage onEnter={() => setView("app")} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={setActiveModule}
            healthScore={healthScore}
            scores={scores}
          />
        );
      case "score":
        return (
          <MoneyHealthScore 
            onScoreReady={setScores}
            onNavigate={setActiveModule}
          />
        );
    
      case "xray":
        return <MFPortfolioXRay />;
      case "tax":
        return <TaxWizard />;
      case "fire":
        return <FirePlanner />;
      case "life":
        return <LifeEventAdvisor />;
      case "couples":
        return <CouplesPlanner />;
      case "badadvice":
        return <BadAdviceDetector />;
      case "bias":
        return <BehavioralBiasFingerprint />;
      case "tip":
        return <WhatsAppTipAnalyzer />;
      case "clock":
        return <ProcrastinationClock />;
      case "mirror":
        return <TheMirror />;
      case "translator":
        return <SalaryWealthTranslator />;
      default:
        return <Dashboard onNavigate={setActiveModule} />;
    }
  };

  return (
    <Layout
      activeModule={activeModule}
      onNavigate={setActiveModule}
      onBackHome={() => setView("landing")}
      healthScore={healthScore}
    >
      {renderModule()}
    </Layout>
  );
}
