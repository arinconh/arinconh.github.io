# Personal Site Redesign — Alejandra Rincón Hidalgo

**Date:** 2026-05-18
**Status:** Draft v2 — revised after first review, awaiting approval
**Live URL:** https://arinconh.github.io/
**Repo:** github.com/arinconh/arinconh.github.io

## 1. Goal

Replace the current React/Vite landing page with a new, professionally designed personal site that helps the user (Alejandra Rincón Hidalgo — Senior Data Scientist, PhD in Mathematics) get hired by recruiters / hiring managers in industry data science roles.

Secondary goal: communicate her distinctive scientific identity — **mathematically grounded modeling under uncertainty, applied to network science, human mobility, and epidemiological systems** — so she is not mistaken for a generic GenAI/DS portfolio. Publications, talks, and the Expertise framing should all reinforce this differentiator.

## 2. Audience & Success Criteria

**Primary audience:** Recruiters and hiring managers evaluating senior Data Scientist candidates.

**Success looks like:**
- A recruiter visits, finds the CV and key credentials in under 15 seconds
- The site reads as senior, considered, and distinctive (not template-ish)
- Publications and talks reinforce credibility without dominating the page
- Contact and CV download are unmistakable

## 3. Sections (in scroll order)

Same content as the current live site, reorganized and re-styled:

1. **Hero** — name, role ("Senior Data Scientist · PhD in Mathematics"), one-line **scientific positioning statement** (see §11.5), portrait, primary CTA ("Download CV"), language switcher.
2. **About Me** — short bio (~3 short paragraphs), current role at NETCHECK, the scientific thread that connects the mathematics PhD to the applied work today (network science / mobility / epidemiology / Bayesian modeling), and what she's looking for.
3. **Expertise** — 5 cards at a consistent abstraction level (no taxonomy mismatch):
   - **Scientific Modeling & Statistics** — Bayesian inference, dynamical systems, uncertainty quantification. Tools: PyMC, NumPyro, scipy, JAX.
   - **Machine Learning & GenAI** — classical ML and modern LLM/agent stacks. Tools: sklearn, PyTorch, LangGraph, LangSmith, MCP.
   - **Data Engineering & MLOps** — pipelines, orchestration, reproducible workflows. Tools: Python, SQL, Apache Airflow, FastAPI, HPC.
   - **Infrastructure & Cloud** — production-grade deployment. Tools: AWS Bedrock, SageMaker, S3, QuickSight.
   - **Networks, Mobility & Epidemiology** — the applied scientific differentiator. Co-location data, contact patterns, mobility modeling, infectious-disease dynamics.
4. **Selected Publications** — editorial list, newest first.
   - **Default compact format:** number, title (linked to DOI), italic venue, year, and a small role badge: `First author` or `Co-author`. One thin rule between entries.
   - **Expand on click**: full author list (with her name bolded), abstract/snippet, citation copy-link.
   - Includes the existing items plus the three new refs (Epidemics 2026, two medRxiv preprints).
5. **Talks & Presentations** — vertical timeline. Each: title, venue, location, date.
6. **Recent** — 3–5 most recent professional updates (new paper accepted, invited talk, production deployment, consortium milestone). Kept only under an explicit maintenance rule (see §11.3); dropped entirely otherwise.
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

**Publication entries (compact-by-default, expandable)**
- Numbered `01`, `02`, `03…` in tabular figures
- Title in 22px Fraunces; venue in 14px Fraunces italic; year tabular
- Small role badge to the right of the title: `First author` (filled, accent) or `Co-author` (outline, ink). One word, never more.
- Default state: title + venue + year + badge. Nothing else.
- Expanded state (on row click or chevron): full author list with her name bolded, abstract snippet (~280 chars), "Copy citation" link, DOI badge
- Thin `#E6E4DC` rule between entries. Smooth height animation on expand (200ms easeOut, disabled with `prefers-reduced-motion`).

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

**Decision: full migration, archive the Jekyll source on a `legacy-jekyll` branch.** Keeping both stacks on `master` would create ambiguity (which `index.html` is canonical? duplicate assets? confused CI?). Clean separation is worth the small one-time effort.

