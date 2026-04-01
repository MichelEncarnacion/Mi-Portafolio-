# Phase 1: Scaffolding, Database & i18n — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the Astro 5 project with React, Tailwind CSS, Supabase integration, i18n system, and complete database schema — producing a buildable skeleton that all subsequent phases build on.

**Architecture:** Astro 5 SSR/SSG hybrid with React islands. Supabase provides PostgreSQL database, auth, and storage. i18n uses JSON locale files for static UI + bilingual DB fields (`_en`/`_es`) for CMS content. Server-side Supabase client fetches published data at build/request time; browser client handles admin CRUD.

**Tech Stack:** Astro 5, React 19, Tailwind CSS 4, Framer Motion, Supabase JS v2, Lucide React, TipTap

---

### Task 1: Initialize Astro Project & Git

**Files:**
- Create: entire project scaffold via CLI
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd /c/Users/miche/OneDrive/Escritorio/MiWebDev
git init
```

- [ ] **Step 2: Create Astro project in current directory**

```bash
cd /c/Users/miche/OneDrive/Escritorio/MiWebDev
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

- [ ] **Step 3: Add Astro integrations**

```bash
npx astro add react tailwind --yes
```

- [ ] **Step 4: Install all dependencies**

```bash
npm install framer-motion lucide-react @supabase/supabase-js @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-code-block @tiptap/extension-image @astrojs/vercel
```

- [ ] **Step 5: Create .gitignore**

Create `.gitignore` with:

```
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
```

- [ ] **Step 6: Create .env.example**

Create `.env.example`:

```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: initialize Astro project with React, Tailwind, Supabase deps"
```

---

### Task 2: Configure Astro for SSR + Vercel

**Files:**
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: Update astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
  ],
});
```

- [ ] **Step 2: Update tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 3: Verify build works**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs tsconfig.json
git commit -m "feat: configure Astro SSR with Vercel adapter"
```

---

### Task 3: Tailwind CSS 4 Config + Global Styles + Fonts

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/Layout.astro` (or create if not exists)

- [ ] **Step 1: Create global.css with Tailwind + custom theme + fonts**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #fafafa;
  --color-bg-primary-dark: #0a0a0a;
  --color-accent: #3b82f6;
  --color-accent-violet: #8b5cf6;
  --color-text-primary: #171717;
  --color-text-primary-dark: #ededed;
  --color-text-secondary: #737373;
  --color-border: #e5e5e5;
  --color-border-dark: #262626;

  --font-heading: 'Sora', sans-serif;
  --font-body: 'Inter', sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    transition: background-color 0.3s, color 0.3s;
  }

  .dark body {
    background-color: var(--color-bg-primary-dark);
    color: var(--color-text-primary-dark);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

- [ ] **Step 2: Create Layout.astro with SEO, fonts, dark mode**

Create `src/layouts/Layout.astro`:

```astro
---
interface Props {
  title?: string;
  description?: string;
  lang?: string;
}

const { title = 'Michel Encarnación — Software Developer', description = 'Portfolio of Michel Encarnación Dionicio — Software Engineering Student & Full-Stack Developer', lang = 'en' } = Astro.props;
---

<!doctype html>
<html lang={lang} class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body class="min-h-screen bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark">
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro
git commit -m "feat: add Tailwind theme, global styles, fonts, Layout"
```

---

### Task 4: Supabase Clients (Browser + Server)

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/supabase-server.ts`
- Create: `src/lib/types.ts`

- [ ] **Step 1: Create TypeScript types for all Supabase tables**

Create `src/lib/types.ts`:

