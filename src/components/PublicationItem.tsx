import { useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Publication } from "../content/types";

interface Props {
  index: number;
  pub: Publication;
}

function RoleBadge({ role }: { role: Publication["role"] }) {
  const label = role === "first" ? "First author" : "Co-author";
  const base = "text-label uppercase tracking-[0.12em] text-tabular px-2 py-1";
  const cls =
    role === "first"
      ? `${base} bg-accent text-paper`
      : `${base} border border-rule text-ink-soft`;
  return <span className={cls}>{label}</span>;
}

export function PublicationItem({ index, pub }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const num = String(index).padStart(2, "0");

  return (
    <article className="rule-top">
      <div className="grid grid-cols-12 gap-4 md:gap-6 py-6 items-baseline">
        <div className="col-span-1 text-tabular text-ink-soft text-label uppercase tracking-[0.12em] pt-1">
          {num}
        </div>
        <div className="col-span-11 md:col-span-8 space-y-2">
          <h3 className="font-serif text-h3 leading-snug">
            <a
              href={pub.url}
              className="hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {pub.title}
            </a>
          </h3>
          <p className="text-sm text-ink-soft">
            <em className="font-serif">{pub.venue}</em>
            {pub.venueDetail && <span> · {pub.venueDetail}</span>}
            <span className="mx-2 text-rule">·</span>
            <span className="text-tabular">{pub.year}</span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 flex md:justify-end items-center gap-3">
          <RoleBadge role={pub.role} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Collapse details" : "Expand details"}
            className="size-8 inline-flex items-center justify-center border border-rule hover:border-accent hover:text-accent transition-colors"
          >
            <span aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>↓</span>
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-12 gap-4 md:gap-6 pb-6">
              <div className="col-span-12 md:col-span-9 md:col-start-2 space-y-4 text-sm text-ink-soft leading-relaxed">
                <p>
                  {pub.authors.map((a, i) => {
                    const isSelf = i === pub.selfIndex;
                    const sep = i < pub.authors.length - 1 ? ", " : "";
                    return isSelf ? (
                      <span key={i}>
                        <strong className="text-ink">{a}</strong>
                        {sep}
                      </span>
                    ) : (
                      <span key={i}>
                        {a}
                        {sep}
                      </span>
                    );
                  })}
                </p>
                {pub.abstract && <p>{pub.abstract}</p>}
                {(pub.doi || pub.arxiv) && (
                  <p>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-tabular">
                      {pub.arxiv ? `arXiv:${pub.arxiv}` : `doi:${pub.doi}`}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
