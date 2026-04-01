# Phase 3: Admin Panel CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete CMS admin panel at `/admin` with Supabase Auth, CRUD for all content tables, media library, drag & drop reordering, live preview, and version history with rollback.

**Architecture:** The admin is a React SPA rendered inside Astro SSR pages. All `/admin/*` routes use `client:load`. Auth uses Supabase email/password. `AuthGuard.tsx` wraps all admin routes and redirects to `/admin/login` if no active session. The admin uses the browser Supabase client directly — RLS policies ensure only authenticated users can write.

**Tech Stack:** React 19, Supabase Auth, TipTap editor, Lucide React, Tailwind CSS 4

**Depends on:** Phase 1 complete (Supabase clients, types, storage helpers)

---

### Task 1: Supabase Hook for Admin Operations

**Files:**
- Create: `src/hooks/useSupabase.ts`

- [ ] **Step 1: Create useSupabase hook**

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, loading, signIn, signOut };
}

export function useTable<T>(tableName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async (orderBy = 'sort_order') => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(orderBy);
    if (error) throw error;
    setData((data as T[]) || []);
    setLoading(false);
    return data as T[];
  };

  const fetchSingle = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .single();
    if (error) throw error;
    setData(data ? [data as T] : []);
    setLoading(false);
    return data as T;
  };

  const insert = async (record: Partial<T>) => {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  };

  const update = async (id: string, updates: Partial<T>) => {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  };

  const updateOrder = async (items: Array<{ id: string; sort_order: number }>) => {
    for (const item of items) {
      await supabase
        .from(tableName)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }
  };

  return { data, loading, fetchAll, fetchSingle, insert, update, remove, updateOrder };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useSupabase.ts
git commit -m "feat: add useAuth and useTable hooks for admin operations"
```

---

### Task 2: AuthGuard + LoginForm

**Files:**
- Create: `src/components/admin/AuthGuard.tsx`
- Create: `src/components/admin/LoginForm.tsx`

- [ ] **Step 1: Create AuthGuard**

```tsx
import { type ReactNode } from 'react';
import { useAuth } from '../../hooks/useSupabase';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Create LoginForm**

```tsx
import { useState, type FormEvent } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useSupabase';

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-accent to-accent-violet bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-neutral-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50"
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AuthGuard.tsx src/components/admin/LoginForm.tsx
git commit -m "feat: add AuthGuard and LoginForm with Supabase Auth"
```

---

### Task 3: Admin Layout (Sidebar + Topbar)

**Files:**
- Create: `src/components/admin/AdminLayout.tsx`

- [ ] **Step 1: Create AdminLayout**

```tsx
import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Type, FolderOpen, Wrench, Briefcase,
  Image, Contact, FileText, History, LogOut, Eye, Menu, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useSupabase';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Content', icon: Type },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills', label: 'Skills & Certs', icon: Wrench },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'media', label: 'Media Library', icon: Image },
  { id: 'contact', label: 'Contact Info', icon: Contact },
  { id: 'resume', label: 'Resume/CV', icon: FileText },
  { id: 'versions', label: 'Version History', icon: History },
];

export default function AdminLayout({ children, activeSection, onNavigate }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <span className="text-xl font-heading font-bold bg-gradient-to-r from-accent to-accent-violet bg-clip-text text-transparent">
            Portfolio CMS
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onNavigate(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-accent/10 text-accent border-r-2 border-accent'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-800"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block text-sm text-neutral-400">
            {user?.email}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              <Eye size={16} /> Preview Site
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/AdminLayout.tsx
git commit -m "feat: add AdminLayout with sidebar, topbar, mobile menu"
```

---

### Task 4: Dashboard

**Files:**
- Create: `src/components/admin/Dashboard.tsx`

- [ ] **Step 1: Create Dashboard with content summary**