```typescript
export interface HeroContent {
  id: string;
  greeting_en: string;
  greeting_es: string;
  name: string;
  tagline_en: string;
  tagline_es: string;
  description_en: string;
  description_es: string;
  profile_image_url: string | null;
  resume_url: string | null;
  status: 'draft' | 'published';
  version: number;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description_en: string;
  description_es: string;
  long_description_en: string | null;
  long_description_es: string | null;
  image_url: string | null;
  gallery_urls: string[];
  tags: string[];
  project_url: string | null;
  repo_url: string | null;
  status: 'draft' | 'published';
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'languages' | 'frameworks' | 'databases' | 'other';
  icon: string | null;
  proficiency: number;
  years_experience: string | null;
  sort_order: number;
  status: 'draft' | 'published';
  updated_at: string;
}

export interface Certification {
  id: string;
  title_en: string;
  title_es: string;
  issuer: string;
  credential_url: string | null;
  date_obtained: string | null;
  sort_order: number;
  status: 'draft' | 'published';
  updated_at: string;
}

export interface Experience {
  id: string;
  title_en: string;
  title_es: string;
  organization: string;
  description_en: string;
  description_es: string;
  type: 'work' | 'education' | 'hackathon' | 'leadership';
  start_date: string;
  end_date: string | null;
  sort_order: number;
  extra_info: string | null;
  status: 'draft' | 'published';
  version: number;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  location: string | null;
  updated_at: string;
}

export interface ContentVersion {
  id: string;
  table_name: string;
  record_id: string;
  snapshot: Record<string, unknown>;
  version: number;
  changed_by: string | null;
  created_at: string;
}

export type Lang = 'en' | 'es';
```

- [ ] **Step 2: Create browser Supabase client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 3: Create server Supabase client**

Create `src/lib/supabase-server.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/supabase.ts src/lib/supabase-server.ts
git commit -m "feat: add Supabase clients and TypeScript types for all tables"
```

---

### Task 5: Supabase Storage Helpers

**Files:**
- Create: `src/lib/storage.ts`

- [ ] **Step 1: Create storage helpers**

Create `src/lib/storage.ts`:

