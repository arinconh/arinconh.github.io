# Personal Site Redesign — Alejandra Rincón Hidalgo

**Date:** 2026-05-18
**Status:** Draft, awaiting user approval
**Live URL:** https://arinconh.github.io/
**Repo:** github.com/arinconh/arinconh.github.io

## 1. Goal

Replace the current React/Vite landing page with a new, professionally designed personal site that helps the user (Alejandra Rincón Hidalgo — Senior Data Scientist, PhD in Mathematics) get hired by recruiters / hiring managers in industry data science roles.

Secondary goals: maintain academic credibility (publications, talks) and preserve the dual DS-plus-mathematician identity.

## 2. Audience & Success Criteria

**Primary audience:** Recruiters and hiring managers evaluating senior Data Scientist candidates.

**Success looks like:**
- A recruiter visits, finds the CV and key credentials in under 15 seconds
- The site reads as senior, considered, and distinctive (not template-ish)
- Publications and talks reinforce credibility without dominating the page
- Contact and CV download are unmistakable

## 3. Sections (in scroll order)

Same content as the current live site, reorganized and re-styled:

1. **Hero** — name, role ("Senior Data Scientist · PhD in Mathematics"), one-line positioning statement, portrait, primary CTA ("Download CV"), language switcher
2. **About Me** — short bio (~3 short paragraphs), current role at NETCHECK, what she's looking for
3. **Expertise** — 5 areas as editorial cards: Data Science · Gen AI & ML · Data Engineering · Cloud & Infrastructure · Mathematics. Each card carries a short description and a tool-tag row (Python/SQL/Airflow, LangGraph/PyTorch/PyMC, AWS Bedrock/SageMaker, etc.)
4. **Selected Publications** — editorial list, newest first. Add the three new references (Epidemics 2026, the two medRxiv preprints) to the existing publications. Each entry: title (linked to DOI), full author list with the user's name bolded, venue, year. Visual treatment: numbered serif entries with a thin rule between.
5. **Talks & Presentations** — vertical timeline. Each: title, venue, location, date.
6. **Recent** (renamed from "Activity") — 3–5 most recent professional updates (new paper, talk, role milestone). Updated by editing a single data file.
7. **Languages & location** — small block displaying "Berlin, Germany · English · Spanish" (or similar single-line composition).
8. **Footer** — CV downloads (DS + Mathematician), LinkedIn, Twitter, email.

**Dropped from current site:** "Blog Coming Soon" placeholder — perpetual "coming soon" reads as inactive. If she ever wants a blog, we add it then.

## 4. Visual System — "Studio Folio"

**Typography**
- Display: **Fraunces** (variable serif), weights 300–600, slight optical sizing for headlines
- Body / UI: **Inter Tight**, weights 400/500/600
- Numeric tabular: Inter Tight tabular figures for dates and section indices

**Palette**
- Background: `#FFFFFF` (page) and `#FAFAF7` (alternate sections)
- Ink: `#0A0A0A` (text), `#4A4A4A` (secondary text), `#E6E4DC` (rules)
- Accent: **Muted sage `#6B6E45`** — used for links, accent rules, and the active-state language pill. Warm, sophisticated, distinctly editorial.

**Grid**
- 12-column asymmetric grid, 80px max gutters on desktop
- Section padding: 96px top/bottom desktop, 48px mobile
- Vertical rhythm anchored to an 8px baseline

**Section index markers**
- Each section opens with a small tabular label like `02 — About` in 12px Inter Tight uppercase tracking, paired with a serif H2.

**Publication cards**
- Numbered (01, 02, 03…) in tabular figures
- Title in 22px Fraunces, italic for the venue
- Author list in 14px Inter Tight; user's name bolded
- DOI badge: small pill, accent color on hover
- Thin `#E6E4DC` rule between entries

**Motion**
- Reveal-on-scroll fades (Framer Motion, 200ms, easeOut) on section entry
- Card hover: subtle 2px lift + shadow softening
- No parallax, no scroll-jacking

**Imagery**
- Reuse the existing portrait (`photo-CPWyJsTQ.jpeg`) — regenerated at 800/1600/2400 widths, served as WebP with JPEG fallback
- Editorial frame: rounded corners off, defined edge, ~5/7 col span on desktop

