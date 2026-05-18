import { motion } from "framer-motion";
import { bio } from "../content/bio";
import { Container } from "./primitives/Container";

export function Hero() {
  return (
    <header className="min-h-[92vh] flex flex-col justify-between pt-32 pb-16 bg-paper">
      <Container width="wide">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-12 gap-6 md:gap-10 items-end"
        >
          <div className="col-span-12 md:col-span-7 space-y-8">
            <p className="text-label uppercase tracking-[0.2em] text-ink-soft text-tabular">
              <span className="text-accent">01</span>
              <span className="mx-3 inline-block h-px w-6 align-middle bg-rule" />
              {bio.location}
            </p>
            <h1 className="font-serif text-display leading-[0.95] tracking-[-0.02em] text-balance">
              {bio.name}
            </h1>
            <p className="font-serif italic text-h3 text-ink-soft max-w-xl">
              {bio.role}
            </p>
            <p className="text-base md:text-lg text-ink max-w-xl leading-relaxed">
              {bio.positioning}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={bio.cvs.dataScience.href}
                className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-paper text-sm tracking-wide hover:bg-accent transition-colors"
              >
                {bio.cvs.dataScience.label}
                <span aria-hidden>↓</span>
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-5 py-3 border border-rule text-sm tracking-wide hover:border-accent hover:text-accent transition-colors"
              >
                Read more
              </a>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-rule">
              <img
                src="/portrait.jpg"
                alt={`Portrait of ${bio.name}`}
                className="w-full h-full object-cover"
                loading="eager"
                {...({ fetchpriority: "high" } as Record<string, string>)}
              />
            </div>
          </div>
        </motion.div>
      </Container>
      <Container width="wide">
        <p className="text-label uppercase tracking-[0.2em] text-ink-soft text-tabular pt-16">
          Scroll
        </p>
      </Container>
    </header>
  );
}