```tsx
import { useState, useEffect } from 'react';
import { FolderOpen, Wrench, Briefcase, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stat {
  label: string;
  published: number;
  drafts: number;
  icon: typeof FolderOpen;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [projects, skills, experience, certifications] = await Promise.all([
      supabase.from('projects').select('status'),
      supabase.from('skills').select('status'),
      supabase.from('experience').select('status'),
      supabase.from('certifications').select('status'),
    ]);

    const count = (data: Array<{ status: string }> | null, status: string) =>
      (data || []).filter((r) => r.status === status).length;

    setStats([
      { label: 'Projects', published: count(projects.data, 'published'), drafts: count(projects.data, 'draft'), icon: FolderOpen },
      { label: 'Skills', published: count(skills.data, 'published'), drafts: count(skills.data, 'draft'), icon: Wrench },
      { label: 'Experience', published: count(experience.data, 'published'), drafts: count(experience.data, 'draft'), icon: Briefcase },
      { label: 'Certifications', published: count(certifications.data, 'published'), drafts: count(certifications.data, 'draft'), icon: FileText },
    ]);

    // Get last update time
    const { data: versions } = await supabase
      .from('content_versions')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (versions && versions.length > 0) {
      setLastUpdate(new Date(versions[0].created_at).toLocaleString());
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, published, drafts, icon: Icon }) => (
          <div
            key={label}
            className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-accent/10">
                <Icon size={20} className="text-accent" />
              </div>
              <span className="text-sm text-neutral-400">{label}</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">{published}</span>
              <span className="text-sm text-neutral-500 mb-1">published</span>
            </div>
            {drafts > 0 && (
              <p className="text-xs text-yellow-500 mt-1">{drafts} draft(s)</p>
            )}
          </div>
        ))}
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="mt-8 p-4 rounded-xl border border-neutral-800 bg-neutral-900 text-sm text-neutral-400">
          Last content update: <span className="text-white">{lastUpdate}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/Dashboard.tsx
git commit -m "feat: add admin Dashboard with content stats"
```

---

### Task 5: HeroEditor

**Files:**
- Create: `src/components/admin/HeroEditor.tsx`

- [ ] **Step 1: Create HeroEditor with bilingual tabs**

```tsx
import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import { uploadImage, uploadDocument } from '../../lib/storage';
import type { HeroContent } from '../../lib/types';

export default function HeroEditor() {
  const { fetchSingle, update } = useTable<HeroContent>('hero_content');
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'en' | 'es'>('en');

  useEffect(() => {
    fetchSingle().then(setHero);
  }, []);

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    try {
      await update(hero.id, {
        greeting_en: hero.greeting_en,
        greeting_es: hero.greeting_es,
        name: hero.name,
        tagline_en: hero.tagline_en,
        tagline_es: hero.tagline_es,
        description_en: hero.description_en,
        description_es: hero.description_es,
        profile_image_url: hero.profile_image_url,
        resume_url: hero.resume_url,
        status: hero.status,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    const url = await uploadImage(file, 'profile');
    setHero({ ...hero, profile_image_url: url });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    const url = await uploadDocument(file);
    setHero({ ...hero, resume_url: url });
  };

  if (!hero) return <div className="text-neutral-400">Loading...</div>;

  const field = (key: string, label: string, multiline = false) => {
    const fullKey = `${key}_${tab}` as keyof HeroContent;
    const value = (hero[fullKey] as string) || '';
    return (
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setHero({ ...hero, [fullKey]: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none transition resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setHero({ ...hero, [fullKey]: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none transition"
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Hero Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Name (shared) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
        <input
          type="text"
          value={hero.name}
          onChange={(e) => setHero({ ...hero, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none transition"
        />
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2 mb-6">
        {(['en', 'es'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setTab(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {field('greeting', 'Greeting')}
        {field('tagline', 'Tagline')}
        {field('description', 'Description', true)}
      </div>

      {/* Uploads */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-neutral-400" />
          {hero.profile_image_url && (
            <img src={hero.profile_image_url} alt="Profile" className="mt-3 w-24 h-24 rounded-full object-cover" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Resume PDF</label>
          <input type="file" accept=".pdf" onChange={handleResumeUpload} className="text-sm text-neutral-400" />
          {hero.resume_url && (
            <a href={hero.resume_url} target="_blank" rel="noopener noreferrer" className="block mt-3 text-sm text-accent hover:underline">
              View current PDF
            </a>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
        <select
          value={hero.status}
          onChange={(e) => setHero({ ...hero, status: e.target.value as 'draft' | 'published' })}
          className="px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/HeroEditor.tsx
git commit -m "feat: add HeroEditor with bilingual tabs, image/resume upload"
```

