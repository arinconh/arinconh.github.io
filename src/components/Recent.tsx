import { motion } from "framer-motion";
import { recent } from "../content/recent";
import { Section } from "./primitives/Section";

function fmt(iso: string): string {
  const [y, m] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export function Recent() {
  const items = recent.items.slice(0, 5);
  return (
    <Section id="recent" index="06" label="Recent">
      <ol className="space-y-0">
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.04 }}
            className="grid grid-cols-12 gap-4 md:gap-6 py-5 rule-top items-baseline"
          >
            <div className="col-span-3 md:col-span-2 text-label uppercase tracking-[0.12em] text-ink-soft text-tabular">
              {fmt(item.date)}
            </div>
            <div className="col-span-9 md:col-span-7">
              <p className="text-label uppercase tracking-[0.14em] text-accent mb-1">{item.label}</p>
              <p className="text-ink">{item.description}</p>
            </div>
            <div className="col-span-12 md:col-span-3 md:text-right">
              {item.link && (
                <a href={item.link.href} className="text-accent hover:underline text-sm" target="_blank" rel="noopener noreferrer">
                  {item.link.text} →
                </a>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
