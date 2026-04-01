# Phase 2: Public Frontend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all 5 public-facing sections (Hero, Projects, Skills, Experience, Contact) plus Navbar and Footer as React island components with Framer Motion animations, dark/light mode, and bilingual support.

**Architecture:** Each section is an independent React component rendered as an Astro island. Data flows from Supabase server-side fetch in `index.astro` → props to React components. i18n uses the `useTranslation` hook for static UI text + `lang` suffix on DB fields for dynamic content. Dark mode toggle persists via `localStorage` and toggles `.dark` class on `<html>`.

**Tech Stack:** React 19, Framer Motion, Lucide React, Tailwind CSS 4

**Depends on:** Phase 1 complete (Supabase clients, types, i18n, Layout)

---

### Task 1: Dark Mode Hook + Theme Toggle

**Files:**
- Create: `src/hooks/useTheme.ts`

- [ ] **Step 1: Create useTheme hook**

```typescript
import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggleTheme };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTheme.ts
git commit -m "feat: add dark mode hook with system preference detection"
```

---

### Task 2: ScrollReveal Wrapper Component

**Files:**
- Create: `src/components/ui/ScrollReveal.tsx`

- [ ] **Step 1: Create ScrollReveal**

```tsx
import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/ScrollReveal.tsx
git commit -m "feat: add ScrollReveal animation wrapper component"
```

---

### Task 3: Language Toggle Component

**Files:**
- Create: `src/components/ui/LanguageToggle.tsx`

- [ ] **Step 1: Create LanguageToggle**

```tsx
import type { Lang } from '../../lib/types';

interface LanguageToggleProps {
  lang: Lang;
  onToggle: () => void;
}

export default function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700
                 transition-colors duration-200"
      aria-label={`Switch to ${lang === 'en' ? 'Spanish' : 'English'}`}
    >
      <span className={lang === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
      <span className="text-text-secondary">/</span>
      <span className={lang === 'es' ? 'opacity-100' : 'opacity-50'}>ES</span>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/LanguageToggle.tsx
git commit -m "feat: add LanguageToggle component"
```

---

### Task 4: Navbar

**Files:**
- Create: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Create Navbar with glassmorphism, mobile menu, scroll detection**

```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import LanguageToggle from '../ui/LanguageToggle';

const NAV_ITEMS = ['hero', 'projects', 'skills', 'experience', 'contact'] as const;

export default function Navbar() {
  const { lang, toggleLang, t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < lastScrollY || currentY < 100);
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-neutral-950/70 border-b border-border dark:border-border-dark"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="text-xl font-heading font-bold bg-gradient-to-r from-accent to-accent-violet bg-clip-text text-transparent">
            ME
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="text-sm font-medium text-text-secondary hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
              >
                {t(`nav.${item}`)}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <LanguageToggle lang={lang} onToggle={toggleLang} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border dark:border-border-dark"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className="block w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t(`nav.${item}`)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: add Navbar with glassmorphism, mobile menu, scroll hide"
```

---

### Task 5: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Create Footer**

```tsx
import { Heart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border dark:border-border-dark py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-text-secondary">
        <p>
          &copy; {year} Michel Encarnaci&oacute;n. {t('footer.rights')}
        </p>
        <p className="mt-2 flex items-center justify-center gap-1">
          {t('footer.built_with')} <Heart size={14} className="text-red-500" /> Astro + React
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 6: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Create Hero with parallax, gradient background, CTAs**

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download, FolderOpen } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import type { HeroContent } from '../../lib/types';

interface HeroProps {
  data: HeroContent | null;
}

export default function Hero({ data }: HeroProps) {
  const { lang, t } = useTranslation();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  if (!data) return null;

  const greeting = lang === 'en' ? data.greeting_en : data.greeting_es;
  const tagline = lang === 'en' ? data.tagline_en : data.tagline_es;
  const description = lang === 'en' ? data.description_en : data.description_es;

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/10 to-accent-violet/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div style={{ opacity }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-lg text-text-secondary"
            >
              {greeting}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mt-2 bg-gradient-to-r from-accent to-accent-violet bg-clip-text text-transparent"
            >
              {data.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl font-heading font-medium mt-4 text-text-primary dark:text-text-primary-dark"
            >
              {tagline}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-text-secondary mt-6 max-w-lg"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
              >
                <FolderOpen size={18} />
                {t('hero.cta_projects')}
              </a>
              {data.resume_url && (
                <a
                  href={data.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border dark:border-border-dark font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-300"
                >
                  <Download size={18} />
                  {t('hero.cta_cv')}
                </a>
              )}
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-accent-violet opacity-20 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent/30 to-accent-violet/30 backdrop-blur-sm border border-white/10" />
              {data.profile_image_url ? (
                <img
                  src={data.profile_image_url}
                  alt={data.name}
                  className="absolute inset-8 rounded-full object-cover"
                />
              ) : (
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-accent to-accent-violet flex items-center justify-center">
                  <span className="text-6xl font-heading font-bold text-white">ME</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={24} className="text-text-secondary" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: add Hero section with parallax, gradient bg, CTAs"
```

