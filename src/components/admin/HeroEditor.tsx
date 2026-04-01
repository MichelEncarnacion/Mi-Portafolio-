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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    try {
      const url = await uploadImage(file, 'profile');
      setHero({ ...hero, profile_image_url: url });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    try {
      const url = await uploadDocument(file);
      setHero({ ...hero, resume_url: url });
    } catch (err) {
      console.error(err);
    }
  };

  if (!hero) return <div className="text-neutral-400 text-sm">Loading hero content...</div>;

  const fieldKey = (base: string) => `${base}_${tab}` as keyof HeroContent;

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
      <div className="mb-6 max-w-lg">
        <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
        <input
          type="text"
          value={hero.name}
          onChange={(e) => setHero({ ...hero, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
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

      <div className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Greeting ({tab.toUpperCase()})</label>
          <input
            type="text"
            value={(hero[fieldKey('greeting')] as string) || ''}
            onChange={(e) => setHero({ ...hero, [fieldKey('greeting')]: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Tagline ({tab.toUpperCase()})</label>
          <input
            type="text"
            value={(hero[fieldKey('tagline')] as string) || ''}
            onChange={(e) => setHero({ ...hero, [fieldKey('tagline')]: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Description ({tab.toUpperCase()})</label>
          <textarea
            value={(hero[fieldKey('description')] as string) || ''}
            onChange={(e) => setHero({ ...hero, [fieldKey('description')]: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:ring-2 focus:ring-accent outline-none resize-none"
          />
        </div>
      </div>

      {/* Uploads */}
      <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-neutral-400" />
          {hero.profile_image_url && (
            <img src={hero.profile_image_url} alt="Profile" className="mt-3 w-20 h-20 rounded-full object-cover border border-neutral-700" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Resume PDF</label>
          <input type="file" accept=".pdf" onChange={handleResumeUpload} className="text-sm text-neutral-400" />
          {hero.resume_url && (
            <a href={hero.resume_url} target="_blank" rel="noopener noreferrer" className="block mt-3 text-sm text-accent hover:underline truncate">
              View current CV
            </a>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mt-8 max-w-xs">
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
  );
}
