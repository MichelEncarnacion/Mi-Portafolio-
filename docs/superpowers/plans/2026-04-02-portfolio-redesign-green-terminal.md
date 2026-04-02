# Portfolio Redesign — Neon Green Terminal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public portfolio with neon green colors, terminal-style animations (typewriter, glow, fade-in), and a project detail modal styled as a terminal window.

**Architecture:** All changes are in existing React components and the global CSS. No new routes or data fetching. The modal lives in `Projects.tsx` state and is rendered by a new `ProjectModal.tsx` component using `framer-motion` (already installed).

**Tech Stack:** React 19, Framer Motion, Tailwind CSS 4, Lucide React

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/styles/global.css` | Modify | Replace blue/violet tokens with neon green |
| `src/components/sections/Hero.tsx` | Modify | Add typewriter hook for name + tagline, update gradient colors |
| `src/components/ui/ProjectCard.tsx` | Modify | Add `onClick` prop, neon glow hover, green tags |
| `src/components/sections/Projects.tsx` | Modify | Add modal state, pass `onClick` to cards, render modal |
| `src/components/ui/ProjectModal.tsx` | Create | Terminal-style modal with framer-motion enter/exit |
| `src/components/ui/SkillBar.tsx` | Modify | Update gradient from blue/violet to green |

---

### Task 1: Update color tokens

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace color tokens**

Open `src/styles/global.css` and replace the `@theme` block with:

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --color-bg-primary: #fafafa;
  --color-bg-primary-dark: #0a0a0a;
  --color-accent: #4ade80;
  --color-accent-hover: #22c55e;
  --color-accent-violet: #16a34a;
  --color-text-primary: #171717;
  --color-text-primary-dark: #ededed;
  --color-text-secondary: #737373;
  --color-border: #e5e5e5;
  --color-border-dark: #1a2a1a;

  --font-heading: 'Sora', sans-serif;
  --font-body: 'Inter', sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-body);
  }
}
```

- [ ] **Step 2: Verify dev server reflects green accent**

Run `npm run dev` and open `http://localhost:4321`. The hero gradient and skill bars should be green. If still blue, hard-refresh the browser.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: switch color palette to neon green"
```

---

### Task 2: Add typewriter animation to Hero

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Add `useTypewriter` hook inline**

Add this hook at the top of `Hero.tsx`, before the component:

```typescript
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download, FolderOpen } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useState, useEffect } from 'react';
import type { HeroContent } from '../../lib/types';

function useTypewriter(text: string, speed = 50, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}
```

- [ ] **Step 2: Use the hook for name and tagline**

Inside the `Hero` component, after the existing variable declarations, add:

```typescript
const { displayed: displayedName, done: nameDone } = useTypewriter(name, 55, 300);
const { displayed: displayedTagline } = useTypewriter(tagline, 30, nameDone ? 0 : 99999);
```

- [ ] **Step 3: Replace static name and tagline renders**

Replace the `<motion.h1>` (name) block:

```tsx
<motion.h1
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.1, delay: 0.3 }}
  className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mt-2 text-accent leading-tight"
>
  {displayedName}
  <span className="animate-pulse text-accent">█</span>
</motion.h1>
```

Replace the tagline `<motion.p>`:

```tsx
<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.1, delay: 0.4 }}
  className="text-xl sm:text-2xl font-heading font-medium mt-4 text-text-primary dark:text-text-primary-dark"
>
  {displayedTagline}
  {nameDone && displayedTagline.length < tagline.length && (
    <span className="animate-pulse text-accent">█</span>
  )}
</motion.p>
```

- [ ] **Step 4: Update background blobs to green**

Replace the parallax blob colors in the `motion.div` background:

```tsx
<div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
<div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
```

- [ ] **Step 5: Update CTA button gradient**

Replace the primary button className:

```
"inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-black font-bold hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all duration-300"
```

- [ ] **Step 6: Update avatar fallback to green**

Replace the avatar fallback `div` bg:

```tsx
<div className="absolute inset-8 rounded-full bg-accent flex items-center justify-center">
  <span className="text-5xl font-heading font-bold text-black">ME</span>
</div>
```

- [ ] **Step 7: Verify typewriter works**

Open `http://localhost:4321` — name should type letter by letter with green cursor, then tagline types out. No blue anywhere in the hero.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: add typewriter animation to hero, neon green palette"
```

---

### Task 3: Create ProjectModal component

**Files:**
- Create: `src/components/ui/ProjectModal.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitFork } from 'lucide-react';
import type { Project, Lang } from '../../lib/types';

interface ProjectModalProps {
  project: Project | null;
  lang: Lang;
  onClose: () => void;
}

