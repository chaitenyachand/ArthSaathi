import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CAMSProvider } from "@/context/CAMSContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PortfolioXRay from "./pages/PortfolioXRay.tsx";
import TaxWizard from "./pages/TaxWizard.tsx";
import FireDashboard from "./components/FireDashboard.tsx";
import HealthScore from "./pages/HealthScore.tsx";
import LifeEvent from "./pages/LifeEvent.tsx";
import CouplesPlanner from "./pages/CouplesPlanner.tsx";
import BadAdvice from "./pages/BadAdvice.tsx";
import BiasFingerprint from "./pages/BiasFingerprint.tsx";
import TipAnalyzer from "./components/TipAnalyzer.tsx";
import ProcrastinationClock from "./pages/ProcrastinationClock.tsx";
import TheMirror from "./pages/TheMirror.tsx";
import SalaryTranslator from "./pages/SalaryTranslator.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CAMSProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio-xray" element={<PortfolioXRay />} />
            <Route path="/tax-wizard" element={<TaxWizard />} />
            <Route path="/fire-planner" element={<FireDashboard />} />
            <Route path="/health-score" element={<HealthScore />} />
            <Route path="/life-event" element={<LifeEvent />} />
            <Route path="/couples-planner" element={<CouplesPlanner />} />
            <Route path="/bad-advice" element={<BadAdvice />} />
            <Route path="/bias-fingerprint" element={<BiasFingerprint />} />
            <Route path="/tip-analyzer" element={<TipAnalyzer />} />
            <Route path="/procrastination-clock" element={<ProcrastinationClock />} />
            <Route path="/the-mirror" element={<TheMirror />} />
            <Route path="/salary-translator" element={<SalaryTranslator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CAMSProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;