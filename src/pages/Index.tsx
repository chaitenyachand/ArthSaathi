import HeroSection from "@/components/landing/HeroSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import ValueSection from "@/components/landing/ValueSection";
import CTASection from "@/components/landing/CTASection";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <ValueSection />
      <CTASection />
      <footer className="py-8 border-t border-border bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          ArthSaathi — AI Money Mentor. Built for ET AI Hackathon 2026.
        </div>
      </footer>
    </div>
  );
};

export default Index;