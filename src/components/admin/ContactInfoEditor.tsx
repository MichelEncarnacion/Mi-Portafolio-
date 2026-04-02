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
