# Prompt para Claude Code — Portafolio Web de Michel Encarnación Dionicio

> **Instrucción:** Copia y pega TODO este documento como prompt en Claude Code para que construya tu portafolio completo.

---

## Prompt

Construye mi portafolio web profesional como desarrollador de software desde cero usando **Astro + React + Tailwind CSS + Supabase**. Debe ser una web moderna, limpia y elegante con animaciones suaves estilo Apple. El sitio debe ser **bilingüe (inglés/español)** con un toggle de idioma persistente. Incluye un **panel de administración CMS completo** en `/admin` con autenticación Supabase para que pueda editar todo el contenido del portafolio (proyectos, skills, experiencia, hero, imágenes, CV) sin tocar código, con preview en vivo, sistema de drafts, y versionado con rollback.

---

## 1. Stack Tecnológico

- **Framework:** Astro 5 (SSR/SSG híbrido) con integraciones de React
- **Componentes interactivos:** React 19 (islands architecture de Astro)
- **Estilos:** Tailwind CSS 4
- **Animaciones:** Framer Motion (para componentes React) + CSS animations nativas
- **Backend & Base de datos:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **ORM/Client:** `@supabase/supabase-js` v2
- **Internacionalización:** Sistema i18n con JSON locales para UI estática + campos bilingües (`_en` / `_es`) en Supabase para contenido dinámico del CMS
- **Iconos:** Lucide React o Phosphor Icons
- **Formulario de contacto:** Integración con Formspree o Resend (endpoint configurable por variable de entorno)
- **Admin Panel:** React SPA dentro de Astro (ruta `/admin`) con Supabase Auth (email/password)
- **Editor de texto enriquecido:** TipTap (para descripciones largas de proyectos y experiencia)
- **Deploy-ready:** Configurado para deploy en Vercel o Netlify (modo SSR con adaptador para rutas del admin)

---

## 2. Estructura del Proyecto

```
/
├── public/
│   ├── images/
│   │   ├── projects/        # Screenshots de proyectos
│   │   └── profile.webp     # Foto de perfil (placeholder)
│   ├── resume.pdf           # CV descargable
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Navegación sticky + toggle idioma
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx            # Hero con parallax (datos de Supabase)
│   │   │   ├── Projects.tsx        # Grid/cards de proyectos (datos de Supabase)
│   │   │   ├── Skills.tsx          # Visualización de skills (datos de Supabase)
│   │   │   ├── Experience.tsx      # Timeline de experiencia (datos de Supabase)
│   │   │   └── Contact.tsx         # Formulario de contacto
│   │   ├── ui/
│   │   │   ├── ScrollReveal.tsx    # Wrapper de animación scroll
│   │   │   ├── LanguageToggle.tsx  # Switch ES/EN
│   │   │   ├── ProjectCard.tsx     # Card individual de proyecto
│   │   │   └── SkillBar.tsx        # Barra/chip de skill
│   │   └── admin/
│   │       ├── AdminLayout.tsx     # Layout del panel admin (sidebar + topbar)
│   │       ├── AuthGuard.tsx       # Wrapper de protección de rutas
│   │       ├── LoginForm.tsx       # Formulario de login
│   │       ├── Dashboard.tsx       # Vista principal con resumen
│   │       ├── HeroEditor.tsx      # Editor de textos del Hero
│   │       ├── ProjectsManager.tsx # CRUD de proyectos con drag & drop
│   │       ├── ProjectForm.tsx     # Formulario de crear/editar proyecto
│   │       ├── SkillsManager.tsx   # CRUD de skills y certificaciones
│   │       ├── ExperienceManager.tsx # CRUD de timeline de experiencia
│   │       ├── MediaLibrary.tsx    # Galería de imágenes con upload
│   │       ├── ContactInfoEditor.tsx # Editor de links sociales y datos
│   │       ├── ResumeUploader.tsx  # Upload de CV/PDF
│   │       ├── PreviewPane.tsx     # Preview en vivo del portafolio
│   │       └── VersionHistory.tsx  # Historial de versiones y rollback
│   ├── hooks/
│   │   ├── useTranslation.ts      # Hook para i18n
│   │   └── useSupabase.ts         # Hook para operaciones Supabase
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase (browser)
│   │   ├── supabase-server.ts     # Cliente Supabase (server-side para Astro)
│   │   ├── types.ts               # TypeScript types para las tablas de Supabase
│   │   └── storage.ts             # Helpers para Supabase Storage (upload/delete imgs)
│   ├── locales/
│   │   ├── en.json
│   │   └── es.json
│   ├── layouts/
│   │   └── Layout.astro            # Layout principal con SEO
│   ├── pages/
│   │   ├── index.astro             # Página principal (single page, datos de Supabase)
│   │   └── admin/
│   │       ├── index.astro         # Dashboard admin (SSR, protegido)
│   │       └── login.astro         # Página de login
│   └── styles/
│       └── global.css              # Estilos globales + fuentes
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Migración SQL con todas las tablas
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── tsconfig.json
```