export default function ProjectModal({ project, lang, onClose }: ProjectModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (project) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  const title = project?.title ?? '';
  const description = project
    ? (lang === 'en' ? project.long_description_en || project.description_en : project.long_description_es || project.description_es)
    : '';

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-accent/30 bg-neutral-950 shadow-2xl shadow-accent/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="font-mono text-xs text-neutral-400">
                  {title.toLowerCase().replace(/\s+/g, '-')}.md
                </span>
                <button
                  onClick={onClose}
                  className="text-neutral-500 hover:text-white transition-colors text-sm font-mono"
                >
                  [x]
                </button>
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono">
                <p className="text-accent text-sm mb-4">$ cat {title.toLowerCase().replace(/\s+/g, '-')}.md</p>

                <h2 className="text-xl font-sans font-bold text-white mb-3">{title}</h2>

                {project.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-neutral-800">
                    <img
                      src={project.image_url}
                      alt={title}
                      className="w-full object-cover max-h-48"
                    />
                  </div>
                )}

                <p className="text-neutral-300 text-sm font-sans leading-relaxed mb-4">{description}</p>

                {/* Stack */}
                {project.tags.length > 0 && (
                  <div className="mb-5">
                    <span className="text-accent text-xs">Stack: </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs border border-accent/30 text-accent bg-accent/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(project.project_url || project.repo_url) && (
                  <div className="flex gap-3 pt-4 border-t border-neutral-800">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors"
                      >
                        <ExternalLink size={12} /> ./demo
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors"
                      >
                        <GitFork size={12} /> ./repo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/ProjectModal.tsx
git commit -m "feat: add terminal-style ProjectModal component"
```

---

### Task 4: Update ProjectCard — green glow hover + onClick

**Files:**
- Modify: `src/components/ui/ProjectCard.tsx`

- [ ] **Step 1: Add `onClick` prop and update styles**

Replace the entire file content:

```tsx
import { motion } from 'framer-motion';
import type { Project, Lang } from '../../lib/types';

interface ProjectCardProps {
  project: Project;
  lang: Lang;
  index: number;
  onClick: (project: Project) => void;
}

export default function ProjectCard({ project, lang, index, onClick }: ProjectCardProps) {
  const description = lang === 'en' ? project.description_en : project.description_es;
  const isInProgress = !project.end_date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onClick={() => onClick(project)}
      className="group cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_0_24px_#4ade8022]"
    >
      {/* Image */}
      <div className="aspect-video bg-neutral-800 relative overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-heading font-bold text-accent/20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            isInProgress
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'bg-neutral-700/80 text-neutral-300 border border-neutral-600'
          }`}>
            {isInProgress ? '● In Progress' : '✓ Done'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-base font-heading font-semibold text-white leading-snug">{project.title}</h3>
        <p className="mt-2 text-sm text-neutral-400 line-clamp-3 leading-relaxed">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-800 text-accent/80 border border-accent/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs text-neutral-600 font-mono group-hover:text-accent/60 transition-colors">
          click to expand →
        </p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/ProjectCard.tsx
git commit -m "feat: add onClick and neon glow hover to ProjectCard"
```

---

### Task 5: Wire modal in Projects section

**Files:**
- Modify: `src/components/sections/Projects.tsx`

- [ ] **Step 1: Add modal state and wire everything**

Replace the entire file content:

```tsx
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import type { Project } from '../../lib/types';

interface ProjectsProps {
  data: Project[] | null;
}

export default function Projects({ data }: ProjectsProps) {
  const { lang, t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data || data.length === 0) return null;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold">
            {t('projects.title')}
          </h2>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              lang={lang}
              index={i}
              onClick={setSelectedProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        lang={lang}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
```

- [ ] **Step 2: Verify modal works**

Open `http://localhost:4321`, scroll to Projects, click a card. Terminal modal should open with project info. Press `Esc` or `[x]` to close.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Projects.tsx
git commit -m "feat: wire ProjectModal into Projects section"
```

---

### Task 6: Update SkillBar colors

**Files:**
- Modify: `src/components/ui/SkillBar.tsx`

- [ ] **Step 1: Update gradient**

Replace the `motion.div` className inside the bar:

```tsx
className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
```

Full updated file:

```tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SkillBarProps {
  name: string;
  proficiency: number;
  yearsExperience: string | null;
  delay?: number;
}

export default function SkillBar({ name, proficiency, yearsExperience, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-neutral-200">{name}</span>
        {yearsExperience && (
          <span className="text-xs text-neutral-500">{yearsExperience}</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/SkillBar.tsx
git commit -m "feat: update SkillBar gradient to neon green"
```

---

### Task 7: Final check — hunt remaining blue/violet classes

**Files:**
- Modify: any remaining components with hardcoded blue/violet Tailwind classes

- [ ] **Step 1: Search for leftover blue/violet classes**

Run in terminal:
```bash
grep -r "accent-violet\|from-accent to-accent-violet\|text-blue\|bg-blue\|border-blue" src/components/sections/ src/components/layout/ src/components/ui/
```

- [ ] **Step 2: Fix any matches**

For any matches found, replace:
- `accent-violet` → `accent-hover`
- `from-accent to-accent-violet` → `from-accent to-accent-hover`
- `text-blue-*` → `text-accent`
- `bg-blue-*` → `bg-accent`
- `border-blue-*` → `border-accent`

- [ ] **Step 3: Final visual check**

Open `http://localhost:4321` and scan:
- Hero: green gradient name, typewriter, green CTA button
- Projects: green glow on hover, modal opens on click
- Skills: green bars animate on scroll
- No blue or violet anywhere

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove remaining blue/violet references, portfolio now full neon green"
```