---

### Task 6: ProjectForm

**Files:**
- Create: `src/components/admin/ProjectForm.tsx`

- [ ] **Step 1: Create ProjectForm with TipTap, tags, image upload**

```tsx
import { useState, useEffect } from 'react';
import { Save, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useTable } from '../../hooks/useSupabase';
import { uploadImage } from '../../lib/storage';
import type { Project } from '../../lib/types';

interface ProjectFormProps {
  projectId: string | null;
  onBack: () => void;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProjectForm({ projectId, onBack }: ProjectFormProps) {
  const { fetchAll, insert, update } = useTable<Project>('projects');
  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description_en: '',
    description_es: '',
    long_description_en: '',
    long_description_es: '',
    image_url: '',
    tags: [],
    project_url: '',
    repo_url: '',
    status: 'draft',
    start_date: null,
    end_date: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [inProgress, setInProgress] = useState(false);

  const editorEn = useEditor({
    extensions: [StarterKit, Link],
    content: project.long_description_en || '',
    onUpdate: ({ editor }) => {
      setProject((p) => ({ ...p, long_description_en: editor.getHTML() }));
    },
  });

  const editorEs = useEditor({
    extensions: [StarterKit, Link],
    content: project.long_description_es || '',
    onUpdate: ({ editor }) => {
      setProject((p) => ({ ...p, long_description_es: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (projectId) {
      fetchAll('sort_order').then((all) => {
        const found = all.find((p) => p.id === projectId);
        if (found) {
          setProject(found);
          setInProgress(!found.end_date);
          editorEn?.commands.setContent(found.long_description_en || '');
          editorEs?.commands.setContent(found.long_description_es || '');
        }
      });
    }
  }, [projectId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...project,
        end_date: inProgress ? null : project.end_date,
        slug: project.slug || slugify(project.title || ''),
      };
      if (projectId) {
        await update(projectId, payload);
      } else {
        await insert(payload);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, 'projects');
    setProject((p) => ({ ...p, image_url: url }));
  };

  const addTag = () => {
    if (tagInput.trim() && !project.tags?.includes(tagInput.trim())) {
      setProject((p) => ({ ...p, tags: [...(p.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setProject((p) => ({ ...p, tags: (p.tags || []).filter((t) => t !== tag) }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-neutral-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-heading font-bold">
            {projectId ? 'Edit Project' : 'New Project'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
            <input
              type="text"
              value={project.title || ''}
              onChange={(e) => setProject({ ...project, title: e.target.value, slug: slugify(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Slug</label>
            <input
              type="text"
              value={project.slug || ''}
              onChange={(e) => setProject({ ...project, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          {/* Language Tabs */}
          <div className="flex gap-2">
            {(['en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setTab(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  tab === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Short Description ({tab.toUpperCase()})</label>
            <textarea
              value={(project[`description_${tab}` as keyof Project] as string) || ''}
              onChange={(e) => setProject({ ...project, [`description_${tab}`]: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Long Description ({tab.toUpperCase()}) — Rich Text</label>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 prose prose-invert max-w-none prose-sm">
              <EditorContent editor={tab === 'en' ? editorEn : editorEs} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
            <select
              value={project.status || 'draft'}
              onChange={(e) => setProject({ ...project, status: e.target.value as 'draft' | 'published' })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Screenshot</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-neutral-400" />
            {project.image_url && (
              <img src={project.image_url} alt="Preview" className="mt-3 w-full rounded-xl" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(project.tags || []).map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-300">
                  {tag}
                  <button onClick={() => removeTag(tag)}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Project URL</label>
            <input
              type="url"
              value={project.project_url || ''}
              onChange={(e) => setProject({ ...project, project_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Repository URL</label>
            <input
              type="url"
              value={project.repo_url || ''}
              onChange={(e) => setProject({ ...project, repo_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Start Date</label>
            <input
              type="date"
              value={project.start_date || ''}
              onChange={(e) => setProject({ ...project, start_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={inProgress}
                onChange={(e) => setInProgress(e.target.checked)}
                className="rounded"
              />
              In Progress (no end date)
            </label>
            {!inProgress && (
              <input
                type="date"
                value={project.end_date || ''}
                onChange={(e) => setProject({ ...project, end_date: e.target.value })}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/ProjectForm.tsx
git commit -m "feat: add ProjectForm with TipTap editor, tags, image upload"
```