---

## 3. Diseño y Estilo Visual

### Filosofía de diseño
- **Estilo Apple-like:** Limpio, espacioso, tipografía grande, mucho whitespace
- **Paleta de colores:**
  - Fondo principal: `#fafafa` (light) / `#0a0a0a` (dark mode)
  - Acento primario: `#3b82f6` (azul) con gradiente sutil hacia `#8b5cf6` (violeta)
  - Texto principal: `#171717` (light) / `#ededed` (dark)
  - Texto secundario: `#737373`
  - Bordes y separadores: `#e5e5e5` (light) / `#262626` (dark)
- **Soporte Dark/Light mode** con toggle y detección de preferencia del sistema
- **Tipografía:** Inter (body) + Sora o Manrope (headings) — cargadas desde Google Fonts con `font-display: swap`
- **Border radius:** Redondeado generoso (`rounded-2xl` en cards)
- **Glassmorphism sutil** en el navbar (backdrop-blur)

### Responsive
- Mobile-first, breakpoints: `sm`, `md`, `lg`, `xl`
- Navbar colapsable a hamburger en mobile
- Grid de proyectos: 1 col mobile → 2 cols tablet → 3 cols desktop

---

## 4. Secciones y Contenido

### 4.1 Navbar
- Sticky con efecto glassmorphism (blur de fondo)
- Links: Hero, Projects, Skills, Experience, Contact
- Toggle de idioma (ES/EN) con banderitas o texto
- Toggle dark/light mode
- Smooth scroll al hacer click en los links
- En mobile: hamburger menu con animación

### 4.2 Hero Section
- **Layout:** Texto a la izquierda, elemento visual/abstracto a la derecha
- **Efecto parallax** suave en el fondo (formas geométricas o gradientes que se mueven al hacer scroll)
- **Contenido EN:**
  - Greeting: "Hi, I'm"
  - Nombre: "Michel Encarnación"
  - Tagline: "Software Engineering Student & Full-Stack Developer"
  - Descripción breve: "Passionate about building innovative solutions. Currently leading UPAEP's satellite dashboard and serving as President of the IT Faculty Board."
  - Botones CTA: "View Projects" + "Download CV"
- **Contenido ES:**
  - Greeting: "Hola, soy"
  - Nombre: "Michel Encarnación"
  - Tagline: "Estudiante de Ingeniería de Software & Desarrollador Full-Stack"
  - Descripción breve: "Apasionado por construir soluciones innovadoras. Actualmente liderando el dashboard satelital de UPAEP y Presidente de la Mesa Directiva de la Facultad de TI."
  - Botones CTA: "Ver Proyectos" + "Descargar CV"
- Indicador de scroll animado (flecha o mouse icon)

### 4.3 Projects Section
- Título: "Featured Projects" / "Proyectos Destacados"
- Grid de cards con **hover effect** (elevación + sombra sutil)
- Cada card muestra: imagen/screenshot, título, descripción corta, tech stack (badges), botón "Ver más"
- **Scroll reveal:** Cards aparecen con fade-in + slide-up escalonado

#### Proyectos a incluir:

**1. GXIBA — Satellite Metrics Web Platform**
- Tags: `Astro` `React` `PHP` `Tailwind` `Supabase`
- EN: "Lead developer for UPAEP's satellite telemetry dashboard. Built real-time data visualization for satellite metrics using Astro and React with Supabase as the data layer."
- ES: "Desarrollador líder del dashboard de telemetría satelital de UPAEP. Visualización de datos en tiempo real con Astro, React y Supabase."
- Status: In Progress 🟢

**2. GYOLAP — Medical Appointment System**
- Tags: `PHP` `JavaScript` `MySQL` `Bootstrap`
- EN: "Full-stack web-based medical appointment system for a gynecology clinic. Features patient booking, schedule management, and a secure admin panel."
- ES: "Sistema web de citas médicas para clínica ginecológica. Incluye reserva de citas, gestión de horarios y panel de administración seguro."
- Status: Completed ✅

