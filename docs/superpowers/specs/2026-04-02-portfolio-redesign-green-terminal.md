# Portfolio Redesign — Neon Green Terminal

**Date:** 2026-04-02  
**Scope:** Visual redesign of the public portfolio site — colors, animations, and project detail modal.

---

## 1. Color System

Replace all blue/violet accents with neon green throughout `src/styles/global.css` and any inline Tailwind classes.

| Token | Old value | New value |
|---|---|---|
| `--color-accent` | `#3b82f6` | `#4ade80` |
| `--color-accent-hover` | _(none)_ | `#22c55e` |
| `--color-accent-violet` | `#8b5cf6` | `#16a34a` |
| `--color-border-accent` | _(none)_ | `#1a2a1a` |

Text on neon green backgrounds uses `#000` (black) for contrast.

---

## 2. Animations — Terminal / Hacker Style

### 2.1 Hero Section — Typewriter
- Name (`Michel Encarnación`) types out letter by letter on page load
- Cursor `█` blinks after the last character using CSS `@keyframes blink`
- Tagline appears after name finishes, same typewriter effect but faster
- Implementation: custom React hook `useTypewriter(text, speed)` or pure CSS animation

### 2.2 Scroll-triggered Fade-in
- All sections (About, Projects, Skills, Experience, Contact) use `IntersectionObserver`
- Elements fade-in + slide-up 20px when entering viewport
- Stagger delay for lists (skills, experience items) — each item 80ms apart
- One-time trigger (no re-animate on scroll back)

### 2.3 Project Cards — Hover Glow
- On hover: `box-shadow: 0 0 24px #4ade8033, 0 0 2px #4ade8066`
- Border color transitions from `#1a2a1a` to `#4ade8066`
- Card lifts slightly: `transform: translateY(-4px)`
- Transition: `all 0.25s ease`

### 2.4 Skill Bars — Count-up on Scroll
- Proficiency bars animate width from `0` to target `%` when section enters viewport
- Duration: 800ms, easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### 2.5 General
- No reduce-motion overrides needed for MVP, but keep animations short (< 1s)

---

## 3. Project Detail Modal

### Trigger
- Click anywhere on a project card opens the modal for that project

### Modal Structure
```
┌─────────────────────────────────────────┐
│ ● ● ●                    project.md  [x]│  ← terminal header
├─────────────────────────────────────────┤
│ $ cat README.md                         │
│                                         │
│ [Project Title]                         │
│ [Long description EN/ES]                │
│                                         │
│ Stack: [tag] [tag] [tag]                │
│                                         │
│ [image if available]                    │
│                                         │
│  [./demo ↗]    [./repo ↗]              │
└─────────────────────────────────────────┘
```

### Behavior
- Opens with scale `0.95 → 1` + fade-in, 200ms
- Closes with `[x]` button, `Esc` key, or clicking backdrop
- Backdrop: `rgba(0,0,0,0.8)` with blur
- Scrollable if content is taller than viewport
- Language-aware: shows `description_en` or `description_es` based on current lang

### Component
- New file: `src/components/ProjectModal.tsx`
- Props: `project: Project | null`, `onClose: () => void`
- Rendered at root level in `index.astro` or inside the Projects section component
- Uses `framer-motion` for enter/exit animation (already installed)

---

## 4. Files to Change

| File | Change |
|---|---|
| `src/styles/global.css` | Update color tokens |
| `src/components/Hero.tsx` (or `.astro`) | Add typewriter animation |
| `src/components/Projects.tsx` | Add click handler → open modal, hover glow |
| `src/components/Skills.tsx` | Animate bars on scroll |
| `src/components/Experience.tsx` | Stagger fade-in |
| `src/components/ProjectModal.tsx` | **New** — terminal-style modal |

---

## 5. Out of Scope
- Admin panel styling (separate concern)
- Dark/light mode toggle (stays dark-only for now)
- Mobile-specific animation changes
