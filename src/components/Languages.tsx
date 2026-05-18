import { bio } from "../content/bio";
import { Container } from "./primitives/Container";

export function Languages() {
  return (
    <section className="py-16 bg-paper">
      <Container>
        <p className="font-serif text-h3 text-ink-soft text-balance text-center">
          Based in <span className="text-ink">{bio.location}</span> · works in{" "}
          {bio.languages.map((l, i) => (
            <span key={l}>
              <span className="text-ink">{l}</span>
              {i < bio.languages.length - 1 && " and "}
            </span>
          ))}
          .
        </p>
      </Container>
    </section>
  );
}
