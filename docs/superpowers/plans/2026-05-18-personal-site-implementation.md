# Personal Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React/Vite landing page at `arinconh.github.io` with a new editorial-style personal site ("Studio Folio") built fresh in this repo on the `master` branch, deployed to `gh-pages` via GitHub Actions.

**Architecture:** Single-page React app rendered as static HTML by Vite, no client-side router. Content lives in typed TypeScript data files so updates are diff-able. Old Jekyll source is archived on a `legacy-jekyll` branch before being removed from `master`. The current live Vite bundle on `gh-pages` is replaced wholesale by the new build output via a GitHub Actions workflow.

**Tech Stack:** Vite 6, React 18, TypeScript 5, Tailwind CSS 4 (CSS-first config), Framer Motion 11, react-helmet-async 2, Vitest 2 + @testing-library/react for tests. Fonts: Fraunces (variable serif, display) + Inter Tight (sans, UI/body), self-hosted via Fontsource.

**Locked decisions (defaults from spec §11):**
- Accent color: muted sage `#6B6E45`
- Portrait: reuse `photo-CPWyJsTQ.jpeg` from current `gh-pages`
- Recent section: **kept** with the discipline rule (max 5 items, 6–8 week refresh, momentum-only) — build-time staleness check warns when `lastReviewed` > 56 days
- "Blog Coming Soon": dropped
- Hero positioning line: *"Mathematically grounded modeling of networks, mobility, and infectious disease — and the GenAI systems built around them."*

If the user wants to change any of these after launch, edit the relevant content file.

---

## File Structure

After migration, `master` looks like this (deletions from old Jekyll layout, then additions):

```
arinconh.github.io/
├── .github/workflows/
│   └── deploy.yml                NEW — build + push dist/ to gh-pages
├── docs/superpowers/             KEEP — spec + this plan
├── public/
│   ├── Alejandra_Rincon_CV.pdf   NEW — copied from origin/gh-pages
│   ├── Academic_CV.pdf           NEW — copied from origin/gh-pages
│   ├── portrait.jpg              NEW — renamed from photo-CPWyJsTQ.jpeg
│   └── favicon.svg               NEW — copied from origin/gh-pages
├── scripts/
│   └── check-recent-freshness.ts NEW — fails CI if Recent is stale
├── src/
│   ├── components/
│   │   ├── Hero.tsx              NEW
│   │   ├── About.tsx             NEW
│   │   ├── Expertise.tsx         NEW
│   │   ├── PublicationItem.tsx   NEW — single expandable row
│   │   ├── Publications.tsx      NEW — section wrapper
│   │   ├── Talks.tsx             NEW
│   │   ├── Recent.tsx            NEW
│   │   ├── Languages.tsx         NEW
│   │   ├── Footer.tsx            NEW
│   │   ├── Nav.tsx               NEW — top nav + language switcher
│   │   └── primitives/
│   │       ├── Container.tsx     NEW
│   │       ├── Section.tsx       NEW
│   │       └── SectionLabel.tsx  NEW
│   ├── content/
│   │   ├── types.ts              NEW — shared TS interfaces
│   │   ├── bio.ts                NEW
│   │   ├── expertise.ts          NEW
│   │   ├── publications.ts       NEW
│   │   ├── talks.ts              NEW
│   │   └── recent.ts             NEW
│   ├── styles/
│   │   ├── globals.css           NEW — Tailwind 4 + tokens + base
│   │   └── fonts.css             NEW — @import Fontsource
│   ├── App.tsx                   NEW
│   └── main.tsx                  NEW
├── tests/
│   ├── PublicationItem.test.tsx  NEW
│   ├── Publications.test.tsx     NEW
│   ├── Recent.test.tsx           NEW
│   └── check-recent-freshness.test.ts  NEW
├── index.html                    NEW — Vite entry
├── vite.config.ts                NEW
├── tsconfig.json                 NEW
├── tsconfig.node.json            NEW
├── package.json                  NEW
├── README.md                     REWRITE — project overview, dev/build/deploy
├── LICENSE                       KEEP
├── .gitignore                    REWRITE — Node + Vite
├── .gitattributes                KEEP
└── (everything Jekyll → deleted: see Task 2)
```

The `gh-pages` branch is rewritten by every successful deploy; we never edit it directly.

---

## Phase 1 — Archive Jekyll & Strip Master

### Task 1: Archive Jekyll source on `legacy-jekyll` branch

**Files:** No source edits; pure git operation.

- [ ] **Step 1: Verify clean working tree**

```bash
git status
```
Expected: `nothing to commit, working tree clean` on `master`.

- [ ] **Step 2: Create legacy-jekyll branch from master**

```bash
git branch legacy-jekyll master
git push -u origin legacy-jekyll
```
Expected: `* [new branch]      legacy-jekyll -> legacy-jekyll`.

- [ ] **Step 3: Verify the archive branch exists on remote**

```bash
git ls-remote --heads origin legacy-jekyll
```
Expected: a single SHA matching local `master`.

- [ ] **Step 4: Confirm nothing else needs doing — no commit**

The legacy branch is now durable. No commit on `master` yet.

---

### Task 2: Strip Jekyll from `master`, migrate live assets

**Files:**
- Delete on `master`: `_config.yml`, `_data/`, `_includes/`, `_layouts/`, `Gemfile`, `Appraisals`, `staticman.yml`, `tags.html`, `feed.xml`, `404.html`, `beautiful-jekyll-theme.gemspec`, `aboutme.md`, `publications.md`, `screenshot.png`, `CHANGELOG.md`, `assets/`, `index.html`, `.DS_Store` (and any nested), and `.github/workflows/` if any pre-exist (none currently).
- Create: `public/` with files pulled from `origin/gh-pages`.
- Keep: `LICENSE`, `.gitignore` (rewritten in Task 3), `.gitattributes`, `docs/`, `.github/` directory itself (workflow added in Task 22), `README.md` (rewritten in Task 23).

- [ ] **Step 1: Delete Jekyll files**

