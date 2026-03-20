import { motion } from "framer-motion";

const values = [
  { driver: "Tax Optimisation", benefit: "Save 24,000 - 36,000/yr in missed deductions" },
  { driver: "Direct Plan Switch", benefit: "Save 7,000/yr on a 10L portfolio in lower fees" },
  { driver: "Better Allocation", benefit: "45L more at retirement from 1% better CAGR" },
  { driver: "Insurance Gap Closure", benefit: "Prevent catastrophic financial loss" },
  { driver: "Tip Protection", benefit: "Avoid 18,000 - 45,000 loss per bad tip" },
  { driver: "HRA Couple Optimisation", benefit: "Save 30,000 - 75,000/yr in reduced tax" },
];

const ValueSection = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Value Created <span className="text-gradient-gold">Per User Per Year</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Real, measurable financial impact backed by Indian tax law and market data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-primary/10 bg-background p-6"
            >
              <h3 className="text-sm font-medium text-primary mb-2">{v.driver}</h3>
              <p className="text-foreground/80 font-heading font-semibold">{v.benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
