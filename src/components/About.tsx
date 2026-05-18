import { motion } from "framer-motion";
import { bio } from "../content/bio";
import { Section } from "./primitives/Section";

export function About() {
  return (
    <Section id="about" index="02" label="About" alt>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-12 gap-6 md:gap-10"
      >
        <div className="col-span-12 md:col-span-5">
          <p className="font-serif text-h2 leading-[1.1] tracking-[-0.01em] text-balance">
            Senior Data Scientist working where probabilistic modeling meets production systems.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7 space-y-5 text-ink leading-relaxed">
          {bio.about.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