---

### Task 7: ProjectCard + Projects Section

**Files:**
- Create: `src/components/ui/ProjectCard.tsx`
- Create: `src/components/sections/Projects.tsx`

- [ ] **Step 1: Create ProjectCard**

```tsx
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import type { Project, Lang } from '../../lib/types';

interface ProjectCardProps {
  project: Project;
  lang: Lang;
  index: number;
}

export default function ProjectCard({ project, lang, index }: ProjectCardProps) {
  const description = lang === 'en' ? project.description_en : project.description_es;
  const isInProgress = !project.end_date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-shadow duration-300"
    >
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent-violet/10 relative overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-heading font-bold text-accent/30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isInProgress
              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
          }`}>
            {isInProgress ? '🟢 In Progress' : '✅ Completed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-heading font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-3">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-border dark:border-border-dark">
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-violet transition-colors"
            >
              <ExternalLink size={14} /> Live
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-violet transition-colors"
            >
              <Github size={14} /> Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create Projects section**

```tsx
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import ProjectCard from '../ui/ProjectCard';
import type { Project } from '../../lib/types';

interface ProjectsProps {
  data: Project[] | null;
}

export default function Projects({ data }: ProjectsProps) {
  const { lang, t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-heading font-bold text-center">
            {t('projects.title')}
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((project, i) => (
            <ProjectCard key={project.id} project={project} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ProjectCard.tsx src/components/sections/Projects.tsx
git commit -m "feat: add ProjectCard and Projects section with scroll animations"
```

---

### Task 8: SkillBar + Skills Section

**Files:**
- Create: `src/components/ui/SkillBar.tsx`
- Create: `src/components/sections/Skills.tsx`

- [ ] **Step 1: Create SkillBar**

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
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{name}</span>
        {yearsExperience && (
          <span className="text-xs text-text-secondary">{yearsExperience}</span>
        )}
      </div>
      <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-violet"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Skills section**

```tsx
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import SkillBar from '../ui/SkillBar';
import type { Skill, Certification } from '../../lib/types';

interface SkillsProps {
  skills: Skill[] | null;
  certifications: Certification[] | null;
}

const CATEGORIES = ['languages', 'frameworks', 'databases', 'other'] as const;

export default function Skills({ skills, certifications }: SkillsProps) {
  const { lang, t } = useTranslation();

  if (!skills || skills.length === 0) return null;

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = (skills || []).filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-24 bg-neutral-50 dark:bg-neutral-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-heading font-bold text-center">
            {t('skills.title')}
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {CATEGORIES.map((category) => (
            <ScrollReveal key={category}>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-6">
                  {t(`skills.${category}`)}
                </h3>
                <div className="space-y-4">
                  {grouped[category].map((skill, i) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      proficiency={skill.proficiency}
                      yearsExperience={skill.years_experience}
                      delay={i * 0.1}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <ScrollReveal>
            <div className="mt-16">
              <h3 className="text-xl font-heading font-semibold mb-6 text-center">
                {t('skills.certifications')}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {certifications.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.credential_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-neutral-900 hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-sm">
                      {lang === 'en' ? cert.title_en : cert.title_es}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">{cert.issuer}</p>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SkillBar.tsx src/components/sections/Skills.tsx
git commit -m "feat: add Skills section with animated bars and certifications"
```

---

### Task 9: Experience Section (Timeline)

**Files:**
- Create: `src/components/sections/Experience.tsx`

- [ ] **Step 1: Create Experience timeline**

```tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, GraduationCap, Trophy, Users } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import type { Experience as ExperienceType } from '../../lib/types';

interface ExperienceProps {
  data: ExperienceType[] | null;
}

const TYPE_ICONS = {
  work: Briefcase,
  education: GraduationCap,
  hackathon: Trophy,
  leadership: Users,
};

function TimelineItem({ item, index }: { item: ExperienceType; index: number }) {
  const { lang, t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const title = lang === 'en' ? item.title_en : item.title_es;
  const description = lang === 'en' ? item.description_en : item.description_es;
  const Icon = TYPE_ICONS[item.type];

  const startDate = new Date(item.start_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', {
    month: 'short',
    year: 'numeric',
  });
  const endDate = item.end_date
    ? new Date(item.end_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', {
        month: 'short',
        year: 'numeric',
      })
    : t('experience.present');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative pl-12 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <motion.div
        initial={{ height: 0 }}
        animate={isInView ? { height: '100%' } : {}}
        transition={{ duration: 0.8 }}
        className="absolute left-[18px] top-0 w-px bg-gradient-to-b from-accent to-accent-violet"
      />

      {/* Icon dot */}
      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-violet flex items-center justify-center">
        <Icon size={16} className="text-white" />
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-neutral-900 p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
            {startDate} — {endDate}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold">{title}</h3>
        <p className="text-sm text-accent mt-1">{item.organization}</p>
        <p className="text-sm text-text-secondary mt-3">{description}</p>
        {item.extra_info && (
          <p className="text-xs text-text-secondary mt-2 italic">{item.extra_info}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Experience({ data }: ExperienceProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-heading font-bold text-center">
            {t('experience.title')}
          </h2>
        </ScrollReveal>

        <div className="mt-16">
          {data.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Experience.tsx
git commit -m "feat: add Experience timeline with animated line and icons"
```

---

### Task 10: Contact Section

**Files:**
- Create: `src/components/sections/Contact.tsx`

- [ ] **Step 1: Create Contact form with social links**

```tsx
import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, Linkedin, Github, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import type { ContactInfo } from '../../lib/types';

interface ContactProps {
  contactInfo: ContactInfo | null;
}

export default function Contact({ contactInfo }: ContactProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT;

    if (!endpoint) {
      setStatus('error');
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-neutral-50 dark:bg-neutral-950/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-heading font-bold text-center">
            {t('contact.title')}
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          {/* Form */}
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 disabled:opacity-50"
              >
                <Send size={18} />
                {status === 'sending' ? '...' : t('contact.send')}
              </button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-600 text-sm"
                >
                  <CheckCircle size={16} /> {t('contact.success')}
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm"
                >
                  <AlertCircle size={16} /> {t('contact.error')}
                </motion.p>
              )}
            </form>
          </ScrollReveal>

          {/* Social Links */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-6">
              <h3 className="text-xl font-heading font-semibold">Info</h3>
              <div className="space-y-4">
                {contactInfo?.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
                  >
                    <Mail size={20} /> {contactInfo.email}
                  </a>
                )}
                {contactInfo?.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
                  >
                    <Phone size={20} /> {contactInfo.phone}
                  </a>
                )}
                {contactInfo?.linkedin_url && (
                  <a
                    href={contactInfo.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
                  >
                    <Linkedin size={20} /> LinkedIn
                  </a>
                )}
                {contactInfo?.github_url && (
                  <a
                    href={contactInfo.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
                  >
                    <Github size={20} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "feat: add Contact section with form and social links"
```

---

### Task 11: Wire Everything in index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update index.astro to use all components**

Overwrite `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { supabaseServer } from '../lib/supabase-server';

import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Contact from '../components/sections/Contact';
import Footer from '../components/layout/Footer';

const { data: heroData } = await supabaseServer
  .from('hero_content')
  .select('*')
  .eq('status', 'published')
  .single();

const { data: projects } = await supabaseServer
  .from('projects')
  .select('*')
  .eq('status', 'published')
  .order('sort_order');

const { data: skills } = await supabaseServer
  .from('skills')
  .select('*')
  .eq('status', 'published')
  .order('sort_order');

const { data: certifications } = await supabaseServer
  .from('certifications')
  .select('*')
  .eq('status', 'published')
  .order('sort_order');

const { data: experience } = await supabaseServer
  .from('experience')
  .select('*')
  .eq('status', 'published')
  .order('sort_order');

const { data: contactInfo } = await supabaseServer
  .from('contact_info')
  .select('*')
  .single();
---

<Layout>
  <Navbar client:load />
  <Hero client:load data={heroData} />
  <Projects client:visible data={projects} />
  <Skills client:visible skills={skills} certifications={certifications} />
  <Experience client:visible data={experience} />
  <Contact client:visible contactInfo={contactInfo} />
  <Footer client:load />
</Layout>
```

- [ ] **Step 2: Verify dev server renders all sections**

```bash
npm run dev
```

Visit `http://localhost:4321` — all 5 sections should render with Supabase data.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire all sections into index.astro with Supabase data"
```

---

## Phase 2 Completion Checklist

- [ ] All 5 sections render (Hero, Projects, Skills, Experience, Contact)
- [ ] Navbar shows/hides on scroll, glassmorphism works
- [ ] Language toggle switches all text (static UI + DB content)
- [ ] Dark/Light mode toggle works and persists
- [ ] Scroll reveal animations trigger on viewport entry
- [ ] Hero parallax effect works
- [ ] Skill bars animate on scroll
- [ ] Mobile responsive: hamburger menu, 1-col grid
- [ ] `npm run build` succeeds
