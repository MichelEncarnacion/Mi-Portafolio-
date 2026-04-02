import { useState, useEffect, useRef } from 'react';
import { Save, CheckCircle, Upload, User, FileText, Trash2, ExternalLink } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import { uploadImage, uploadDocument } from '../../lib/storage';
import type { HeroContent } from '../../lib/types';

export default function HeroEditor() {
  const { fetchSingle, update } = useTable<HeroContent>('hero_content');
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [imageDragging, setImageDragging] = useState(false);
  const [pdfDragging, setPdfDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSingle().then(setHero).catch(console.error);
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
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageFile = async (file: File) => {
    if (!hero) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file, 'profile');
      setHero({ ...hero, profile_image_url: url });
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfFile = async (file: File) => {
    if (!hero) return;
    setUploadingPdf(true);
    try {
      const url = await uploadDocument(file);
      setHero({ ...hero, resume_url: url });
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPdf(false);
    }
  };

  if (!hero) return <div className="text-neutral-400 text-sm">Loading hero content...</div>;

  const fieldKey = (base: string) => `${base}_${tab}` as keyof HeroContent;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Hero Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-black font-bold hover:bg-accent-hover transition-all disabled:opacity-50"
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — text fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Full name</label>
            <input
              type="text"
              value={hero.name}
              onChange={(e) => setHero({ ...hero, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          {/* Language tabs */}
          <div className="flex gap-2">
            {(['en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setTab(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  tab === l ? 'bg-accent text-black font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Greeting ({tab.toUpperCase()})</label>
            <input
              type="text"
              value={(hero[fieldKey('greeting')] as string) || ''}
              onChange={(e) => setHero({ ...hero, [fieldKey('greeting')]: e.target.value })}
              placeholder={tab === 'en' ? "Hi, I'm" : 'Hola, soy'}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Tagline ({tab.toUpperCase()})</label>
            <input
              type="text"
              value={(hero[fieldKey('tagline')] as string) || ''}
              onChange={(e) => setHero({ ...hero, [fieldKey('tagline')]: e.target.value })}
              placeholder={tab === 'en' ? 'Software Engineer & ...' : 'Ingeniero de Software & ...'}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Description ({tab.toUpperCase()})</label>
            <textarea
              value={(hero[fieldKey('description')] as string) || ''}
              onChange={(e) => setHero({ ...hero, [fieldKey('description')]: e.target.value })}
              rows={4}
              placeholder={tab === 'en' ? 'A short bio shown in the hero section...' : 'Un resumen corto que aparece en la sección hero...'}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
            <select
              value={hero.status}
              onChange={(e) => setHero({ ...hero, status: e.target.value as 'draft' | 'published' })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Right — uploads */}
        <div className="space-y-6">

          {/* Profile photo */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">Profile photo</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
            />

            {hero.profile_image_url ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <img
                    src={hero.profile_image_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-accent/40"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white"
                      disabled={uploadingImage}
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setHero({ ...hero, profile_image_url: null })}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={11} /> Remove photo
                </button>
              </div>
            ) : (
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                onDragOver={(e) => { e.preventDefault(); setImageDragging(true); }}
                onDragLeave={() => setImageDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setImageDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleImageFile(f);
                }}
                className={`w-full flex flex-col items-center gap-3 py-8 rounded-2xl border-2 border-dashed transition-colors ${
                  imageDragging
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-neutral-700 hover:border-accent/50 text-neutral-500 hover:text-accent'
                } disabled:opacity-50`}
              >
                <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center">
                  {uploadingImage
                    ? <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    : <User size={22} />
                  }
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{uploadingImage ? 'Uploading...' : 'Upload photo'}</p>
                  <p className="text-xs mt-1 opacity-60">Drag & drop or click · PNG, JPG, WEBP</p>
                </div>
              </button>
            )}
          </div>

          {/* Resume PDF */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">Resume / CV (PDF)</label>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfFile(f); }}
            />

            {hero.resume_url ? (
              <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">CV uploaded</p>
                    <p className="text-xs text-neutral-500 truncate">PDF ready</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={hero.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors"
                  >
                    <ExternalLink size={12} /> View PDF
                  </a>
                  <button
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploadingPdf}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700 transition-colors"
                  >
                    <Upload size={12} /> Replace
                  </button>
                  <button
                    onClick={() => setHero({ ...hero, resume_url: null })}
                    className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => pdfInputRef.current?.click()}
                disabled={uploadingPdf}
                onDragOver={(e) => { e.preventDefault(); setPdfDragging(true); }}
                onDragLeave={() => setPdfDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setPdfDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handlePdfFile(f);
                }}
                className={`w-full flex flex-col items-center gap-3 py-8 rounded-2xl border-2 border-dashed transition-colors ${
                  pdfDragging
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-neutral-700 hover:border-accent/50 text-neutral-500 hover:text-accent'
                } disabled:opacity-50`}
              >
                <div className="w-14 h-14 rounded-lg bg-neutral-800 flex items-center justify-center">
                  {uploadingPdf
                    ? <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    : <FileText size={22} />
                  }
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{uploadingPdf ? 'Uploading...' : 'Upload CV / Resume'}</p>
                  <p className="text-xs mt-1 opacity-60">Drag & drop or click · PDF only</p>
                </div>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
