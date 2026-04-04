import { useState, useEffect } from 'react';
import { Save, CheckCircle, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AboutContent, Interest } from '../../lib/types';

const EMOJI_SUGGESTIONS = ['💻', '☁️', '🎮', '📚', '🌎', '🎵', '🔒', '🤖', '📱', '🎨', '⚡', '🌐', '🛠️', '🚀', '📊', '🧠'];

function newInterest(): Interest {
  return { icon: '✨', label_en: '', label_es: '' };
}

export default function AboutEditor() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('about_content').select('*').single().then(({ data }) => {
      if (data) setAbout(data as AboutContent);
    });
  }, []);

  const updateInterest = (index: number, field: keyof Interest, value: string) => {
    if (!about) return;
    const updated = about.interests.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setAbout({ ...about, interests: updated });
  };

  const addInterest = () => {
    if (!about) return;
    setAbout({ ...about, interests: [...about.interests, newInterest()] });
  };

  const removeInterest = (index: number) => {
    if (!about) return;
    setAbout({ ...about, interests: about.interests.filter((_, i) => i !== index) });
  };

  const moveInterest = (index: number, direction: -1 | 1) => {
    if (!about) return;
    const items = [...about.interests];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    setAbout({ ...about, interests: items });
  };

  const handleSave = async () => {
    if (!about) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from('about_content')
      .update({ interests: about.interests, updated_at: new Date().toISOString() })
      .eq('id', about.id);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!about) return <div className="text-neutral-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold">About Page</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Edit the interest chips shown on <code className="text-accent">/about</code>.
            Bio and profile info are managed in <strong>Hero Content</strong>.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium disabled:opacity-50"
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
            Interests ({about.interests.length})
          </h2>
          <button
            onClick={addInterest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-accent/10 text-accent hover:bg-accent/20 transition-colors border border-accent/20"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="space-y-3">
          {about.interests.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/60"
            >
              {/* Move buttons */}
              <div className="flex flex-col gap-1 pt-1 shrink-0">
                <button
                  onClick={() => moveInterest(i, -1)}
                  disabled={i === 0}
                  className="text-neutral-600 hover:text-neutral-300 disabled:opacity-20 transition-colors"
                  title="Move up"
                >
                  <GripVertical size={14} />
                </button>
                <button
                  onClick={() => moveInterest(i, 1)}
                  disabled={i === about.interests.length - 1}
                  className="text-neutral-600 hover:text-neutral-300 disabled:opacity-20 transition-colors rotate-180"
                  title="Move down"
                >
                  <GripVertical size={14} />
                </button>
              </div>

              {/* Emoji picker */}
              <div className="shrink-0">
                <label className="block text-xs text-neutral-500 mb-1">Icon</label>
                <div className="relative">
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => updateInterest(i, 'icon', e.target.value)}
                    className="w-16 text-center px-2 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white text-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1 w-40">
                    {EMOJI_SUGGESTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => updateInterest(i, 'icon', emoji)}
                        className={`text-sm px-1 py-0.5 rounded hover:bg-neutral-700 transition-colors ${item.icon === emoji ? 'bg-accent/20' : ''}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Label (English)</label>
                  <input
                    type="text"
                    value={item.label_en}
                    onChange={(e) => updateInterest(i, 'label_en', e.target.value)}
                    placeholder="e.g. Full-Stack Dev"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white text-sm focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Label (Español)</label>
                  <input
                    type="text"
                    value={item.label_es}
                    onChange={(e) => updateInterest(i, 'label_es', e.target.value)}
                    placeholder="ej. Desarrollo Full-Stack"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white text-sm focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeInterest(i)}
                className="shrink-0 p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-5"
                title="Remove"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {about.interests.length === 0 && (
          <div className="text-center py-10 text-neutral-500 text-sm border border-dashed border-neutral-700 rounded-xl">
            No interests yet. Click <strong>Add</strong> to create one.
          </div>
        )}

        {/* Preview */}
        {about.interests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">Preview</h2>
            <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
              {about.interests.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm font-mono bg-neutral-800 border border-neutral-700 text-neutral-300"
                >
                  {item.icon} {item.label_en || '…'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
