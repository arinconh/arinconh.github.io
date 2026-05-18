# arinconh.github.io

Personal site for Alejandra Rincón Hidalgo — Senior Data Scientist, PhD in Mathematics. Lives at https://arinconh.github.io/.

## Stack

Vite 6 · React 18 · TypeScript 5 · Tailwind CSS 4 · Framer Motion · Fontsource (Fraunces + Inter Tight). Tests: Vitest + Testing Library.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run test         # unit + snapshot tests
npm run check:recent # warns if Recent feed has not been reviewed in 8 weeks
npm run build        # production build into dist/
npm run preview      # serve dist/ for local verification
```

## Editing content

All page content lives in `src/content/`:

| File | What |
|---|---|
| `bio.ts` | Name, role, positioning, location, social, CV links, About paragraphs |
| `expertise.ts` | The five Expertise cards |
| `publications.ts` | Publication list (newest first, ordered automatically by `year`) |
| `talks.ts` | Talks & Presentations |
| `recent.ts` | The "Recent" section — **update `lastReviewed` whenever you touch this file** |

The Recent feed has a discipline rule baked in: max 5 items, every entry must reflect real momentum (paper accepted, invited talk, production deployment, consortium milestone). The build prints a warning if `lastReviewed` is older than 8 weeks.

## Deployment

Every push to `master` triggers `.github/workflows/deploy.yml`, which runs tests, builds the site, and publishes `dist/` to the `gh-pages` branch. GitHub Pages must be configured to serve from `gh-pages` (Settings → Pages → Source).

## Branches

- `master` — Vite + React source. The canonical branch.
- `gh-pages` — built output (auto-managed; do not edit directly).
- `legacy-jekyll` — archived snapshot of the previous beautiful-jekyll site, kept for reference only.

## License

See `LICENSE`.
