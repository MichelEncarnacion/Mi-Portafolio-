# Phase 4: Polish, SEO & Deploy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add SEO meta tags, sitemap, robots.txt, image optimization, responsive polish, and ensure the project builds cleanly for Vercel deployment.

**Architecture:** Astro handles SEO natively with dynamic meta tags in Layout. Sitemap uses `@astrojs/sitemap`. Images use Astro's `<Image>` component. Final pass ensures Lighthouse 95+ scores.

**Tech Stack:** Astro 5, @astrojs/sitemap

**Depends on:** Phase 1, 2, and 3 complete

---

### Task 1: SEO Meta Tags

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Enhance Layout.astro with full SEO meta tags**

Update `src/layouts/Layout.astro` to include Open Graph, Twitter cards, structured data:

```astro
---
interface Props {
  title?: string;
  description?: string;
  lang?: string;
  ogImage?: string;
}

const {
  title = 'Michel Encarnación — Software Developer',
  description = 'Portfolio of Michel Encarnación Dionicio — Software Engineering Student & Full-Stack Developer',
  lang = 'en',
  ogImage = '/favicon.svg'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site || 'https://michelencarnacion.dev');
---

<!doctype html>
<html lang={lang} class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL.href} />
    <meta name="author" content="Michel Encarnación Dionicio" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL.href} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:locale" content={lang === 'es' ? 'es_MX' : 'en_US'} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="min-h-screen bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add comprehensive SEO meta tags to Layout"
```

---

### Task 2: Sitemap + robots.txt

**Files:**
- Modify: `astro.config.mjs`
- Create: `public/robots.txt`

- [ ] **Step 1: Install and configure sitemap**

```bash
npx astro add sitemap --yes
```

- [ ] **Step 2: Update astro.config.mjs with site URL and sitemap**

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://michelencarnacion.dev',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});
```

- [ ] **Step 3: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://michelencarnacion.dev/sitemap-index.xml
```

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs public/robots.txt
git commit -m "feat: add sitemap generation and robots.txt"
```

---

### Task 3: Responsive Polish Pass

**Files:**
- Potentially modify: multiple component files

- [ ] **Step 1: Review and fix responsive issues**

Go through each component and verify:
- Navbar: hamburger works on mobile, items stack properly
- Hero: text sizes scale down on mobile (`text-3xl sm:text-5xl lg:text-7xl`), profile image hides on mobile (already `hidden lg:flex`)
- Projects: grid collapses (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Skills: grid collapses (`grid-cols-1 md:grid-cols-2`)
- Experience: timeline works on narrow screens
- Contact: form stacks above social links on mobile
- Admin: sidebar is off-canvas on mobile (already implemented)

Test at breakpoints: 375px, 768px, 1024px, 1440px

- [ ] **Step 2: Commit any fixes**

```bash
git add -A
git commit -m "fix: responsive polish for all sections"
```

---

### Task 4: Final Build Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Clean build**

```bash
rm -rf dist .astro
npm run build
```

Expected: Build succeeds with 0 errors.

- [ ] **Step 2: Preview build locally**

```bash
npm run preview
```

Visit `http://localhost:4321` — verify all sections render correctly.
Visit `http://localhost:4321/admin` — verify admin panel loads.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final build verification — all sections functional"
```

---

### Task 5: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create complete README**

```markdown
# Michel Encarnación — Portfolio

Professional portfolio website built with Astro, React, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework:** Astro 5 (SSR/SSG hybrid)
- **UI:** React 19 (islands architecture)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### 1. Clone and install

\`\`\`bash
git clone <repo-url>
cd portfolio
npm install
\`\`\`

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/seed.sql` to populate initial content
4. Create Storage buckets:
   - `portfolio-images` (public)
   - `documents` (public)
5. Create an admin user in **Authentication > Users** (email/password)

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

\`\`\`bash
cp .env.example .env
\`\`\`

### 4. Run locally

\`\`\`bash
npm run dev
\`\`\`

- Portfolio: [http://localhost:4321](http://localhost:4321)
- Admin CMS: [http://localhost:4321/admin](http://localhost:4321/admin)

### 5. Build for production

\`\`\`bash
npm run build
\`\`\`

## Features

- **Bilingual** (EN/ES) with persistent toggle
- **Dark/Light mode** with system preference detection
- **Admin CMS** at `/admin` with:
  - CRUD for all content (projects, skills, experience, hero, contact)
  - Media library with drag & drop upload
  - TipTap rich text editor for project descriptions
  - Drag & drop reordering
  - Version history with rollback
  - Live preview
- **Animations:** Framer Motion scroll reveals, parallax hero, animated skill bars
- **SEO:** Dynamic meta tags, sitemap, robots.txt
- **Deploy-ready:** Configured for Vercel with SSR adapter

## Deploy to Vercel

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

\`\`\`
src/
├── components/
│   ├── admin/       # CMS panel components
│   ├── layout/      # Navbar, Footer
│   ├── sections/    # Hero, Projects, Skills, Experience, Contact
│   └── ui/          # ScrollReveal, SkillBar, ProjectCard, LanguageToggle
├── hooks/           # useTranslation, useTheme, useSupabase
├── layouts/         # Layout.astro
├── lib/             # Supabase clients, types, storage helpers
├── locales/         # en.json, es.json
├── pages/           # index.astro, admin/
└── styles/          # global.css
\`\`\`
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README with setup instructions"
```

---

## Phase 4 Completion Checklist

- [ ] SEO meta tags render correctly (check view-source)
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Admin pages excluded from sitemap
- [ ] All sections responsive at 375px, 768px, 1024px, 1440px
- [ ] `npm run build` succeeds with 0 errors
- [ ] `npm run preview` serves the site correctly
- [ ] README covers: install, Supabase setup, env vars, dev, build, deploy
