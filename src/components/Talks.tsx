import { motion } from "framer-motion";
import { talks } from "../content/talks";
import { Section } from "./primitives/Section";

function formatDate(iso: string): string {
  const [y, m] = iso.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export function Talks() {
  return (
    <Section id="talks" index="05" label="Talks & Presentations" alt>
      <ol className="space-y-0">
        {talks.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="grid grid-cols-12 gap-4 md:gap-6 py-6 rule-top items-baseline"
          >
            <div className="col-span-12 md:col-span-3 text-label uppercase tracking-[0.12em] text-ink-soft text-tabular">
              {formatDate(t.date)}
            </div>
            <div className="col-span-12 md:col-span-9 space-y-1">
              <h3 className="font-serif text-h3 leading-snug">{t.title}</h3>
              <p className="text-sm text-ink-soft">
                <em className="font-serif">{t.venue}</em> · {t.location}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
