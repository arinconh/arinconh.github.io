import { publications } from "../content/publications";
import { PublicationItem } from "./PublicationItem";
import { Section } from "./primitives/Section";

export function Publications() {
  const sorted = [...publications].sort((a, b) => b.year - a.year);
  return (
    <Section
      id="publications"
      index="04"
      label="Selected Publications"
    >
      <div className="rule-bottom">
        {sorted.map((p, i) => (
          <PublicationItem key={p.id} index={i + 1} pub={p} />
        ))}
      </div>
    </Section>
  );
}