```typescript
import { supabase } from './supabase';

const IMAGE_BUCKET = 'portfolio-images';
const DOCS_BUCKET = 'documents';

export async function uploadImage(
  file: File,
  folder: 'profile' | 'projects' | 'gallery'
): Promise<string> {
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function uploadDocument(file: File): Promise<string> {
  const fileName = `resume/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(DOCS_BUCKET)
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from(DOCS_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export async function listFiles(
  bucket: string,
  folder: string
): Promise<Array<{ name: string; url: string; metadata: unknown }>> {
  const { data, error } = await supabase.storage.from(bucket).list(folder);
  if (error) throw error;

  return (data || []).map((file) => {
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${folder}/${file.name}`);
    return {
      name: file.name,
      url: urlData.publicUrl,
      metadata: file.metadata,
    };
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/storage.ts
git commit -m "feat: add Supabase storage helpers for images and documents"
```

---

### Task 6: i18n System

**Files:**
- Create: `src/locales/en.json`
- Create: `src/locales/es.json`
- Create: `src/hooks/useTranslation.ts`

- [ ] **Step 1: Create English locale file**

Create `src/locales/en.json`:

```json
{
  "nav": {
    "hero": "Home",
    "projects": "Projects",
    "skills": "Skills",
    "experience": "Experience",
    "contact": "Contact"
  },
  "hero": {
    "greeting": "Hi, I'm",
    "cta_projects": "View Projects",
    "cta_cv": "Download CV"
  },
  "projects": {
    "title": "Featured Projects",
    "view_more": "View More",
    "in_progress": "In Progress",
    "completed": "Completed"
  },
  "skills": {
    "title": "Tech Stack",
    "languages": "Languages",
    "frameworks": "Frameworks & Tools",
    "databases": "Databases & Backend",
    "other": "Other",
    "certifications": "Certifications"
  },
  "experience": {
    "title": "Experience",
    "present": "Present"
  },
  "contact": {
    "title": "Let's Connect",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "send": "Send Message",
    "success": "Message sent successfully!",
    "error": "Something went wrong. Please try again."
  },
  "footer": {
    "rights": "All rights reserved.",
    "built_with": "Built with"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark"
  },
  "admin": {
    "dashboard": "Dashboard",
    "hero_content": "Hero Content",
    "projects": "Projects",
    "skills_certs": "Skills & Certifications",
    "experience": "Experience",
    "media": "Media Library",
    "contact_info": "Contact Info",
    "resume": "Resume/CV",
    "versions": "Version History",
    "logout": "Logout",
    "preview": "Preview Site",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "duplicate": "Duplicate",
    "new_project": "New Project",
    "published": "Published",
    "draft": "Draft",
    "login_title": "Admin Login",
    "login_email": "Email",
    "login_password": "Password",
    "login_submit": "Sign In"
  }
}
```

- [ ] **Step 2: Create Spanish locale file**

Create `src/locales/es.json`:

```json
{
  "nav": {
    "hero": "Inicio",
    "projects": "Proyectos",
    "skills": "Skills",
    "experience": "Experiencia",
    "contact": "Contacto"
  },
  "hero": {
    "greeting": "Hola, soy",
    "cta_projects": "Ver Proyectos",
    "cta_cv": "Descargar CV"
  },
  "projects": {
    "title": "Proyectos Destacados",
    "view_more": "Ver Más",
    "in_progress": "En Progreso",
    "completed": "Completado"
  },
  "skills": {
    "title": "Stack Tecnológico",
    "languages": "Lenguajes",
    "frameworks": "Frameworks y Herramientas",
    "databases": "Bases de Datos y Backend",
    "other": "Otros",
    "certifications": "Certificaciones"
  },
  "experience": {
    "title": "Experiencia",
    "present": "Presente"
  },
  "contact": {
    "title": "Conectemos",
    "name": "Nombre",
    "email": "Correo",
    "message": "Mensaje",
    "send": "Enviar Mensaje",
    "success": "¡Mensaje enviado exitosamente!",
    "error": "Algo salió mal. Intenta de nuevo."
  },
  "footer": {
    "rights": "Todos los derechos reservados.",
    "built_with": "Hecho con"
  },
  "theme": {
    "light": "Claro",
    "dark": "Oscuro"
  },
  "admin": {
    "dashboard": "Dashboard",
    "hero_content": "Contenido Hero",
    "projects": "Proyectos",
    "skills_certs": "Skills y Certificaciones",
    "experience": "Experiencia",
    "media": "Biblioteca de Medios",
    "contact_info": "Info de Contacto",
    "resume": "CV/Hoja de Vida",
    "versions": "Historial de Versiones",
    "logout": "Cerrar Sesión",
    "preview": "Vista Previa",
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "duplicate": "Duplicar",
    "new_project": "Nuevo Proyecto",
    "published": "Publicado",
    "draft": "Borrador",
    "login_title": "Inicio de Sesión Admin",
    "login_email": "Correo",
    "login_password": "Contraseña",
    "login_submit": "Iniciar Sesión"
  }
}
```

- [ ] **Step 3: Create useTranslation hook**

Create `src/hooks/useTranslation.ts`:

```typescript
import { useState, useCallback, useEffect } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';
import type { Lang } from '../lib/types';

const locales: Record<Lang, typeof en> = { en, es };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('lang') as Lang) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string): string => getNestedValue(locales[lang] as unknown as Record<string, unknown>, key),
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  }, []);

  return { lang, setLang, toggleLang, t };
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/locales/en.json src/locales/es.json src/hooks/useTranslation.ts
git commit -m "feat: add i18n system with EN/ES locales and useTranslation hook"
```

---

### Task 7: Database Migration SQL

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create migrations directory and SQL file**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- ============================================
-- Michel Encarnación Portfolio — Initial Schema
-- ============================================

-- Hero Content (single row)
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  greeting_en TEXT NOT NULL DEFAULT 'Hi, I''m',
  greeting_es TEXT NOT NULL DEFAULT 'Hola, soy',
  name TEXT NOT NULL DEFAULT 'Michel Encarnación',
  tagline_en TEXT NOT NULL,
  tagline_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  profile_image_url TEXT,
  resume_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  long_description_en TEXT,
  long_description_es TEXT,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  project_url TEXT,
  repo_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INT NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('languages', 'frameworks', 'databases', 'other')),
  icon TEXT,
  proficiency INT DEFAULT 0 CHECK (proficiency BETWEEN 0 AND 100),
  years_experience TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  issuer TEXT NOT NULL,
  credential_url TEXT,
  date_obtained DATE,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  organization TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('work', 'education', 'hackathon', 'leadership')),
  start_date DATE NOT NULL,
  end_date DATE,
  sort_order INT NOT NULL DEFAULT 0,
  extra_info TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Info (single row)
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  location TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Versions (for rollback)
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  snapshot JSONB NOT NULL,
  version INT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_versions_lookup ON content_versions(table_name, record_id, version DESC);

-- ============================================
-- Row Level Security
-- ============================================

-- Helper: apply public read + admin full access to a table
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['hero_content', 'projects', 'skills', 'certifications', 'experience', 'contact_info', 'content_versions'])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format(
      'CREATE POLICY "Public read published" ON %I FOR SELECT USING (
        CASE WHEN %I ? ''status'' THEN ((%I.status)::text = ''published'') ELSE true END
      )', tbl, tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "Admin full access" ON %I FOR ALL USING (auth.role() = ''authenticated'')',
      tbl
    );
  END LOOP;
