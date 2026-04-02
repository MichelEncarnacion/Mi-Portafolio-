import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, X, Save } from 'lucide-react';
import { useTable } from '../../hooks/useSupabase';
import type { Experience } from '../../lib/types';

const TYPES = ['work', 'education', 'hackathon', 'leadership'] as const;

export default function ExperienceManager() {
  const { data, fetchAll, insert, update, remove } = useTable<Experience>('experience');
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll('sort_order').catch(console.error);
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
      extra_info: null,
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
    } catch (err) {
      console.error(err);
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
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium">
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold">
                {'id' in editing && editing.id ? 'Edit' : 'New'} Experience
              </h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              {(['en', 'es'] as const).map((l) => (
                <button key={l} onClick={() => setTab(l)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === l ? 'bg-accent text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1.5">Title ({tab.toUpperCase()})</label>
                <input type="text"
                  value={(editing[`title_${tab}` as keyof Experience] as string) || ''}
                  onChange={(e) => setEditing({ ...editing, [`title_${tab}`]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1.5">Organization</label>
                <input type="text"
                  value={editing.organization || ''}
                  onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1.5">Description ({tab.toUpperCase()})</label>
                <textarea
                  value={(editing[`description_${tab}` as keyof Experience] as string) || ''}
                  onChange={(e) => setEditing({ ...editing, [`description_${tab}`]: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-accent outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1.5">Type</label>
                  <select value={editing.type || 'work'}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value as Experience['type'] })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white">
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1.5">Status</label>
                  <select value={editing.status || 'published'}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1.5">Start Date</label>
                  <input type="date" value={editing.start_date || ''}
                    onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1.5">End Date (blank = present)</label>
                  <input type="date" value={editing.end_date || ''}
                    onChange={(e) => setEditing({ ...editing, end_date: e.target.value || null })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1.5">Extra Info (GPA, scholarship...)</label>
                <input type="text" value={editing.extra_info || ''}
                  onChange={(e) => setEditing({ ...editing, extra_info: e.target.value || null })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-accent outline-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white font-medium disabled:opacity-50">
                <Save size={16} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900">
            <GripVertical size={18} className="text-neutral-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{item.title_en}</h3>
              <p className="text-xs text-neutral-400 mt-0.5">{item.organization} · {item.type}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${
              item.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {item.status}
            </span>
            <button onClick={() => setEditing(item)}
              className="px-3 py-1.5 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 shrink-0">
              Edit
            </button>
            <button onClick={() => handleDelete(item.id)}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-red-400 shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
