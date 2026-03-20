import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">
            Stop Losing Money <span className="text-gradient-gold">You Don't Know You're Losing</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Every other tool tells you what to do with your money. ArthSaathi tells you what your money is already doing to you — without your knowledge.
          </p>
          <Button variant="hero" size="lg" className="text-base px-10 py-6" onClick={() => navigate("/dashboard")}>
            Start Free Assessment
            <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