## 5. Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (utility-first, with custom theme tokens for the palette, type scale, and grid)
- **Framer Motion** for the subtle reveal/lift interactions
- **react-helmet-async** for per-page meta tags (SEO)
- No router needed — single page, anchor navigation with smooth scroll
- No CMS — content lives in typed TypeScript data files (`src/content/*.ts`) so updates are diff-able and version-controlled

## 6. Repository Layout

New code lives in a `site/` subdirectory in the existing repo (master branch):

```
arinconh.github.io/
├── site/                       # NEW — Vite project
│   ├── src/
│   │   ├── components/         # Hero, About, Expertise, Publications, Talks, Recent, Footer
│   │   ├── content/            # publications.ts, talks.ts, expertise.ts, recent.ts, bio.ts
│   │   ├── styles/             # tailwind.css, fonts.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                 # static assets (PDFs, portrait, favicon)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── .github/workflows/
│   └── deploy.yml              # NEW — build site/ and push to gh-pages
└── (existing Jekyll files stay on master, ignored by deploy)
```

The current Jekyll source on `master` stays where it is. We add `site/` alongside it. The Jekyll files won't be served — the new GitHub Action publishes `site/dist/` to `gh-pages`, which is what's already configured to serve.

## 7. Deployment

**GitHub Action** (`.github/workflows/deploy.yml`):
- Trigger: push to `master` (path filter: `site/**`)
- Steps: checkout → setup-node 20 → `npm ci` in `site/` → `npm run build` → publish `site/dist/` to `gh-pages` branch using `peaceiris/actions-gh-pages`

This means: the user pushes a change on `master`, GitHub builds it, the new `gh-pages` content goes live in ~60s. No local Node installation required for day-to-day content edits.

**Local dev** (optional, for visual changes): `cd site && npm install && npm run dev` — opens at `http://localhost:5173`.

## 8. Content Migration

Pulled from the live bundle and verified:

- Existing publications to preserve: "Moduli of Bridgeland Semistable Holomorphic Triples on Curves" (J. Pure Appl. Algebra), "Non-symplectic Automorphisms of Order Multiple of Seven on K3 Surfaces", "Urban Segregation and Daily Human Mobility Patterns in Berlin" (Int. J. Infectious Diseases, Vol. 152, Suppl., March 2025)
- New publications to add: *Epidemics* 54:100886 (2026), medRxiv "Inferring Respiratory Disease Biology from Geolocation Data" (2026, first author), medRxiv "A comparison of random mixing…" (2025)
- Talks to preserve: NetMob 2024, Washington D.C., October 2024
- CVs to preserve: `Alejandra_Rincon_CV.pdf` (DS), `Academic_CV.pdf` (Math)
- Languages: English, Spanish
- Social: LinkedIn, Twitter

The current React bundle is minified, so author lists and exact metadata for the older publications are not directly extractable. They will be reconstructed via CrossRef / arXiv / direct DOI lookups during implementation and confirmed with the user before launch.

## 9. Accessibility & Performance Targets

- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile)
- Color contrast: AA minimum, AAA for body text
- Keyboard navigation: all interactive elements reachable, focus rings visible
- `prefers-reduced-motion`: disables all entrance/lift animations
- Portrait served as responsive `<picture>` with WebP + JPEG fallback
- Fonts: subset Fraunces and Inter Tight, `font-display: swap`
- Target initial JS bundle: < 80 KB gzipped

## 10. Out of Scope

- Blog / writing section
- Project case studies (none NDA-clean to share right now)
- Dark mode (could be a v2)
- i18n routing — the language switcher swaps in-page text; no separate URLs
- Comments, analytics, search

## 11. Open Decisions (for user to confirm at review)

1. Accent color — proposing muted sage `#6B6E45`. Alternatives if you'd prefer: warm terracotta `#B05B3B`, deep ink blue `#1E3A5F`.
2. Portrait — reuse existing, or upload a new editorial portrait?
3. "Recent" section — should it exist, or drop entirely?
4. Drop "Blog Coming Soon" — confirm OK?
5. One-line positioning statement under your name in the hero — please supply, or I can draft 2-3 options.
