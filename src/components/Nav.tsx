import { useEffect, useState } from "react";
import { Container } from "./primitives/Container";

const links = [
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#publications", label: "Publications" },
  { href: "#talks", label: "Talks" },
  { href: "#recent", label: "Recent" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "bg-paper/85 backdrop-blur border-b border-rule" : "bg-transparent"
      }`}
    >
      <Container width="wide">
        <div className="flex items-center justify-between py-4">
          <a href="#" className="font-serif italic text-lg tracking-tight">
            Alejandra Rincón Hidalgo
          </a>
          <ul className="hidden md:flex items-center gap-7 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ink-soft hover:text-accent transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/Alejandra_Rincon_CV.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper text-sm hover:bg-accent transition-colors"
              >
                CV ↓
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </nav>
  );
}