```bash
git rm -r _config.yml _data _includes _layouts Gemfile Appraisals \
  staticman.yml tags.html feed.xml 404.html \
  beautiful-jekyll-theme.gemspec aboutme.md publications.md \
  screenshot.png CHANGELOG.md assets index.html
find . -name ".DS_Store" -delete
git status
```
Expected: all listed paths shown as deleted, `.DS_Store` no longer present.

- [ ] **Step 2: Pull live assets from origin/gh-pages into public/**

```bash
mkdir -p public
git show origin/gh-pages:Alejandra_Rincon_CV.pdf > public/Alejandra_Rincon_CV.pdf
git show origin/gh-pages:Academic_CV.pdf > public/Academic_CV.pdf
git show origin/gh-pages:assets/photo-CPWyJsTQ.jpeg > public/portrait.jpg
git show origin/gh-pages:favicon.svg > public/favicon.svg
ls -la public/
```
Expected: four files present, non-zero sizes (`Alejandra_Rincon_CV.pdf` ≈ 68 KB, `Academic_CV.pdf` ≈ 103 KB, `portrait.jpg` ≈ 2.2 MB, `favicon.svg` ≈ 288 B).

- [ ] **Step 3: Commit migration**

```bash
git add public/
git commit -m "$(cat <<'EOF'
Archive Jekyll, migrate live assets to public/

Jekyll source preserved on legacy-jekyll branch. Master is now empty
of Jekyll files and seeded with the CVs, portrait, and favicon pulled
from the live gh-pages deployment, ready for the Vite scaffold.
EOF
)"
```

---

## Phase 2 — Vite + React + TypeScript + Tailwind Scaffold

### Task 3: Scaffold Vite + React + TypeScript project at repo root

**Files:** Create `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.gitignore`.

- [ ] **Step 1: Write `package.json`**

Create `package.json`:
```json
{
  "name": "arinconh-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "check:recent": "tsx scripts/check-recent-freshness.ts"
  },
  "dependencies": {
    "@fontsource-variable/fraunces": "^5.1.0",
    "@fontsource-variable/inter-tight": "^5.1.0",
    "framer-motion": "^11.11.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-helmet-async": "^2.0.5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "tailwindcss": "^4.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Write `.gitignore`**

Create `.gitignore`:
```
node_modules/
dist/
.DS_Store
*.log
.vite/
coverage/
```

- [ ] **Step 3: Write `vite.config.ts`**

Create `vite.config.ts`:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
```

- [ ] **Step 4: Write `tsconfig.json`**

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests", "scripts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Write `tsconfig.node.json`**

Create `tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Write `index.html`**

Create `index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#FAFAF7" />
    <title>Alejandra Rincón Hidalgo — Senior Data Scientist</title>
    <meta name="description" content="Senior Data Scientist · PhD in Mathematics. Mathematically grounded modeling of networks, mobility, and infectious disease — and the GenAI systems built around them." />
  </head>
  <body class="bg-paper text-ink antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Write `src/main.tsx`**

Create `src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
```

- [ ] **Step 8: Write minimal `src/App.tsx`**

Create `src/App.tsx`:
```tsx
export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-serif text-2xl">Scaffold ready.</p>
    </main>
  );
}
```

- [ ] **Step 9: Install dependencies**

```bash
npm install
```
Expected: success, `node_modules/` populated, `package-lock.json` created.

- [ ] **Step 10: Commit scaffold**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json \
  tsconfig.node.json index.html src/main.tsx src/App.tsx .gitignore
git commit -m "Scaffold Vite + React + TS project"
```

---

### Task 4: Tailwind 4 with design tokens + fonts

**Files:** Create `src/styles/globals.css`, `src/styles/fonts.css`.

- [ ] **Step 1: Write `src/styles/fonts.css`**

Create `src/styles/fonts.css`:
```css
@import "@fontsource-variable/fraunces/index.css";
@import "@fontsource-variable/fraunces/wght-italic.css";
@import "@fontsource-variable/inter-tight/index.css";
```

- [ ] **Step 2: Write `src/styles/globals.css` with Tailwind 4 CSS-first config**

Create `src/styles/globals.css`:
```css
@import "./fonts.css";
@import "tailwindcss";

@theme {
  --color-paper: #fafaf7;
  --color-paper-pure: #ffffff;
  --color-ink: #0a0a0a;
  --color-ink-soft: #4a4a4a;
  --color-rule: #e6e4dc;
  --color-accent: #6b6e45;
  --color-accent-soft: #8d9061;

  --font-serif: "Fraunces Variable", Georgia, serif;
  --font-sans: "Inter Tight Variable", system-ui, sans-serif;

  --text-display: clamp(3rem, 8vw, 6rem);
  --text-h1: clamp(2rem, 5vw, 3.5rem);
  --text-h2: clamp(1.5rem, 3vw, 2.25rem);
  --text-h3: 1.375rem;
  --text-label: 0.75rem;

  --spacing-section: clamp(3rem, 8vw, 6rem);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  body {
    font-family: var(--font-sans);
    font-feature-settings: "ss01", "cv11";
  }

  .font-serif,
  h1,
  h2,
  h3,
  .display {
    font-family: var(--font-serif);
    font-feature-settings: "ss01";
  }

  ::selection {
    background: var(--color-accent);
    color: var(--color-paper);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
    border-radius: 2px;
  }
}

@layer utilities {
  .text-tabular {
    font-variant-numeric: tabular-nums;
  }
  .rule-top {
    border-top: 1px solid var(--color-rule);
  }
  .rule-bottom {
    border-bottom: 1px solid var(--color-rule);
  }
}
```

- [ ] **Step 3: Verify dev server boots and styles apply**

```bash
npm run dev &
sleep 3
curl -s http://localhost:5173 | head -20
kill %1
```
Expected: HTML containing `<div id="root"></div>` is served. Then in browser: navigate to `http://localhost:5173`, see "Scaffold ready." in serif, off-white background.

- [ ] **Step 4: Commit Tailwind + tokens**

```bash
git add src/styles/
git commit -m "Add Tailwind 4 theme tokens, fonts, base styles"
```

---

## Phase 3 — Content Types and Data

### Task 5: Content type definitions

**Files:** Create `src/content/types.ts`.

- [ ] **Step 1: Write `src/content/types.ts`**

Create `src/content/types.ts`:
```ts
export type AuthorRole = "first" | "co";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  selfIndex: number;
  role: AuthorRole;
  venue: string;
  venueDetail?: string;
  year: number;
  doi?: string;
  url: string;
  abstract?: string;
}

export interface Talk {
  id: string;
  title: string;
  venue: string;
  location: string;
  date: string;
}

export interface ExpertiseArea {
  id: string;
  title: string;
  description: string;
  tools: string[];
}

export interface RecentItem {
  id: string;
  date: string;
  label: string;
  description: string;
  link?: { href: string; text: string };
}

export interface RecentFeed {
  lastReviewed: string;
  items: RecentItem[];
}

export interface Bio {
  name: string;
  role: string;
  positioning: string;
  location: string;
  languages: string[];
  about: string[];
  social: {
    linkedin: string;
    twitter: string;
    email: string;
  };
  cvs: {
    dataScience: { href: string; label: string };
    mathematics: { href: string; label: string };
  };
}
```

- [ ] **Step 2: Commit types**

```bash
git add src/content/types.ts
git commit -m "Add content type definitions"
```

---

### Task 6: Bio, expertise, talks, recent content

**Files:** Create `src/content/bio.ts`, `src/content/expertise.ts`, `src/content/talks.ts`, `src/content/recent.ts`.

- [ ] **Step 1: Write `src/content/bio.ts`**

Create `src/content/bio.ts`:
```ts
import type { Bio } from "./types";

export const bio: Bio = {
  name: "Alejandra Rincón Hidalgo",
  role: "Senior Data Scientist · PhD in Mathematics",
  positioning:
    "Mathematically grounded modeling of networks, mobility, and infectious disease — and the GenAI systems built around them.",
  location: "Berlin, Germany",
  languages: ["English", "Spanish"],
  about: [
    "I am a Senior Data Scientist at NET CHECK in Berlin, with a PhD in Mathematics. My work sits at the intersection of probabilistic modeling, network science, and modern AI systems — translating mathematical structure into decisions that hold up under uncertainty.",
    "In recent years that has meant inferring biological fitness of pathogens from mobility data, comparing empirical contact surveys against agent-based simulations, and shipping GenAI pipelines on AWS. I move comfortably between research questions and production constraints.",
    "Currently open to senior roles where rigor and pragmatism are both expected.",
  ],
  social: {
    linkedin: "https://www.linkedin.com/in/arinconh",
    twitter: "https://twitter.com/arinconh",
    email: "mailto:alrinconh@gmail.com",
  },
  cvs: {
    dataScience: { href: "/Alejandra_Rincon_CV.pdf", label: "Download CV (Data Science)" },
    mathematics: { href: "/Academic_CV.pdf", label: "Download CV (Academic)" },
  },
};
```

- [ ] **Step 2: Write `src/content/expertise.ts`**

Create `src/content/expertise.ts`:
```ts
import type { ExpertiseArea } from "./types";

export const expertise: ExpertiseArea[] = [
  {
    id: "scientific-modeling",
    title: "Scientific Modeling & Statistics",
    description:
      "Bayesian inference, dynamical systems, and uncertainty quantification for problems where the model matters as much as the data.",
    tools: ["PyMC", "NumPyro", "JAX", "scipy", "Stan"],
  },
  {
    id: "ml-genai",
    title: "Machine Learning & GenAI",
    description:
      "Classical ML and modern LLM / agent stacks, from prototypes to deployed retrieval and reasoning systems.",
    tools: ["PyTorch", "scikit-learn", "LangGraph", "LangSmith", "MCP"],
  },
  {
    id: "data-engineering",
    title: "Data Engineering & MLOps",
    description:
      "Reproducible pipelines, orchestration, and APIs that turn one-off analyses into systems the team can run on Monday morning.",
    tools: ["Python", "SQL", "Apache Airflow", "FastAPI", "HPC"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure & Cloud",
    description:
      "Production-grade deployment on managed AWS services, with cost and observability built in from the start.",
    tools: ["AWS Bedrock", "SageMaker", "S3", "QuickSight", "Docker"],
  },
  {
    id: "networks-mobility-epi",
    title: "Networks, Mobility & Epidemiology",
    description:
      "Applied scientific differentiator: co-location and contact data, mobility patterns, and infectious-disease dynamics at population scale.",
    tools: ["NetworkX", "EpiModel", "GPS co-location", "Agent-based models"],
  },
];
```

- [ ] **Step 3: Write `src/content/talks.ts`**

Create `src/content/talks.ts`:
```ts
import type { Talk } from "./types";

export const talks: Talk[] = [
  {
    id: "netmob-2024",
    title: "Urban Segregation and Daily Human Mobility Patterns in Berlin",
    venue: "NetMob 2024",
    location: "Washington, D.C., USA",
    date: "2024-10",
  },
];
```

- [ ] **Step 4: Write `src/content/recent.ts`**

Create `src/content/recent.ts`:
```ts
import type { RecentFeed } from "./types";

export const recent: RecentFeed = {
  lastReviewed: "2026-05-18",
  items: [
    {
      id: "epidemics-2026",
      date: "2026-03",
      label: "Paper published",
      description:
        "Social contact patterns from epidemiological survey vs. GPS co-location — out in Epidemics.",
      link: {
        href: "https://doi.org/10.1016/j.epidem.2026.100886",
        text: "Read",
      },
    },
    {
      id: "medrxiv-fitness-2026",
      date: "2026-03",
      label: "Preprint",
      description:
        "Inferring respiratory disease biology from geolocation data — first-author preprint on medRxiv.",
      link: {
        href: "https://doi.org/10.64898/2026.03.05.26347578",
        text: "Read",
      },
    },
  ],
};
```

- [ ] **Step 5: Commit content**

```bash
git add src/content/bio.ts src/content/expertise.ts src/content/talks.ts src/content/recent.ts
git commit -m "Add bio, expertise, talks, recent content"
```

---

### Task 7: Publications content with verified citations

**Files:** Create `src/content/publications.ts`.

**Context for the engineer:** The three new publications are verified against CrossRef and medRxiv. The three older publications (Bridgeland triples, K3 surfaces, Berlin mobility) were extracted from the live bundle and require CrossRef confirmation of author lists / venue details. If a CrossRef lookup produces conflicting metadata, use the CrossRef version and flag in the commit message.

- [ ] **Step 1: Verify CrossRef metadata for older publications**

```bash
curl -s "https://api.crossref.org/works?query.author=Rincon+Hidalgo&query.title=Bridgeland&rows=3" | \
  python3 -c "import sys,json; d=json.load(sys.stdin); [print(json.dumps({'title':i.get('title',[''])[0],'authors':[a.get('given','')+' '+a.get('family','') for a in i.get('author',[])],'container':i.get('container-title',[''])[0],'volume':i.get('volume'),'issue':i.get('issue'),'page':i.get('page'),'year':i.get('published',{}).get('date-parts',[[None]])[0][0],'DOI':i.get('DOI')}, indent=2)) for i in d['message']['items']]"
```

Save the resulting metadata; use it verbatim below where placeholder values appear in the next step. If CrossRef returns no hit for an older title, search by DOI if known, otherwise mark `doi: undefined` and `url` pointing to the most authoritative landing page available.

- [ ] **Step 2: Write `src/content/publications.ts`**

Create `src/content/publications.ts`:
```ts
import type { Publication } from "./types";

export const publications: Publication[] = [
  {
    id: "medrxiv-fitness-2026",
    title: "Inferring Respiratory Disease Biology from Geolocation Data",
    authors: [
      "Alejandra Rincón Hidalgo",
      "Andrzej K. Jarynowski",
      "Marlli Zambrano",
      "Philip El-Duah",
      "Janik Suer",
      "Ashish Thampi",
      "Richard Pastor",
      "Huynh Thi Phuong",
      "Sten Rüdiger",
      "Stephan Ludwig",
      "Rafael Mikolajczyk",
      "Christian Drosten",
      "Veronika K. Jäger",
      "André Karch",
    ],
    selfIndex: 0,
    role: "first",
    venue: "medRxiv",
    year: 2026,
    doi: "10.64898/2026.03.05.26347578",
    url: "https://doi.org/10.64898/2026.03.05.26347578",
    abstract:
      "We propose an approach that infers biological fitness from mostly non-biological data on infection dynamics and contact levels in a population, applied to SARS-CoV-2 in Germany.",
  },
  {
    id: "epidemics-2026",
    title:
      "Social contact patterns derived from an epidemiological survey and GPS-based co-location data — A systematic comparison using parallel data collections during the COVID-19 pandemic in Germany",
    authors: [
      "Huynh Thi Phuong",
      "Janik Suer",
      "Vitaly Belik",
      "Alejandra Rincón Hidalgo",
      "Andrzej K. Jarynowski",
      "Richard Pastor",
      "Steven Schulz",
      "Ashish Thampi",
      "Chao Xu",
      "Marlli Zambrano",
      "Rafael Mikolajczyk",
      "André Karch",
      "Veronika K. Jaeger",
    ],
    selfIndex: 3,
    role: "co",
    venue: "Epidemics",
    venueDetail: "Vol. 54, 100886",
    year: 2026,
    doi: "10.1016/j.epidem.2026.100886",
    url: "https://doi.org/10.1016/j.epidem.2026.100886",
  },
  {
    id: "medrxiv-abm-2025",
    title:
      "A comparison of random mixing in a structured agent-based model with empirical contact survey data",
    authors: [
      "Janik Suer",
      "Johannes Ponge",
      "Michael Brüggemann",
      "Jan Pablo Burgard",
      "Vitaly Belik",
      "Bernd Hellingrath",
      "Alejandra Rincón Hidalgo",
      "Andrzej K. Jarynowski",
      "Richard Pastor",
      "Huynh Thi Phuong",
      "Steven Schulz",
      "Ashish Thampi",
      "Chao Xu",
      "Marlli Zambrano",
      "Rafael Mikolajczyk",
      "André Karch",
      "Veronika K. Jaeger",
    ],
    selfIndex: 6,
    role: "co",
    venue: "medRxiv",
    year: 2025,
    doi: "10.1101/2025.09.18.25336044",
    url: "https://doi.org/10.1101/2025.09.18.25336044",
  },
  {
    id: "berlin-mobility-2025",
    title: "Urban Segregation and Daily Human Mobility Patterns in Berlin",
    authors: ["Alejandra Rincón Hidalgo"],
    selfIndex: 0,
    role: "co",
    venue: "International Journal of Infectious Diseases",
    venueDetail: "Vol. 152, Supplement, March 2025",
    year: 2025,
    url: "https://www.ijidonline.com/",
  },
  {
    id: "k3-surfaces",
    title:
      "Non-symplectic Automorphisms of Order Multiple of Seven on K3 Surfaces",
    authors: ["Alejandra Rincón Hidalgo"],
    selfIndex: 0,
    role: "first",
    venue: "Doctoral thesis / preprint",
    year: 2020,
    url: "https://arxiv.org/",
  },
  {
    id: "bridgeland-triples",
    title:
      "Moduli of Bridgeland Semistable Holomorphic Triples on Curves",
    authors: ["Alejandra Rincón Hidalgo"],
    selfIndex: 0,
    role: "first",
    venue: "Journal of Pure and Applied Algebra",
    year: 2019,
    url: "https://www.sciencedirect.com/journal/journal-of-pure-and-applied-algebra",
  },
];
```

**Note for the implementer:** The author lists and exact DOIs for the last three entries were not available in the live bundle and may need refinement after a CrossRef lookup (Step 1 above). Replace `authors: ["Alejandra Rincón Hidalgo"]` with the full co-author list returned by CrossRef. Update `url` and `doi` if better data is found. Keep `selfIndex` aligned with her position in the corrected list.

- [ ] **Step 3: Commit publications**

```bash
git add src/content/publications.ts
git commit -m "Add publications content with three new references"
```

---

## Phase 4 — Components

### Task 8: Layout primitives

**Files:** Create `src/components/primitives/Container.tsx`, `src/components/primitives/Section.tsx`, `src/components/primitives/SectionLabel.tsx`.

- [ ] **Step 1: Write `Container.tsx`**

Create `src/components/primitives/Container.tsx`:
```tsx
import type { PropsWithChildren, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: "default" | "narrow" | "wide";
}

const widthClass = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  width = "default",
  className = "",
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`mx-auto px-6 md:px-10 ${widthClass[width]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Write `SectionLabel.tsx`**

Create `src/components/primitives/SectionLabel.tsx`:
```tsx
interface Props {
  index: string;
  label: string;
}

export function SectionLabel({ index, label }: Props) {
  return (
    <div className="flex items-baseline gap-3 text-label uppercase tracking-[0.18em] text-ink-soft text-tabular">
      <span className="text-accent">{index}</span>
      <span aria-hidden className="h-px w-6 bg-rule" />
      <span>{label}</span>
    </div>
  );
}
```

- [ ] **Step 3: Write `Section.tsx`**

Create `src/components/primitives/Section.tsx`:
```tsx
import type { PropsWithChildren } from "react";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";

interface Props {
  id: string;
  index: string;
  label: string;
  title?: string;
  width?: "default" | "narrow" | "wide";
  alt?: boolean;
}

export function Section({
  id,
  index,
  label,
  title,
  width = "default",
  alt = false,
  children,
}: PropsWithChildren<Props>) {
  return (
    <section
      id={id}
      className={`py-section ${alt ? "bg-paper" : "bg-paper-pure"}`}
    >
      <Container width={width}>
        <div className="mb-12 md:mb-16 space-y-6">
          <SectionLabel index={index} label={label} />
          {title && (
            <h2 className="font-serif text-h2 leading-[1.05] tracking-[-0.01em]">
              {title}
            </h2>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Commit primitives**

```bash
git add src/components/primitives/
git commit -m "Add Container, Section, SectionLabel primitives"
```

---

### Task 9: Hero component

**Files:** Create `src/components/Hero.tsx`.

- [ ] **Step 1: Write `Hero.tsx`**

Create `src/components/Hero.tsx`:
```tsx
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
                fetchPriority="high"
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
```

- [ ] **Step 2: Wire Hero into App.tsx**

Replace `src/App.tsx`:
```tsx
import { Hero } from "./components/Hero";

export default function App() {
  return (
    <>
      <Hero />
    </>
  );
}
```

- [ ] **Step 3: Visual verify**

```bash
npm run dev &
sleep 3
```
Open `http://localhost:5173`. Confirm: serif display name, italic role line, positioning paragraph, two CTAs, portrait at right, off-white background, ample whitespace, no console errors. Kill server: `kill %1`.

- [ ] **Step 4: Commit Hero**

```bash
git add src/components/Hero.tsx src/App.tsx
git commit -m "Add Hero component"
```

---

### Task 10: About component

**Files:** Create `src/components/About.tsx`.

- [ ] **Step 1: Write `About.tsx`**

Create `src/components/About.tsx`:
```tsx
import { motion } from "framer-motion";
import { bio } from "../content/bio";
import { Section } from "./primitives/Section";

export function About() {
  return (
    <Section id="about" index="02" label="About" alt>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-12 gap-6 md:gap-10"
      >
        <div className="col-span-12 md:col-span-5">
          <p className="font-serif text-h2 leading-[1.1] tracking-[-0.01em] text-balance">
            Senior Data Scientist working where probabilistic modeling meets production systems.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7 space-y-5 text-ink leading-relaxed">
          {bio.about.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
```

- [ ] **Step 2: Wire About into App.tsx**

Replace `src/App.tsx`:
```tsx
import { Hero } from "./components/Hero";
import { About } from "./components/About";

export default function App() {
  return (
    <>
      <Hero />
      <About />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx src/App.tsx
git commit -m "Add About section"
```

---

### Task 11: Expertise component

**Files:** Create `src/components/Expertise.tsx`.

- [ ] **Step 1: Write `Expertise.tsx`**

Create `src/components/Expertise.tsx`:
```tsx
import { motion } from "framer-motion";
import { expertise } from "../content/expertise";
import { Section } from "./primitives/Section";

export function Expertise() {
  return (
    <Section id="expertise" index="03" label="Expertise" title="Five areas, one common backbone.">
      <div className="grid grid-cols-12 gap-6 md:gap-8">
        {expertise.map((area, i) => (
          <motion.article
            key={area.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 md:col-span-6 lg:col-span-4 rule-top pt-6 group"
          >
            <h3 className="font-serif text-h3 leading-tight mb-3 group-hover:text-accent transition-colors">
              {area.title}
            </h3>
            <p className="text-ink-soft leading-relaxed mb-5 text-sm md:text-base">
              {area.description}
            </p>
            <ul className="flex flex-wrap gap-2">
              {area.tools.map((tool) => (
                <li
                  key={tool}
                  className="text-label uppercase tracking-[0.12em] text-ink-soft border border-rule px-2.5 py-1 text-tabular"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Wire into App.tsx**

Replace `src/App.tsx`:
```tsx
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";

export default function App() {
  return (
    <>
      <Hero />
      <About />
      <Expertise />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Expertise.tsx src/App.tsx
git commit -m "Add Expertise section with 5 cards"
```

---

### Task 12: PublicationItem with compact-by-default + expand (TDD)

**Files:** Create `src/components/PublicationItem.tsx`, `tests/setup.ts`, `tests/PublicationItem.test.tsx`.

- [ ] **Step 1: Write test setup**

Create `tests/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write the failing test**

Create `tests/PublicationItem.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PublicationItem } from "../src/components/PublicationItem";
import type { Publication } from "../src/content/types";

const fixture: Publication = {
  id: "test-pub",
  title: "A Test Paper",
  authors: ["First Author", "Alejandra Rincón Hidalgo", "Third Author"],
  selfIndex: 1,
  role: "co",
  venue: "Test Journal",
  year: 2026,
  doi: "10.0000/test",
  url: "https://example.com/test",
  abstract: "A short abstract for testing expansion behavior.",
};

describe("PublicationItem", () => {
  it("renders title, venue, year, role badge in compact view", () => {
    render(<PublicationItem index={1} pub={fixture} />);
    expect(screen.getByRole("link", { name: /A Test Paper/i })).toHaveAttribute("href", fixture.url);
    expect(screen.getByText(/Test Journal/i)).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText(/Co-author/i)).toBeInTheDocument();
  });

  it("hides author list and abstract by default", () => {
    render(<PublicationItem index={1} pub={fixture} />);
    expect(screen.queryByText("Third Author")).not.toBeInTheDocument();
    expect(screen.queryByText(/short abstract for testing/i)).not.toBeInTheDocument();
  });

  it("expands to show full authors with self bolded and abstract on click", async () => {
    const user = userEvent.setup();
    render(<PublicationItem index={1} pub={fixture} />);
    await user.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByText("Third Author")).toBeInTheDocument();
    const self = screen.getByText("Alejandra Rincón Hidalgo");
    expect(self.tagName).toBe("STRONG");
    expect(screen.getByText(/short abstract for testing/i)).toBeInTheDocument();
  });

  it("shows 'First author' badge filled with accent when role is first", () => {
    render(<PublicationItem index={1} pub={{ ...fixture, role: "first" }} />);
    const badge = screen.getByText(/First author/i);
    expect(badge).toHaveClass("bg-accent");
  });
});
```

- [ ] **Step 3: Run test, verify it fails**

```bash
npx vitest run tests/PublicationItem.test.tsx
```
Expected: 4 failing tests with "Cannot find module '../src/components/PublicationItem'".

- [ ] **Step 4: Implement `PublicationItem.tsx`**

Create `src/components/PublicationItem.tsx`:
```tsx
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
                {pub.doi && (
                  <p>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-tabular">
                      doi:{pub.doi}
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
```

- [ ] **Step 5: Run tests, verify they pass**

```bash
npx vitest run tests/PublicationItem.test.tsx
```
Expected: 4 passing tests.

- [ ] **Step 6: Commit**

```bash
git add tests/setup.ts tests/PublicationItem.test.tsx src/components/PublicationItem.tsx
git commit -m "Add PublicationItem with compact/expand behavior and tests"
```

---

### Task 13: Publications section

**Files:** Create `src/components/Publications.tsx`, `tests/Publications.test.tsx`.

- [ ] **Step 1: Write the test**

Create `tests/Publications.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Publications } from "../src/components/Publications";
import { publications } from "../src/content/publications";

describe("Publications section", () => {
  it("renders every publication", () => {
    render(<Publications />);
    publications.forEach((p) => {
      expect(screen.getByText(p.title, { exact: false })).toBeInTheDocument();
    });
  });

  it("orders publications newest first by year", () => {
    render(<Publications />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent ?? "");
    const years = titles.map((t) => publications.find((p) => p.title === t)?.year ?? 0);
    const sortedDesc = [...years].sort((a, b) => b - a);
    expect(years).toEqual(sortedDesc);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

```bash
npx vitest run tests/Publications.test.tsx
```
Expected: fails — module not found.

- [ ] **Step 3: Implement `Publications.tsx`**

Create `src/components/Publications.tsx`:
```tsx
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
      title="Six entries — newest first."
    >
      <div className="rule-bottom">
        {sorted.map((p, i) => (
          <PublicationItem key={p.id} index={i + 1} pub={p} />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run tests, verify they pass**

```bash
npx vitest run tests/Publications.test.tsx
```
Expected: 2 passing tests.

- [ ] **Step 5: Wire into App.tsx**

Replace `src/App.tsx`:
```tsx
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";

export default function App() {
  return (
    <>
      <Hero />
      <About />
      <Expertise />
      <Publications />
    </>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add tests/Publications.test.tsx src/components/Publications.tsx src/App.tsx
git commit -m "Add Publications section with newest-first ordering"
```

---

### Task 14: Talks component

**Files:** Create `src/components/Talks.tsx`.

- [ ] **Step 1: Write `Talks.tsx`**

Create `src/components/Talks.tsx`:
```tsx
import { motion } from "framer-motion";
import { talks } from "../content/talks";
import { Section } from "./primitives/Section";

function formatDate(iso: string): string {
  const [y, m] = iso.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export function Talks() {
  return (
    <Section id="talks" index="05" label="Talks & Presentations" alt>
      <ol className="space-y-0">
        {talks.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="grid grid-cols-12 gap-4 md:gap-6 py-6 rule-top items-baseline"
          >
            <div className="col-span-12 md:col-span-3 text-label uppercase tracking-[0.12em] text-ink-soft text-tabular">
              {formatDate(t.date)}
            </div>
            <div className="col-span-12 md:col-span-9 space-y-1">
              <h3 className="font-serif text-h3 leading-snug">{t.title}</h3>
              <p className="text-sm text-ink-soft">
                <em className="font-serif">{t.venue}</em> · {t.location}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 2: Wire into App.tsx**

Replace `src/App.tsx`:
```tsx
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";
import { Talks } from "./components/Talks";

export default function App() {
  return (
    <>
      <Hero />
      <About />
      <Expertise />
      <Publications />
      <Talks />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Talks.tsx src/App.tsx
git commit -m "Add Talks section"
```

---

### Task 15: Recent component + build-time staleness check (TDD)

**Files:** Create `src/components/Recent.tsx`, `tests/Recent.test.tsx`, `scripts/check-recent-freshness.ts`, `tests/check-recent-freshness.test.ts`.

- [ ] **Step 1: Write the Recent component test**

Create `tests/Recent.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Recent } from "../src/components/Recent";
import { recent } from "../src/content/recent";

describe("Recent section", () => {
  it("renders all items with date label and description", () => {
    render(<Recent />);
    recent.items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  it("never renders more than 5 items", () => {
    render(<Recent />);
    const headings = screen.getAllByRole("listitem");
    expect(headings.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

```bash
npx vitest run tests/Recent.test.tsx
```
Expected: fails — module not found.

- [ ] **Step 3: Implement `Recent.tsx`**

Create `src/components/Recent.tsx`:
```tsx
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
```

- [ ] **Step 4: Run Recent test, verify pass**

```bash
npx vitest run tests/Recent.test.tsx
```
Expected: 2 passing tests.

- [ ] **Step 5: Write the staleness-check script test**

Create `tests/check-recent-freshness.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { daysSince, isStale, STALENESS_THRESHOLD_DAYS } from "../scripts/check-recent-freshness";

describe("check-recent-freshness", () => {
  it("computes days since a past ISO date", () => {
    const now = new Date("2026-05-18T12:00:00Z");
    expect(daysSince("2026-05-11", now)).toBe(7);
    expect(daysSince("2026-04-18", now)).toBe(30);
  });

  it(`flags stale when lastReviewed older than ${STALENESS_THRESHOLD_DAYS} days`, () => {
    const now = new Date("2026-05-18T12:00:00Z");
    expect(isStale("2026-05-01", now)).toBe(false);
    expect(isStale("2026-03-15", now)).toBe(true);
  });
});
```

- [ ] **Step 6: Run staleness test, verify it fails**

```bash
npx vitest run tests/check-recent-freshness.test.ts
```
Expected: fails — module not found.

- [ ] **Step 7: Implement `scripts/check-recent-freshness.ts`**

Create `scripts/check-recent-freshness.ts`:
```ts
import { recent } from "../src/content/recent";

export const STALENESS_THRESHOLD_DAYS = 56;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysSince(isoDate: string, now: Date = new Date()): number {
  const then = new Date(isoDate + "T00:00:00Z");
  return Math.floor((now.getTime() - then.getTime()) / MS_PER_DAY);
}

export function isStale(isoDate: string, now: Date = new Date()): boolean {
  return daysSince(isoDate, now) > STALENESS_THRESHOLD_DAYS;
}

function main(): void {
  const days = daysSince(recent.lastReviewed);
  if (recent.items.length > 5) {
    console.error(`✗ Recent has ${recent.items.length} items; max is 5.`);
    process.exit(1);
  }
  if (isStale(recent.lastReviewed)) {
    console.warn(
      `⚠ Recent feed is stale: lastReviewed=${recent.lastReviewed} (${days} days ago, threshold ${STALENESS_THRESHOLD_DAYS}).`
    );
    console.warn("   Review src/content/recent.ts and update lastReviewed.");
    process.exit(0);
  }
  console.log(`✓ Recent feed reviewed ${days} days ago.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

- [ ] **Step 8: Run staleness tests, verify pass**

```bash
npx vitest run tests/check-recent-freshness.test.ts
```
Expected: 2 passing tests.

- [ ] **Step 9: Wire Recent into App.tsx**

Replace `src/App.tsx`:
```tsx
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";
import { Talks } from "./components/Talks";
import { Recent } from "./components/Recent";

export default function App() {
  return (
    <>
      <Hero />
      <About />
      <Expertise />
      <Publications />
      <Talks />
      <Recent />
    </>
  );
}
```

- [ ] **Step 10: Verify staleness CLI script runs**

```bash
npm run check:recent
```
Expected: `✓ Recent feed reviewed N days ago.` (where N is small, since `lastReviewed` is `2026-05-18`).

- [ ] **Step 11: Commit**

```bash
git add src/components/Recent.tsx tests/Recent.test.tsx scripts/check-recent-freshness.ts tests/check-recent-freshness.test.ts src/App.tsx
git commit -m "Add Recent section with build-time staleness check"
```

---

### Task 16: Languages + Footer + Nav

**Files:** Create `src/components/Languages.tsx`, `src/components/Footer.tsx`, `src/components/Nav.tsx`.

- [ ] **Step 1: Write `Languages.tsx`**

Create `src/components/Languages.tsx`:
```tsx
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
```

- [ ] **Step 2: Write `Footer.tsx`**

Create `src/components/Footer.tsx`:
```tsx
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
```

- [ ] **Step 3: Write `Nav.tsx`**

Create `src/components/Nav.tsx`:
```tsx
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
```

- [ ] **Step 4: Wire Nav, Languages, Footer into App.tsx**

Replace `src/App.tsx`:
```tsx
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";
import { Talks } from "./components/Talks";
import { Recent } from "./components/Recent";
import { Languages } from "./components/Languages";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Expertise />
      <Publications />
      <Talks />
      <Recent />
      <Languages />
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Visual verify end-to-end**

```bash
npm run dev &
sleep 3
```
Open `http://localhost:5173`. Walk through every section. Check: nav appears, all sections render, click a publication to expand/collapse, CTAs work, footer email is clickable. Kill: `kill %1`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Languages.tsx src/components/Footer.tsx src/components/Nav.tsx src/App.tsx
git commit -m "Add Nav, Languages, Footer; assemble full page"
```

---

## Phase 5 — SEO, Polish, Build

### Task 17: SEO meta tags with react-helmet-async

**Files:** Modify `src/App.tsx`.

- [ ] **Step 1: Add Helmet block to App.tsx**

Replace `src/App.tsx`:
```tsx
import { Helmet } from "react-helmet-async";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { Publications } from "./components/Publications";
import { Talks } from "./components/Talks";
import { Recent } from "./components/Recent";
import { Languages } from "./components/Languages";
import { Footer } from "./components/Footer";
import { bio } from "./content/bio";

export default function App() {
  const description = bio.positioning;
  return (
    <>
      <Helmet>
        <title>{`${bio.name} — Senior Data Scientist`}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${bio.name} — Senior Data Scientist`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/portrait.jpg" />
        <meta property="og:url" content="https://arinconh.github.io/" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://arinconh.github.io/" />
      </Helmet>
      <Nav />
      <Hero />
      <About />
      <Expertise />
      <Publications />
      <Talks />
      <Recent />
      <Languages />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "Add SEO meta tags via react-helmet-async"
```

---

### Task 18: Final test run + build verification

**Files:** None.

- [ ] **Step 1: Run all tests**

```bash
npm run test
```
Expected: all tests pass (PublicationItem 4, Publications 2, Recent 2, check-recent-freshness 2 = 10 total).

- [ ] **Step 2: Run staleness check**

```bash
npm run check:recent
```
Expected: `✓ Recent feed reviewed N days ago.`

- [ ] **Step 3: Production build**

```bash
npm run build
```
Expected: TypeScript clean, Vite outputs `dist/` with `index.html`, hashed `assets/index-XXX.js`, `assets/index-XXX.css`, copied `Alejandra_Rincon_CV.pdf`, `Academic_CV.pdf`, `portrait.jpg`, `favicon.svg`. No errors.

- [ ] **Step 4: Preview the build**

```bash
npm run preview &
sleep 3
curl -s http://localhost:4173 | grep -c "Alejandra"
kill %1
```
Expected: count ≥ 1, no fetch errors.

- [ ] **Step 5: Verify bundle size sanity**

```bash
du -sh dist/assets/*.js dist/assets/*.css
```
Expected: JS < 200 KB uncompressed (≈ 60 KB gzipped target), CSS < 50 KB.

---

## Phase 6 — Deploy

### Task 19: GitHub Actions deploy workflow

**Files:** Create `.github/workflows/deploy.yml`.

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/deploy.yml`:
```yaml
name: Build and deploy

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Recent freshness check
        run: npm run check:recent

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: gh-pages
          publish_dir: ./dist
          force_orphan: true
          user_name: "github-actions[bot]"
          user_email: "github-actions[bot]@users.noreply.github.com"
          commit_message: "deploy: ${{ github.sha }}"
```

- [ ] **Step 2: Commit workflow**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deploy workflow"
```

---

### Task 20: README rewrite

**Files:** Rewrite `README.md`.

- [ ] **Step 1: Replace README.md**

Replace `README.md`:
```markdown
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
```

- [ ] **Step 2: Commit README**

```bash
git add README.md
git commit -m "Rewrite README for new Vite/React site"
```

---

### Task 21: Push and verify deployment

**Files:** None.

- [ ] **Step 1: Push master**

```bash
git push origin master
```
Expected: push succeeds.

- [ ] **Step 2: Watch the workflow**

```bash
gh run watch
```
(If `gh` is not installed, open https://github.com/arinconh/arinconh.github.io/actions in a browser.)
Expected: green checkmark on all steps. Total runtime ≈ 90s.

- [ ] **Step 3: Verify live site**

```bash
curl -sI https://arinconh.github.io/ | head -3
curl -s https://arinconh.github.io/ | grep -o "<title>[^<]*</title>"
```
Expected: HTTP 200 and `<title>Alejandra Rincón Hidalgo — Senior Data Scientist</title>`.

- [ ] **Step 4: Manual smoke check**

Open https://arinconh.github.io/ in a browser. Walk through every section. Test: expand a publication, click a CV download, hover the nav links, scroll all the way to the footer, click the email link. Test on mobile width (devtools responsive ≤ 390px).

- [ ] **Step 5: Final commit / nothing needed if everything passes**

If smoke check passes, you're done. If anything looks wrong, fix in a new commit and push — the workflow republishes automatically.

---

## Self-Review (run after writing this plan)

- **Spec §1 (Goal):** covered in Task 6 (`bio.ts` positioning line) + every component.
- **Spec §3 (Sections):** Hero (Task 9), About (10), Expertise (11), Publications (12+13), Talks (14), Recent (15), Languages (16), Footer (16). All 8 sections accounted for. "Blog Coming Soon" intentionally absent.
- **Spec §4 (Visual System):** type tokens (Task 4), accent sage (Task 4), 12-col grid (used throughout), publication entries compact-by-default (Task 12), reveal-on-scroll motion (Tasks 10/11/14/15), prefers-reduced-motion (Task 4).
- **Spec §5 (Tech Stack):** every dep in `package.json` (Task 3).
- **Spec §6 (Repo layout):** matches Tasks 2+3.
- **Spec §7 (Deploy):** Task 19 (`peaceiris/actions-gh-pages`, force_orphan=true to keep gh-pages clean).
- **Spec §8 (Content migration):** Task 7 includes the three new refs + three old ones (with a flag that older author lists need CrossRef confirmation in Step 1).
- **Spec §9 (Accessibility/perf):** focus-visible ring (Task 4), prefers-reduced-motion (Task 4), `<picture>` recommendation — *gap*: portrait is served as plain `<img>`, not `<picture>` with WebP fallback. Acceptable for v1 (single high-res JPG is widely supported), revisit if Lighthouse asks. Lighthouse target unverified in this plan — recorded in Task 21 manual smoke check.
- **Spec §10 (Out of scope):** plan respects — no blog, no dark mode, no router, no analytics.
- **Spec §11 (Open decisions):** all five resolved at top of this plan.
- **Placeholder scan:** clean — every step has full code or full command; only one explicit follow-up is the CrossRef lookup in Task 7 Step 1, which has a complete command and clear next action.
- **Type consistency:** `Publication.selfIndex`, `Publication.role`, `Bio.cvs.dataScience.href` — used identically across tasks. `RoleBadge` consumes `Publication["role"]`. Section primitive's `index` and `label` props line up with usage in every consumer.
- **Test coverage:** PublicationItem (4 tests), Publications (2), Recent (2), check-recent-freshness (2). Hero/About/Expertise/Talks/Languages/Footer/Nav are visual and covered by the manual smoke check in Task 21 Step 4 — acceptable since they have no branching logic.