**3. Intelligent Parking System**
- Tags: `Python` `Arduino` `IoT`
- EN: "Automated smart parking system to reduce waiting times. Built with Python as the core language and Arduino for real-time detection and monitoring."
- ES: "Sistema de estacionamiento inteligente automatizado para reducir tiempos de espera. Python como lenguaje principal y Arduino para detección en tiempo real."
- Status: Completed ✅

**4. Car-Dealership UX/UI**
- Tags: `Figma` `UX/UI` `Prototyping`
- EN: "Complete responsive interface design for an automotive dealership management platform. Wireframes, high-fidelity prototypes, and interactive flows."
- ES: "Diseño completo de interfaz responsive para plataforma de gestión de concesionaria automotriz. Wireframes, prototipos de alta fidelidad y flujos interactivos."
- Status: Completed ✅

**5. ADMEX — Finance & Inventory App**
- Tags: `Figma` `UX/UI` `RealEye`
- EN: "UX/UI design for a mobile platform managing finances and inventory for small businesses. Usability tested with RealEye."
- ES: "Diseño UX/UI para plataforma móvil de gestión de finanzas e inventario para pequeños negocios. Pruebas de usabilidad con RealEye."
- Status: Completed ✅

**6. Custom SQL ERP Database**
- Tags: `SQL` `Database Design` `ERP`
- EN: "Designed and implemented a relational database with plans to scale into a customized ERP system for a small business."
- ES: "Diseño e implementación de base de datos relacional con planes de escalarlo a un sistema ERP personalizado."
- Status: Completed ✅

### 4.4 Skills Section
- Título: "Tech Stack" / "Stack Tecnológico"
- **Visualización interactiva:** Barras de progreso animadas O chips/badges agrupados por categoría con efecto hover
- **Scroll reveal** al entrar en viewport

#### Categorías y skills:

**Languages:**
- C / C++ (2 years)
- Java (1 year)
- Python (1 year)
- PHP (6 months)
- JavaScript
- SQL
- HTML5 / CSS3

**Frameworks & Tools:**
- Astro
- React
- Tailwind CSS
- Bootstrap
- Figma

**Databases & Backend:**
- MySQL
- Supabase
- SQL Database Design

**Other:**
- Arduino / IoT
- Git
- UX/UI Design
- Project Management
- Network Fundamentals (CCNA)

**Certifications:**
- Cisco CCNA v7: Introduction to Networks
- Oracle Academy: Database Foundations & DB Programming with SQL

### 4.5 Experience Section
- Título: "Experience" / "Experiencia"
- **Layout:** Timeline vertical con línea animada
- **Scroll reveal** en cada nodo del timeline

#### Items:

**1. President — Board of Directors, IT Faculty (UPAEP)**
- Período: Jun 2024 – Present
- EN: "Leading and coordinating the IT faculty board. Serving as intermediary between university authorities and faculty members, ensuring proper coordination and information flow."
- ES: "Liderando y coordinando la mesa directiva de la facultad de TI. Intermediario entre autoridades universitarias y miembros de la facultad."

**2. UPAEP Hackathon Participant (2023 & 2024)**
- EN: "Competed in 24-hour programming marathons using C++."
- ES: "Participación en maratones de programación de 24 horas en C++."

**3. Education**
- Universidad Popular Autónoma del Estado de Puebla (UPAEP)
- Software Engineering Degree | 2022 – Present | GPA: 9.5/10
- 60% Academic Scholarship
- Graduating June 2026

### 4.6 Contact Section
- Título: "Let's Connect" / "Conectemos"
- Formulario con campos: Name, Email, Message
- Validación client-side
- Integración con Formspree (el `action` URL se configura vía variable de entorno `PUBLIC_FORM_ENDPOINT`)
- Links sociales: LinkedIn, GitHub, Email (mailto:michel.encarnacion@upaep.edu.mx)
- Teléfono: 2213411834 (con link `tel:`)
- Animación de éxito al enviar

---

## 5. Animaciones

- **Scroll Reveal:** Componente `<ScrollReveal>` wrapper usando Framer Motion `useInView`. Efecto: fade-in + translateY(20px→0) con `duration: 0.6s` y `ease: easeOut`. Stagger de 0.1s entre elementos hermanos.
- **Parallax en Hero:** El fondo del hero (formas abstractas/gradientes) se mueve a velocidad diferente al scroll usando `useScroll` + `useTransform` de Framer Motion.
- **Hover en cards:** Scale sutil (`scale: 1.02`), sombra elevada, transición `300ms ease`.
- **Navbar:** Aparece/desaparece con scroll direction detection.
- **Timeline:** La línea se dibuja progresivamente al hacer scroll (CSS `stroke-dashoffset` animation).
- **Skill bars:** Se llenan al entrar en viewport.