**Migration plan:**
1. Create branch `legacy-jekyll` from current `master`, push to remote — this preserves every Jekyll file with full history for archaeology.
2. On `master`, delete: `_config.yml`, `_data/`, `_includes/`, `_layouts/`, `Gemfile`, `Appraisals`, `staticman.yml`, `tags.html`, `feed.xml`, `404.html`, `beautiful-jekyll-theme.gemspec`, `aboutme.md`, `publications.md`, `screenshot.png`, `CHANGELOG.md`, the entire `assets/` tree (theme files plus stale CVs — current CVs live on `origin/gh-pages`), the existing `index.html`, and any old `.github/workflows/` if Jekyll-specific. Keep `LICENSE`, `.gitignore`, `.gitattributes`, and `README.md` (which we'll rewrite). Keep `docs/superpowers/specs/`.
3. Copy the *current* assets from `origin/gh-pages` into the new `public/` folder: `Alejandra_Rincon_CV.pdf`, `Academic_CV.pdf`, the portrait `photo-CPWyJsTQ.jpeg`, and `favicon.svg`. (The master `assets/img/IMG_4608.jpeg` and `arinconh_CV.pdf` are older versions and intentionally not migrated.)
4. Scaffold the new project into the now-empty `master` root.

**Target layout on `master` after migration:**

```
arinconh.github.io/
├── src/
│   ├── components/         # Hero, About, Expertise, Publications, Talks, Recent, Footer
│   ├── content/            # publications.ts, talks.ts, expertise.ts, recent.ts, bio.ts
│   ├── styles/             # tailwind.css, fonts.css
│   ├── App.tsx
│   └── main.tsx
├── public/                 # PDFs (Alejandra_Rincon_CV, Academic_CV), portrait, favicon
├── docs/superpowers/specs/ # design spec lives here
├── .github/workflows/deploy.yml
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md               # rewritten: project overview, dev/build/deploy instructions
├── LICENSE
├── .gitignore
└── .gitattributes
```

The Vite project sits at the repo root rather than under `site/` — this is the standard layout for a `<user>.github.io` repo and avoids any future "which directory is the site?" confusion.

## 7. Deployment

**GitHub Action** (`.github/workflows/deploy.yml`):
- Trigger: push to `master`
- Steps: checkout → setup-node 20 → `npm ci` → `npm run build` → publish `dist/` to `gh-pages` branch using `peaceiris/actions-gh-pages`

This means: the user pushes a change on `master`, GitHub builds it, the new `gh-pages` content goes live in ~60s. No local Node installation required for day-to-day content edits.

**Local dev** (optional, for visual changes): `npm install && npm run dev` — opens at `http://localhost:5173`.

**GitHub Pages setting:** Repository Settings → Pages → Source must remain set to "Deploy from branch: `gh-pages` / root". The Action writes there; Pages serves it. The README will document this so a future contributor doesn't accidentally switch the source.

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

1. **Accent color** — proposing muted sage `#6B6E45`. Alternatives if you'd prefer: warm terracotta `#B05B3B`, deep ink blue `#1E3A5F`.
2. **Portrait** — reuse existing (`photo-CPWyJsTQ.jpeg` from current `gh-pages`), or upload a new editorial portrait?
3. **"Recent" section — keep with discipline, or drop?**
   If kept, the operational rule baked into the design is: max 5 items, minimum refresh every 6–8 weeks, items must reflect real momentum (paper accepted, invited talk, production deployment, consortium milestone — not generic activity). The data file will carry a `lastReviewed` date and the build will surface a warning in the GitHub Action log if it's been > 8 weeks since the last review. If you don't want this overhead, we drop the section entirely and let Publications + Talks carry recency implicitly.
4. **Drop "Blog Coming Soon"** — confirm OK?
5. **Hero positioning line** — three drafts to choose from (or use as starting point for your own):
   - "Mathematically grounded modeling of networks, mobility, and infectious disease — and the GenAI systems built around them."
   - "I build probabilistic models and AI systems for problems where uncertainty is the point — mobility, epidemiology, and human networks."
   - "Bayesian modeling, network science, and applied GenAI — from research to production."