END;
$$;

-- Simpler approach: explicit policies per table
-- (The dynamic block above may fail on tables without status column, so let's do explicit)

-- Drop the dynamic policies and recreate explicitly
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['hero_content', 'projects', 'skills', 'certifications', 'experience', 'contact_info', 'content_versions'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public read published" ON %I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin full access" ON %I', tbl);
  END LOOP;
END;
$$;

-- Tables WITH status column
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON hero_content FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON hero_content FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON projects FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON skills FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON skills FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON certifications FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON certifications FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON experience FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Tables WITHOUT status column
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read versions" ON content_versions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert versions" ON content_versions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Auto-versioning trigger
-- ============================================

CREATE OR REPLACE FUNCTION save_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO content_versions (table_name, record_id, snapshot, version, changed_by)
  VALUES (TG_TABLE_NAME, OLD.id, to_jsonb(OLD), OLD.version, auth.uid());
  NEW.version := OLD.version + 1;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER version_hero_content BEFORE UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION save_version();

CREATE TRIGGER version_projects BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION save_version();

CREATE TRIGGER version_experience BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION save_version();

-- ============================================
-- Storage Buckets (run in Supabase dashboard or via API)
-- ============================================
-- Note: Storage buckets must be created via Supabase dashboard or management API:
-- 1. Create bucket "portfolio-images" (public)
-- 2. Create bucket "documents" (public)
-- Folder structure within portfolio-images: profile/, projects/, gallery/
```

- [ ] **Step 2: Commit**

```bash
git add supabase/
git commit -m "feat: add complete Supabase migration with tables, RLS, and versioning triggers"
```

---

### Task 8: Seed Data

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Create seed.sql with all CV content**

Create `supabase/seed.sql`:

```sql
-- ============================================
-- Seed Data — Michel Encarnación Portfolio
-- ============================================

-- Hero Content
INSERT INTO hero_content (greeting_en, greeting_es, name, tagline_en, tagline_es, description_en, description_es, status)
VALUES (
  'Hi, I''m',
  'Hola, soy',
  'Michel Encarnación',
  'Software Engineering Student & Full-Stack Developer',
  'Estudiante de Ingeniería de Software & Desarrollador Full-Stack',
  'Passionate about building innovative solutions. Currently leading UPAEP''s satellite dashboard and serving as President of the IT Faculty Board.',
  'Apasionado por construir soluciones innovadoras. Actualmente liderando el dashboard satelital de UPAEP y Presidente de la Mesa Directiva de la Facultad de TI.',
  'published'
);

-- Projects
INSERT INTO projects (title, slug, description_en, description_es, tags, status, sort_order, start_date, end_date) VALUES
(
  'GXIBA — Satellite Metrics Web Platform',
  'gxiba-satellite-platform',
  'Lead developer for UPAEP''s satellite telemetry dashboard. Built real-time data visualization for satellite metrics using Astro and React with Supabase as the data layer.',
  'Desarrollador líder del dashboard de telemetría satelital de UPAEP. Visualización de datos en tiempo real con Astro, React y Supabase.',
  ARRAY['Astro', 'React', 'PHP', 'Tailwind', 'Supabase'],
  'published', 1, '2024-01-01', NULL
),
(
  'GYOLAP — Medical Appointment System',
  'gyolap-medical-system',
  'Full-stack web-based medical appointment system for a gynecology clinic. Features patient booking, schedule management, and a secure admin panel.',
  'Sistema web de citas médicas para clínica ginecológica. Incluye reserva de citas, gestión de horarios y panel de administración seguro.',
  ARRAY['PHP', 'JavaScript', 'MySQL', 'Bootstrap'],
  'published', 2, '2023-06-01', '2024-01-01'
),
(
  'Intelligent Parking System',
  'intelligent-parking-system',
  'Automated smart parking system to reduce waiting times. Built with Python as the core language and Arduino for real-time detection and monitoring.',
  'Sistema de estacionamiento inteligente automatizado para reducir tiempos de espera. Python como lenguaje principal y Arduino para detección en tiempo real.',
  ARRAY['Python', 'Arduino', 'IoT'],
  'published', 3, '2023-01-01', '2023-06-01'
),
(
  'Car-Dealership UX/UI',
  'car-dealership-uxui',
  'Complete responsive interface design for an automotive dealership management platform. Wireframes, high-fidelity prototypes, and interactive flows.',
  'Diseño completo de interfaz responsive para plataforma de gestión de concesionaria automotriz. Wireframes, prototipos de alta fidelidad y flujos interactivos.',
  ARRAY['Figma', 'UX/UI', 'Prototyping'],
  'published', 4, '2023-03-01', '2023-07-01'
),
(
  'ADMEX — Finance & Inventory App',
  'admex-finance-inventory',
  'UX/UI design for a mobile platform managing finances and inventory for small businesses. Usability tested with RealEye.',
  'Diseño UX/UI para plataforma móvil de gestión de finanzas e inventario para pequeños negocios. Pruebas de usabilidad con RealEye.',
  ARRAY['Figma', 'UX/UI', 'RealEye'],
  'published', 5, '2023-04-01', '2023-09-01'
),
(
  'Custom SQL ERP Database',
  'custom-sql-erp',
  'Designed and implemented a relational database with plans to scale into a customized ERP system for a small business.',
  'Diseño e implementación de base de datos relacional con planes de escalarlo a un sistema ERP personalizado.',
  ARRAY['SQL', 'Database Design', 'ERP'],
  'published', 6, '2023-02-01', '2023-05-01'
);

-- Skills — Languages
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('C / C++', 'languages', 75, '2 years', 1, 'published'),
('Java', 'languages', 60, '1 year', 2, 'published'),
('Python', 'languages', 60, '1 year', 3, 'published'),
('PHP', 'languages', 50, '6 months', 4, 'published'),
('JavaScript', 'languages', 70, NULL, 5, 'published'),
('SQL', 'languages', 75, NULL, 6, 'published'),
('HTML5 / CSS3', 'languages', 85, NULL, 7, 'published');

-- Skills — Frameworks & Tools
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('Astro', 'frameworks', 70, NULL, 1, 'published'),
('React', 'frameworks', 65, NULL, 2, 'published'),
('Tailwind CSS', 'frameworks', 80, NULL, 3, 'published'),
('Bootstrap', 'frameworks', 70, NULL, 4, 'published'),
('Figma', 'frameworks', 75, NULL, 5, 'published');

-- Skills — Databases & Backend
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('MySQL', 'databases', 75, NULL, 1, 'published'),
('Supabase', 'databases', 65, NULL, 2, 'published'),
('SQL Database Design', 'databases', 70, NULL, 3, 'published');

-- Skills — Other
INSERT INTO skills (name, category, proficiency, years_experience, sort_order, status) VALUES
('Arduino / IoT', 'other', 55, NULL, 1, 'published'),
('Git', 'other', 70, NULL, 2, 'published'),
('UX/UI Design', 'other', 70, NULL, 3, 'published'),
('Project Management', 'other', 65, NULL, 4, 'published'),
('Network Fundamentals (CCNA)', 'other', 50, NULL, 5, 'published');

-- Certifications
INSERT INTO certifications (title_en, title_es, issuer, sort_order, status) VALUES
('CCNA v7: Introduction to Networks', 'CCNA v7: Introducción a Redes', 'Cisco', 1, 'published'),
('Database Foundations & DB Programming with SQL', 'Fundamentos de Bases de Datos y Programación SQL', 'Oracle Academy', 2, 'published');

-- Experience
INSERT INTO experience (title_en, title_es, organization, description_en, description_es, type, start_date, end_date, sort_order, extra_info, status) VALUES
(
  'President — Board of Directors, IT Faculty',
  'Presidente — Mesa Directiva, Facultad de TI',
  'UPAEP',
  'Leading and coordinating the IT faculty board. Serving as intermediary between university authorities and faculty members, ensuring proper coordination and information flow.',
  'Liderando y coordinando la mesa directiva de la facultad de TI. Intermediario entre autoridades universitarias y miembros de la facultad.',
  'leadership', '2024-06-01', NULL, 1, NULL, 'published'
),
(
  'Hackathon Participant (2023 & 2024)',
  'Participante de Hackathon (2023 y 2024)',
  'UPAEP',
  'Competed in 24-hour programming marathons using C++.',
  'Participación en maratones de programación de 24 horas en C++.',
  'hackathon', '2023-10-01', '2024-10-01', 2, NULL, 'published'
),
(
  'Software Engineering Degree',
  'Ingeniería de Software',
  'Universidad Popular Autónoma del Estado de Puebla (UPAEP)',
  'Software Engineering undergraduate program with focus on full-stack development, databases, and UX/UI design.',
  'Programa de pregrado en Ingeniería de Software con enfoque en desarrollo full-stack, bases de datos y diseño UX/UI.',
  'education', '2022-08-01', NULL, 3, 'GPA: 9.5/10 | 60% Academic Scholarship | Graduating June 2026', 'published'
);

-- Contact Info
INSERT INTO contact_info (email, phone, linkedin_url, github_url) VALUES
('michel.encarnacion@upaep.edu.mx', '2213411834', 'https://linkedin.com/in/michel-encarnacion', 'https://github.com/michel-encarnacion');
```

- [ ] **Step 2: Commit**

```bash
git add supabase/seed.sql
git commit -m "feat: add seed data with all CV content in EN/ES"
```

---

### Task 9: Placeholder Assets

**Files:**
- Create: `public/favicon.svg`
- Create: `public/images/projects/.gitkeep`
- Create: `public/images/profile.webp` (placeholder SVG)

- [ ] **Step 1: Create favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#g)"/>
  <text x="16" y="22" font-family="sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">M</text>
</svg>
```

- [ ] **Step 2: Create placeholder directories**

```bash
mkdir -p public/images/projects
touch public/images/projects/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: add favicon and placeholder asset directories"
```

---

### Task 10: Minimal index.astro with Supabase Fetch

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create index.astro skeleton that fetches from Supabase**

Create/overwrite `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { supabaseServer } from '../lib/supabase-server';

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
  <main>
    <!-- Hero, Projects, Skills, Experience, Contact components will be added in Phase 2 -->
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-5xl font-bold font-heading bg-gradient-to-r from-accent to-accent-violet bg-clip-text text-transparent">
          {heroData?.name || 'Michel Encarnación'}
        </h1>
        <p class="mt-4 text-text-secondary text-lg">
          {heroData?.tagline_en || 'Software Engineering Student & Full-Stack Developer'}
        </p>
        <p class="mt-2 text-sm text-text-secondary">
          Phase 1 complete — {projects?.length || 0} projects, {skills?.length || 0} skills loaded from Supabase
        </p>
      </div>
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Verify dev server works**

```bash
npm run dev
```

Visit `http://localhost:4321` — should see the hero text with data from Supabase.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add index.astro with Supabase data fetching skeleton"
```

---

## Phase 1 Completion Checklist

At the end of Phase 1, verify:
- [ ] `npm run build` succeeds
- [ ] `npm run dev` shows the skeleton page with Supabase data
- [ ] All TypeScript types match the DB schema
- [ ] i18n hook works (can import and call `useTranslation`)
- [ ] Migration SQL is complete and matches the types
- [ ] Seed SQL inserts all CV content from the requirements