---

## 6. SEO y Performance

- Meta tags dinámicos por idioma (título, descripción, og:image)
- `<html lang="">` dinámico según idioma seleccionado
- Imágenes optimizadas con `<Image>` de Astro (WebP/AVIF)
- Lazy loading en imágenes de proyectos
- Lighthouse target: 95+ en todas las categorías
- Sitemap generado automáticamente
- `robots.txt`

---

## 7. Base de Datos — Esquema Supabase

### Filosofía de datos
Todo el contenido del portafolio vive en Supabase. El frontend público consulta las tablas con `status = 'published'`. El admin panel hace CRUD completo. Cada registro editable tiene campos bilingües (`_en` / `_es`), timestamps, y soporte para drafts y versionado.

### Tablas

**`hero_content`** (single row, el contenido del hero)
```sql
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  greeting_en TEXT NOT NULL DEFAULT 'Hi, I''m',
  greeting_es TEXT NOT NULL DEFAULT 'Hola, soy',
  name TEXT NOT NULL DEFAULT 'Michel Encarnación',
  tagline_en TEXT NOT NULL,
  tagline_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  profile_image_url TEXT,       -- URL de Supabase Storage
  resume_url TEXT,              -- URL del PDF en Storage
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`projects`**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  long_description_en TEXT,     -- Contenido enriquecido (TipTap HTML)
  long_description_es TEXT,
  image_url TEXT,               -- Screenshot principal
  gallery_urls TEXT[] DEFAULT '{}', -- Screenshots adicionales
  tags TEXT[] DEFAULT '{}',     -- ['React', 'Astro', 'Supabase']
  project_url TEXT,             -- Link al proyecto en vivo
  repo_url TEXT,                -- Link al repositorio
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INT NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,                -- NULL = en progreso
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`skills`**
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('languages', 'frameworks', 'databases', 'other')),
  icon TEXT,                    -- Nombre del icono de Lucide o URL
  proficiency INT DEFAULT 0 CHECK (proficiency BETWEEN 0 AND 100),
  years_experience TEXT,        -- '2 years', '6 months', etc.
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`certifications`**
```sql
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  issuer TEXT NOT NULL,         -- 'Cisco', 'Oracle', etc.
  credential_url TEXT,
  date_obtained DATE,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`experience`**
```sql
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  organization TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('work', 'education', 'hackathon', 'leadership')),
  start_date DATE NOT NULL,
  end_date DATE,                -- NULL = presente
  sort_order INT NOT NULL DEFAULT 0,
  extra_info TEXT,              -- GPA, scholarship, etc.
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`contact_info`** (single row)
```sql
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
```

**`content_versions`** (historial de versiones para rollback)
```sql
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,     -- 'projects', 'hero_content', etc.
  record_id UUID NOT NULL,
  snapshot JSONB NOT NULL,      -- Snapshot completo del registro
  version INT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_versions_lookup ON content_versions(table_name, record_id, version DESC);
```

### Row Level Security (RLS)
```sql
-- Público: solo lectura de registros publicados
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON projects
  FOR SELECT USING (status = 'published');

-- Admin: CRUD completo para usuarios autenticados
CREATE POLICY "Admin full access" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Aplicar el mismo patrón a TODAS las tablas de contenido
```

### Supabase Storage Buckets
```
- portfolio-images/         -- Imágenes de proyectos y perfil (público)
  ├── profile/
  ├── projects/
  └── gallery/
- documents/                -- CVs y PDFs (público)
```

### Trigger para auto-versionado
```sql
CREATE OR REPLACE FUNCTION save_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO content_versions (table_name, record_id, snapshot, version, changed_by)
  VALUES (TG_TABLE_NAME, OLD.id, to_jsonb(OLD), OLD.version, auth.uid());
  NEW.version := OLD.version + 1;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a cada tabla editable:
CREATE TRIGGER version_projects BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION save_version();
CREATE TRIGGER version_hero BEFORE UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION save_version();
CREATE TRIGGER version_experience BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION save_version();
```

### Seed Data
Incluir un archivo `supabase/seed.sql` que inserte TODO el contenido de mi CV (el que ya está definido en la sección 4 de este documento) como datos iniciales en las tablas correspondientes, tanto en inglés como en español.

---

## 8. Admin Panel — CMS Completo

### Autenticación
- **Supabase Auth** con email/password (solo un usuario admin)
- Ruta `/admin/login` con formulario de email + contraseña
- Todas las rutas `/admin/*` protegidas con `AuthGuard.tsx` que verifica sesión activa
- Redirect a `/admin/login` si no hay sesión
- Logout button en el sidebar del admin

### Layout del Admin
- **Sidebar** fijo a la izquierda con navegación:
  - Dashboard (resumen)
  - Hero Content
  - Projects
  - Skills & Certifications
  - Experience
  - Media Library
  - Contact Info
  - Resume/CV
  - Version History
- **Topbar** con: nombre del usuario, botón de preview, botón de logout
- **Diseño:** Limpio, funcional, usando los mismos colores del portafolio. Dark mode por defecto en el admin.

### 8.1 Dashboard
- Resumen de contenido: número de proyectos (publicados/drafts), skills, items de experiencia
- Último contenido actualizado
- Accesos rápidos a las secciones más editadas
- Estado del sitio: última fecha de actualización

### 8.2 Hero Editor (`HeroEditor.tsx`)
- Formulario para editar: greeting, nombre, tagline, descripción (EN y ES en tabs o side-by-side)
- Upload de foto de perfil (con crop/preview)
- Upload de CV/PDF
- Toggle de estado: Draft / Published
- Botón de guardar con feedback visual (toast notification)
- Preview en vivo en un panel lateral que muestra cómo se verá el hero

### 8.3 Projects Manager (`ProjectsManager.tsx`)
- **Lista** de todos los proyectos como cards o tabla con:
  - Thumbnail, título, status badge (draft/published), fecha, tags
  - Botones: Edit, Duplicate, Delete, Toggle status
- **Drag & drop** para reordenar (actualiza `sort_order`)
- **Botón "New Project"** que abre `ProjectForm.tsx`

### 8.4 Project Form (`ProjectForm.tsx`)
- Campos: título, slug (auto-generado desde título, editable), descripciones EN/ES
- **TipTap editor** para las descripciones largas (con formato, links, código)
- Tags input con autocompletado de tags existentes
- Upload de screenshot principal + galería de imágenes adicionales
- URLs: proyecto en vivo + repositorio
- Fechas de inicio/fin (date picker, checkbox "en progreso" para end_date null)
- Toggle: Draft / Published
- **Preview pane** en tiempo real que muestra la ProjectCard tal como se verá en el portafolio
- Botón guardar + notificación de éxito/error

### 8.5 Skills Manager (`SkillsManager.tsx`)
- Tabla editable de skills agrupados por categoría
- Campos inline: nombre, categoría (dropdown), proficiency (slider 0-100), años de experiencia
- Drag & drop para reordenar dentro de cada categoría
- Agregar/eliminar skills
- Sección separada para Certificaciones (título EN/ES, emisor, URL de credencial, fecha)

### 8.6 Experience Manager (`ExperienceManager.tsx`)
- Timeline editable con drag & drop para reordenar
- Formulario por item: título EN/ES, organización, descripción EN/ES, tipo (dropdown), fechas, info extra
- Preview del timeline en vivo

### 8.7 Media Library (`MediaLibrary.tsx`)
- Grid de todas las imágenes subidas a Supabase Storage
- Upload por drag & drop o click (múltiples archivos)
- Preview de imagen con metadata (tamaño, dimensiones, fecha de subida)
- Eliminar imágenes (con confirmación)
- Copiar URL al clipboard
- Filtro por carpeta: profile, projects, gallery

### 8.8 Contact Info Editor (`ContactInfoEditor.tsx`)
- Formulario simple: email, teléfono, LinkedIn URL, GitHub URL, Twitter URL, ubicación
- Guardado con feedback visual

### 8.9 Resume Uploader (`ResumeUploader.tsx`)
- Upload de PDF con preview embebido
- Reemplaza el archivo anterior en Storage
- Muestra la URL pública del CV actual

### 8.10 Preview en Vivo (`PreviewPane.tsx`)
- Botón "Preview Site" en la topbar del admin
- Abre un iframe o nueva pestaña que renderiza el portafolio con los datos actuales de Supabase (incluyendo drafts marcados con un banner "DRAFT")
- Permite alternar entre vista EN/ES y mobile/desktop

### 8.11 Version History (`VersionHistory.tsx`)
- Lista cronológica de todos los cambios agrupados por tabla y registro
- Cada entrada muestra: fecha, tabla, campo(s) cambiado(s), versión
- Botón **"Restore"** que hace rollback a una versión anterior (copia el snapshot de `content_versions` de vuelta al registro original)
- Diff visual: resaltar campos que cambiaron entre versiones (texto en rojo/verde)
- Filtro por tabla: "Solo proyectos", "Solo hero", etc.

---

## 9. Integración Frontend ↔ Supabase

### Cómo el portafolio público consume los datos
- En `index.astro`, hacer fetch server-side a Supabase en el frontmatter de Astro para obtener los datos publicados
- Pasar los datos como props a los componentes React de cada sección
- Esto mantiene el SSR/SSG: la página se genera con los datos más recientes en cada build o request

```astro
---
// index.astro
import { supabaseServer } from '../lib/supabase-server';

const { data: heroData } = await supabaseServer.from('hero_content').select('*').eq('status', 'published').single();
const { data: projects } = await supabaseServer.from('projects').select('*').eq('status', 'published').order('sort_order');
const { data: skills } = await supabaseServer.from('skills').select('*').eq('status', 'published').order('sort_order');
const { data: experience } = await supabaseServer.from('experience').select('*').eq('status', 'published').order('sort_order');
const { data: contactInfo } = await supabaseServer.from('contact_info').select('*').single();
---

<Layout>
  <Hero client:load data={heroData} />
  <Projects client:visible data={projects} />
  <Skills client:visible data={skills} />
  <Experience client:visible data={experience} />
  <Contact client:visible contactInfo={contactInfo} />
</Layout>
```

### El admin panel
- Usa `client:load` para todos sus componentes (es una SPA interactiva)
- Se conecta a Supabase directamente desde el browser con el client de Supabase
- Supabase RLS protege los datos: solo lectura pública, CRUD para autenticados

---

## 10. Configuración de Deploy

- Generar `astro.config.mjs` listo para Vercel (`@astrojs/vercel`)
- Variables de entorno en `.env.example`:
  ```
  PUBLIC_SUPABASE_URL=https:
  PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...  # Solo server-side, nunca exponer
  
  ```

---

## 11. Instrucciones finales para Claude Code

1. Inicializa el proyecto con `npm create astro@latest` y configura las integraciones necesarias (react, tailwind, vercel/netlify adapter con modo SSR).
2. Instala todas las dependencias: `@astrojs/react`, `@astrojs/tailwind`, `framer-motion`, `lucide-react`, `@supabase/supabase-js`, `@tiptap/react`, `@tiptap/starter-kit`.
3. Crea TODOS los archivos listados en la estructura del proyecto, incluyendo la carpeta `src/components/admin/` completa.
4. Genera el archivo `supabase/migrations/001_initial_schema.sql` con TODO el esquema SQL (tablas, RLS, triggers, storage buckets) definido en la sección 7.
5. Genera `supabase/seed.sql` con todos los datos de mi CV como seed data (contenido de la sección 4, tanto EN como ES).
6. Crea `src/lib/supabase.ts` (browser client) y `src/lib/supabase-server.ts` (server client) con tipado TypeScript completo para todas las tablas.
7. Asegúrate de que los archivos JSON de i18n contengan TODAS las traducciones de la UI estática (labels, botones, navegación).
8. El portafolio público (`index.astro`) debe hacer fetch de Supabase server-side y pasar datos como props a los componentes React.
9. Cada sección del portafolio debe ser un componente React independiente importado como island. Usa `client:visible` para below the fold y `client:load` para Hero, Navbar y todo el Admin.
10. Las rutas `/admin/*` deben estar protegidas con `AuthGuard.tsx`. Redirect a `/admin/login` si no hay sesión activa.
11. El admin panel debe ser funcional: CRUD completo para todas las tablas, upload de imágenes/PDFs a Supabase Storage, drag & drop para reordenar, preview en vivo, y historial de versiones con rollback.
12. Incluye imágenes placeholder donde se necesiten screenshots (usa gradientes o SVGs como placeholder).
13. El sitio debe compilar sin errores con `npm run build`.
14. Incluye un `README.md` completo con: instrucciones de instalación, setup de Supabase (crear proyecto, correr migraciones, crear usuario admin), variables de entorno, desarrollo local, y deploy.
15. Hazlo pixel-perfect, como si fuera a producción.