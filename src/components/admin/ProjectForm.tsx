import { useState, useEffect, useRef } from 'react';
import { Save, CheckCircle, ArrowLeft, X, Upload, Trash2 } from 'lucide-react';
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
    image_url: null,
    tags: [],
    project_url: null,
    repo_url: null,
    status: 'draft',
    start_date: null,
    end_date: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [inProgress, setInProgress] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editorEn = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: '',
    onUpdate: ({ editor }) => {
      setProject((p) => ({ ...p, long_description_en: editor.getHTML() }));
    },
  });

  const editorEs = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: '',
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
      }).catch(console.error);
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
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'projects');
      setProject((p) => ({ ...p, image_url: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !project.tags?.includes(tag)) {
      setProject((p) => ({ ...p, tags: [...(p.tags ?? []), tag] }));
      setTagInput('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400">
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
        {/* Main */}
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
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            {(['en', 'es'] as const).map((l) => (
              <button key={l} onClick={() => setTab(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'}`}
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
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 min-h-[120px] prose prose-invert prose-sm max-w-none text-neutral-200">
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {project.image_url ? (
              <div className="relative group">
                <img src={project.image_url} alt="" className="w-full rounded-xl border border-neutral-700 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs hover:bg-neutral-700"
                  >
                    <Upload size={12} /> Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setProject((p) => ({ ...p, image_url: null }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 text-red-300 text-xs hover:bg-red-900"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-neutral-700 hover:border-accent/50 rounded-xl py-8 flex flex-col items-center gap-2 text-neutral-500 hover:text-accent transition-colors disabled:opacity-50"
              >
                <Upload size={20} />
                <span className="text-sm">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                <span className="text-xs">PNG, JPG, WEBP</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white text-sm focus:ring-2 focus:ring-accent outline-none"
              />
              <button onClick={addTag} className="px-3 py-2 rounded-lg bg-neutral-700 text-white text-sm hover:bg-neutral-600">+</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(project.tags ?? []).map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-300">
                  {tag}
                  <button onClick={() => setProject((p) => ({ ...p, tags: (p.tags ?? []).filter((t) => t !== tag) }))}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Project URL</label>
            <input type="url" value={project.project_url || ''} onChange={(e) => setProject({ ...project, project_url: e.target.value || null })}
              className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Repository URL</label>
            <input type="url" value={project.repo_url || ''} onChange={(e) => setProject({ ...project, repo_url: e.target.value || null })}
              className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Start Date</label>
            <input type="date" value={project.start_date || ''} onChange={(e) => setProject({ ...project, start_date: e.target.value || null })}
              className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
            <input type="checkbox" checked={inProgress} onChange={(e) => setInProgress(e.target.checked)} className="rounded" />
            In Progress (no end date)
          </label>
          {!inProgress && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">End Date</label>
              <input type="date" value={project.end_date || ''} onChange={(e) => setProject({ ...project, end_date: e.target.value || null })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-white text-sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
