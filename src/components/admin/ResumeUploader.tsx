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