---

### Task 7: ProjectsManager

**Files:**
- Create: `src/components/admin/ProjectsManager.tsx`

- [ ] **Step 1: Create ProjectsManager with list, status toggle, delete**

```tsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import ProjectForm from './ProjectForm';
import type { Project } from '../../lib/types';

export default function ProjectsManager() {
  const { data: projects, fetchAll, update, remove, insert, updateOrder } = useTable<Project>('projects');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAll('sort_order');
  }, []);

  if (showForm || editingId) {
    return (
      <ProjectForm
        projectId={editingId}
        onBack={() => { setEditingId(null); setShowForm(false); fetchAll('sort_order'); }}
      />
    );
  }

  const toggleStatus = async (project: Project) => {
    await update(project.id, {
      status: project.status === 'published' ? 'draft' : 'published',
    });
    fetchAll('sort_order');
  };

  const duplicateProject = async (project: Project) => {
    const { id, created_at, updated_at, version, ...rest } = project;
    await insert({ ...rest, title: `${rest.title} (copy)`, slug: `${rest.slug}-copy`, status: 'draft' });
    fetchAll('sort_order');
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await remove(id);
    fetchAll('sort_order');
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDrop = async (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    const updates = reordered.map((p, i) => ({ id: p.id, sort_order: i }));
    await updateOrder(updates);
    fetchAll('sort_order');
    setDragIndex(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium hover:shadow-lg transition-all"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div
            key={project.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors"
          >
            <div className="cursor-grab text-neutral-600 hover:text-neutral-400">
              <GripVertical size={18} />
            </div>

            {/* Thumbnail */}
            <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-accent/10 to-accent-violet/10 overflow-hidden flex-shrink-0">
              {project.image_url && (
                <img src={project.image_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{project.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'published'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {project.status}
                </span>
                <div className="flex gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-neutral-500">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleStatus(project)}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
                title={project.status === 'published' ? 'Unpublish' : 'Publish'}
              >
                {project.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => setEditingId(project.id)}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => duplicateProject(project)}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/ProjectsManager.tsx
git commit -m "feat: add ProjectsManager with drag & drop, status toggle, CRUD"
```

---

### Task 8: SkillsManager

**Files:**
- Create: `src/components/admin/SkillsManager.tsx`

- [ ] **Step 1: Create SkillsManager with inline editing and certifications**

```tsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, CheckCircle, GripVertical } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import type { Skill, Certification } from '../../lib/types';

const CATEGORIES = ['languages', 'frameworks', 'databases', 'other'] as const;

export default function SkillsManager() {
  const skills = useTable<Skill>('skills');
  const certs = useTable<Certification>('certifications');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [certTab, setCertTab] = useState<'en' | 'es'>('en');

  useEffect(() => {
    skills.fetchAll('sort_order');
    certs.fetchAll('sort_order');
  }, []);

  const addSkill = async (category: Skill['category']) => {
    await skills.insert({
      name: 'New Skill',
      category,
      proficiency: 50,
      sort_order: skills.data.filter((s) => s.category === category).length,
      status: 'published',
    } as Partial<Skill>);
    skills.fetchAll('sort_order');
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    await skills.update(id, updates);
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await skills.remove(id);
    skills.fetchAll('sort_order');
  };

  const addCert = async () => {
    await certs.insert({
      title_en: 'New Certification',
      title_es: 'Nueva Certificación',
      issuer: 'Issuer',
      sort_order: certs.data.length,
      status: 'published',
    } as Partial<Certification>);
    certs.fetchAll('sort_order');
  };

  const saveAll = async () => {
    setSaving(true);
    setSaved(false);
    // All inline edits are saved individually via updateSkill
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Skills & Certifications</h1>
      </div>

      {/* Skills by category */}
      {CATEGORIES.map((category) => {
        const categorySkills = skills.data.filter((s) => s.category === category);
        return (
          <div key={category} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold capitalize">{category}</h2>
              <button
                onClick={() => addSkill(category)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900">
                  <GripVertical size={16} className="text-neutral-600 cursor-grab" />
                  <input
                    type="text"
                    defaultValue={skill.name}
                    onBlur={(e) => updateSkill(skill.id, { name: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-sm"
                  />
                  <div className="flex items-center gap-2 w-48">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={skill.proficiency}
                      onMouseUp={(e) => updateSkill(skill.id, { proficiency: parseInt((e.target as HTMLInputElement).value) })}
                      className="flex-1"
                    />
                    <span className="text-xs text-neutral-400 w-8">{skill.proficiency}%</span>
                  </div>
                  <input
                    type="text"
                    defaultValue={skill.years_experience || ''}
                    onBlur={(e) => updateSkill(skill.id, { years_experience: e.target.value || null })}
                    placeholder="e.g. 2 years"
                    className="w-28 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-sm"
                  />
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Certifications */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold">Certifications</h2>
          <div className="flex gap-2">
            {(['en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setCertTab(l)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  certTab === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
            <button
              onClick={addCert}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {certs.data.map((cert) => (
            <div key={cert.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900">
              <input
                type="text"
                defaultValue={certTab === 'en' ? cert.title_en : cert.title_es}
                onBlur={(e) => certs.update(cert.id, { [`title_${certTab}`]: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-sm"
              />
              <input
                type="text"
                defaultValue={cert.issuer}
                onBlur={(e) => certs.update(cert.id, { issuer: e.target.value })}
                placeholder="Issuer"
                className="w-32 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-sm"
              />
              <input
                type="url"
                defaultValue={cert.credential_url || ''}
                onBlur={(e) => certs.update(cert.id, { credential_url: e.target.value || null })}
                placeholder="URL"
                className="w-40 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white text-sm"
              />
              <button
                onClick={async () => { if (confirm('Delete?')) { await certs.remove(cert.id); certs.fetchAll('sort_order'); } }}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/SkillsManager.tsx
git commit -m "feat: add SkillsManager with inline editing, sliders, certifications"
```

---

### Task 9: ExperienceManager

**Files:**
- Create: `src/components/admin/ExperienceManager.tsx`

- [ ] **Step 1: Create ExperienceManager with form and drag reorder**

```tsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, CheckCircle, GripVertical, X } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import type { Experience } from '../../lib/types';

const TYPES = ['work', 'education', 'hackathon', 'leadership'] as const;

export default function ExperienceManager() {
  const { data, fetchAll, insert, update, remove } = useTable<Experience>('experience');
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll('sort_order');
  }, []);

  const openNew = () => {
    setEditing({
      title_en: '',
      title_es: '',
      organization: '',
      description_en: '',
      description_es: '',
      type: 'work',
      start_date: '',
      end_date: null,
      extra_info: '',
      status: 'published',
      sort_order: data.length,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if ('id' in editing && editing.id) {
        await update(editing.id, editing);
      } else {
        await insert(editing);
      }
      setEditing(null);
      fetchAll('sort_order');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience item?')) return;
    await remove(id);
    fetchAll('sort_order');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Experience</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold">
                {editing.id ? 'Edit' : 'New'} Experience
              </h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-neutral-800">
                <X size={20} />
              </button>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-2 mb-5">
              {(['en', 'es'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setTab(l)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    tab === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Title ({tab.toUpperCase()})</label>
                <input
                  type="text"
                  value={(editing[`title_${tab}` as keyof Experience] as string) || ''}
                  onChange={(e) => setEditing({ ...editing, [`title_${tab}`]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Organization</label>
                <input
                  type="text"
                  value={editing.organization || ''}
                  onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Description ({tab.toUpperCase()})</label>
                <textarea
                  value={(editing[`description_${tab}` as keyof Experience] as string) || ''}
                  onChange={(e) => setEditing({ ...editing, [`description_${tab}`]: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Type</label>
                  <select
                    value={editing.type || 'work'}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value as Experience['type'] })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white"
                  >
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Status</label>
                  <select
                    value={editing.status || 'published'}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editing.start_date || ''}
                    onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">End Date (blank = present)</label>
                  <input
                    type="date"
                    value={editing.end_date || ''}
                    onChange={(e) => setEditing({ ...editing, end_date: e.target.value || null })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Extra Info (GPA, scholarship, etc.)</label>
                <input
                  type="text"
                  value={editing.extra_info || ''}
                  onChange={(e) => setEditing({ ...editing, extra_info: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-300">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium disabled:opacity-50"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900">
            <GripVertical size={18} className="text-neutral-600 cursor-grab" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium">{item.title_en}</h3>
              <p className="text-sm text-neutral-400">{item.organization} &middot; {item.type}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              item.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {item.status}
            </span>
            <button
              onClick={() => setEditing(item)}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/ExperienceManager.tsx
git commit -m "feat: add ExperienceManager with modal form and timeline list"
```

