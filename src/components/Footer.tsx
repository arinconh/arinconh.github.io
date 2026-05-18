import { bio } from "../content/bio";
import { Container } from "./primitives/Container";

export function Footer() {
  return (
    <footer className="bg-ink text-paper py-20">
      <Container width="wide">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6 space-y-4">
            <p className="font-serif text-h2 leading-tight text-balance">
              Open to senior Data Science roles.
            </p>
            <p className="text-paper/70 max-w-md">
              The fastest path is email — I read everything.
            </p>
            <a
              href={bio.social.email}
              className="inline-block font-serif text-h3 italic text-accent-soft hover:text-accent transition-colors mt-2"
            >
              {bio.social.email.replace("mailto:", "")}
            </a>
          </div>
          <div className="col-span-6 md:col-span-3 space-y-3">
            <p className="text-label uppercase tracking-[0.18em] text-paper/50">CV</p>
            <a href={bio.cvs.dataScience.href} className="block hover:text-accent-soft transition-colors">
              Data Science ↓
            </a>
            <a href={bio.cvs.mathematics.href} className="block hover:text-accent-soft transition-colors">
              Academic ↓
            </a>
          </div>
          <div className="col-span-6 md:col-span-3 space-y-3">
            <p className="text-label uppercase tracking-[0.18em] text-paper/50">Elsewhere</p>
            <a href={bio.social.linkedin} className="block hover:text-accent-soft transition-colors" target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a href={bio.social.twitter} className="block hover:text-accent-soft transition-colors" target="_blank" rel="noopener noreferrer">
              Twitter ↗
            </a>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-paper/15 flex justify-between text-paper/50 text-sm">
          <p>© {new Date().getFullYear()} Alejandra Rincón Hidalgo</p>
          <p className="text-tabular">arinconh.github.io</p>
        </div>
      </Container>
    </footer>
  );
}
