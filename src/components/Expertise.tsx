import { motion } from "framer-motion";
import { expertise } from "../content/expertise";
import { Section } from "./primitives/Section";

export function Expertise() {
  return (
    <Section id="expertise" index="03" label="Expertise" title="Five areas, one common backbone.">
      <div className="grid grid-cols-12 gap-6 md:gap-8">
        {expertise.map((area, i) => (
          <motion.article
            key={area.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 md:col-span-6 lg:col-span-4 rule-top pt-6 group"
          >
            <h3 className="font-serif text-h3 leading-tight mb-3 group-hover:text-accent transition-colors">
              {area.title}
            </h3>
            <p className="text-ink-soft leading-relaxed mb-5 text-sm md:text-base">
              {area.description}
            </p>
            <ul className="flex flex-wrap gap-2">
              {area.tools.map((tool) => (
                <li
                  key={tool}
                  className="text-label uppercase tracking-[0.12em] text-ink-soft border border-rule px-2.5 py-1 text-tabular"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