---

### Task 10: MediaLibrary

**Files:**
- Create: `src/components/admin/MediaLibrary.tsx`

- [ ] **Step 1: Create MediaLibrary with upload, preview, delete**

```tsx
import { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadImage, deleteFile, listFiles } from '../../lib/storage';

interface MediaFile {
  name: string;
  url: string;
  metadata: unknown;
}

const FOLDERS = ['profile', 'projects', 'gallery'] as const;

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folder, setFolder] = useState<typeof FOLDERS[number]>('projects');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    const result = await listFiles('portfolio-images', folder);
    setFiles(result);
  }, [folder]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      await uploadImage(file, folder);
    }
    setUploading(false);
    loadFiles();
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete ${file.name}?`)) return;
    await deleteFile('portfolio-images', `${folder}/${file.name}`);
    loadFiles();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Media Library</h1>
        <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium cursor-pointer hover:shadow-lg transition-all">
          <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* Folder Filter */}
      <div className="flex gap-2 mb-6">
        {FOLDERS.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              folder === f ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <ImageIcon size={48} className="mb-4" />
          <p>No files in this folder</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <div key={file.name} className="group rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <div className="aspect-square bg-neutral-950 relative">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    title="Copy URL"
                  >
                    {copied === file.url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-white"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-neutral-400 truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/MediaLibrary.tsx
git commit -m "feat: add MediaLibrary with upload, preview, delete, copy URL"
```

---

### Task 11: ContactInfoEditor + ResumeUploader

**Files:**
- Create: `src/components/admin/ContactInfoEditor.tsx`
- Create: `src/components/admin/ResumeUploader.tsx`

- [ ] **Step 1: Create ContactInfoEditor**

```tsx
import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import type { ContactInfo } from '../../lib/types';

export default function ContactInfoEditor() {
  const { fetchSingle, update } = useTable<ContactInfo>('contact_info');
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSingle().then(setInfo);
  }, []);

  const handleSave = async () => {
    if (!info) return;
    setSaving(true);
    await update(info.id, {
      email: info.email,
      phone: info.phone,
      linkedin_url: info.linkedin_url,
      github_url: info.github_url,
      twitter_url: info.twitter_url,
      location: info.location,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!info) return <div className="text-neutral-400">Loading...</div>;

  const field = (key: keyof ContactInfo, label: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <input
        type={type}
        value={(info[key] as string) || ''}
        onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Contact Info</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium disabled:opacity-50"
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="max-w-xl space-y-5">
        {field('email', 'Email', 'email')}
        {field('phone', 'Phone', 'tel')}
        {field('linkedin_url', 'LinkedIn URL', 'url')}
        {field('github_url', 'GitHub URL', 'url')}
        {field('twitter_url', 'Twitter/X URL', 'url')}
        {field('location', 'Location')}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ResumeUploader**

```tsx
import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import { uploadDocument } from '../../lib/storage';
import type { HeroContent } from '../../lib/types';

export default function ResumeUploader() {
  const { fetchSingle, update } = useTable<HeroContent>('hero_content');
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    fetchSingle().then(setHero);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    setUploading(true);
    try {
      const url = await uploadDocument(file);
      await update(hero.id, { resume_url: url });
      setHero({ ...hero, resume_url: url });
      setUploaded(true);
      setTimeout(() => setUploaded(false), 2000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Resume / CV</h1>

      <div className="max-w-xl">
        <div className="p-8 rounded-2xl border-2 border-dashed border-neutral-700 text-center">
          <FileText size={48} className="mx-auto mb-4 text-neutral-500" />
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium cursor-pointer hover:shadow-lg transition-all">
            <Upload size={18} />
            {uploading ? 'Uploading...' : uploaded ? 'Uploaded!' : 'Upload PDF'}
            <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
          </label>
        </div>

        {hero?.resume_url && (
          <div className="mt-6 p-4 rounded-xl border border-neutral-800 bg-neutral-900">
            <p className="text-sm text-neutral-400 mb-2">Current Resume:</p>
            <a
              href={hero.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-sm break-all"
            >
              {hero.resume_url}
            </a>
            <div className="mt-4">
              <iframe src={hero.resume_url} className="w-full h-96 rounded-xl border border-neutral-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/ContactInfoEditor.tsx src/components/admin/ResumeUploader.tsx
git commit -m "feat: add ContactInfoEditor and ResumeUploader"
```

---

### Task 12: VersionHistory

**Files:**
- Create: `src/components/admin/VersionHistory.tsx`

- [ ] **Step 1: Create VersionHistory with filtering and restore**

```tsx
import { useState, useEffect } from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ContentVersion } from '../../lib/types';

const TABLES = ['hero_content', 'projects', 'experience'] as const;

export default function VersionHistory() {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    loadVersions();
  }, [filter]);

  const loadVersions = async () => {
    let query = supabase
      .from('content_versions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (filter !== 'all') {
      query = query.eq('table_name', filter);
    }

    const { data } = await query;
    setVersions(data || []);
  };

  const restore = async (version: ContentVersion) => {
    if (!confirm(`Restore ${version.table_name} to version ${version.version}? This will overwrite current content.`)) return;

    setRestoring(version.id);
    try {
      const snapshot = version.snapshot as Record<string, unknown>;
      const { id, created_at, ...fields } = snapshot;

      await supabase
        .from(version.table_name)
        .update(fields)
        .eq('id', version.record_id);

      loadVersions();
    } finally {
      setRestoring(null);
    }
  };

  const getChangedFields = (version: ContentVersion, index: number): string[] => {
    const nextVersion = versions[index + 1];
    if (!nextVersion || nextVersion.record_id !== version.record_id) return [];

    const current = version.snapshot as Record<string, unknown>;
    const previous = nextVersion.snapshot as Record<string, unknown>;
    return Object.keys(current).filter(
      (key) => !['id', 'version', 'updated_at', 'created_at'].includes(key) &&
        JSON.stringify(current[key]) !== JSON.stringify(previous[key])
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Version History</h1>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-neutral-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm"
          >
            <option value="all">All Tables</option>
            {TABLES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {versions.length === 0 ? (
        <p className="text-neutral-500 text-center py-12">No version history yet</p>
      ) : (
        <div className="space-y-3">
          {versions.map((version, index) => {
            const changedFields = getChangedFields(version, index);
            return (
              <div
                key={version.id}
                className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-300">
                        {version.table_name}
                      </span>
                      <span className="text-sm text-neutral-400">
                        v{version.version}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(version.created_at).toLocaleString()}
                      </span>
                    </div>
                    {changedFields.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {changedFields.map((field) => (
                          <span key={field} className="px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400">
                            {field}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => restore(version)}
                    disabled={restoring === version.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    {restoring === version.id ? 'Restoring...' : 'Restore'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/VersionHistory.tsx
git commit -m "feat: add VersionHistory with filtering, diff, and restore"
```

---

### Task 13: PreviewPane

**Files:**
- Create: `src/components/admin/PreviewPane.tsx`

- [ ] **Step 1: Create PreviewPane**

```tsx
import { useState } from 'react';
import { Monitor, Smartphone, Globe, X } from 'lucide-react';

interface PreviewPaneProps {
  onClose: () => void;
}

export default function PreviewPane({ onClose }: PreviewPaneProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [lang, setLang] = useState<'en' | 'es'>('en');

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-900">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-300">Preview</span>
          <div className="flex gap-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg ${device === 'desktop' ? 'bg-accent/20 text-accent' : 'text-neutral-400 hover:text-white'}`}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg ${device === 'mobile' ? 'bg-accent/20 text-accent' : 'text-neutral-400 hover:text-white'}`}
            >
              <Smartphone size={16} />
            </button>
          </div>
          <div className="flex gap-1">
            {(['en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  lang === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400">
          <X size={20} />
        </button>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-auto bg-neutral-950">
        <iframe
          src={`/?preview=true&lang=${lang}`}
          className={`bg-white rounded-xl shadow-2xl transition-all duration-300 ${
            device === 'desktop' ? 'w-full max-w-6xl h-full' : 'w-[375px] h-[812px]'
          }`}
          title="Portfolio Preview"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/PreviewPane.tsx
git commit -m "feat: add PreviewPane with device and language switching"
```

---

### Task 14: Wire Admin Panel — Astro Pages + Router

**Files:**
- Create: `src/pages/admin/index.astro`
- Create: `src/pages/admin/login.astro`
- Create: `src/components/admin/AdminApp.tsx`

- [ ] **Step 1: Create AdminApp (SPA router)**

```tsx
import { useState } from 'react';
import AuthGuard from './AuthGuard';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import HeroEditor from './HeroEditor';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import MediaLibrary from './MediaLibrary';
import ContactInfoEditor from './ContactInfoEditor';
import ResumeUploader from './ResumeUploader';
import VersionHistory from './VersionHistory';

const SECTIONS: Record<string, () => JSX.Element> = {
  dashboard: Dashboard,
  hero: HeroEditor,
  projects: ProjectsManager,
  skills: SkillsManager,
  experience: ExperienceManager,
  media: MediaLibrary,
  contact: ContactInfoEditor,
  resume: ResumeUploader,
  versions: VersionHistory,
};

export default function AdminApp() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const ActiveComponent = SECTIONS[activeSection] || Dashboard;

  return (
    <AuthGuard>
      <AdminLayout activeSection={activeSection} onNavigate={setActiveSection}>
        <ActiveComponent />
      </AdminLayout>
    </AuthGuard>
  );
}
```

- [ ] **Step 2: Create admin/index.astro**

```astro
---
export const prerender = false;
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>Admin — Portfolio CMS</title>
  </head>
  <body>
    <div id="admin-root">
      <AdminApp client:only="react" />
    </div>
  </body>
</html>

<script>
  // Import styles
</script>
```

Note: The `AdminApp` import needs to be added as an Astro component import. Update the frontmatter:

```astro
---
export const prerender = false;
import AdminApp from '../../components/admin/AdminApp';
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>Admin — Portfolio CMS</title>
  </head>
  <body class="bg-neutral-950">
    <AdminApp client:only="react" />
  </body>
</html>
```

- [ ] **Step 3: Create admin/login.astro (redirect to admin)**

```astro
---
export const prerender = false;
// The login is handled inside AdminApp via AuthGuard
// This page just redirects to /admin
return Astro.redirect('/admin');
---
```

- [ ] **Step 4: Verify dev server**

```bash
npm run dev
```

Visit `http://localhost:4321/admin` — should show login form, then after login, the admin dashboard.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminApp.tsx src/pages/admin/index.astro src/pages/admin/login.astro
git commit -m "feat: wire admin panel with SPA router and Astro pages"
```

---

## Phase 3 Completion Checklist

- [ ] `/admin` shows login form when not authenticated
- [ ] Login with Supabase email/password works
- [ ] Dashboard shows content stats
- [ ] Hero editor saves bilingual content + uploads images/PDF
- [ ] Projects manager: create, edit, delete, duplicate, reorder, toggle status
- [ ] Project form: TipTap editor, tags, image upload, dates
- [ ] Skills manager: inline edit, sliders, add/remove, certifications
- [ ] Experience manager: modal form, timeline list, CRUD
- [ ] Media library: upload, preview, delete, copy URL
- [ ] Contact info editor saves all fields
- [ ] Resume uploader uploads and previews PDF
- [ ] Version history shows changes, allows filtering and restore
- [ ] `npm run build` succeeds
