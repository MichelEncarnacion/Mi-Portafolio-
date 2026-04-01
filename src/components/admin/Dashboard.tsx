import { useState, useEffect } from 'react';
import { FolderOpen, Wrench, Briefcase, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StatItem {
  label: string;
  published: number;
  drafts: number;
  icon: typeof FolderOpen;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [projects, skills, experience, certifications] = await Promise.all([
        supabase.from('projects').select('status'),
        supabase.from('skills').select('status'),
        supabase.from('experience').select('status'),
        supabase.from('certifications').select('status'),
      ]);

      const count = (data: Array<{ status: string }> | null, s: string) =>
        (data ?? []).filter((r) => r.status === s).length;

      setStats([
        { label: 'Projects', published: count(projects.data, 'published'), drafts: count(projects.data, 'draft'), icon: FolderOpen },
        { label: 'Skills', published: count(skills.data, 'published'), drafts: count(skills.data, 'draft'), icon: Wrench },
        { label: 'Experience', published: count(experience.data, 'published'), drafts: count(experience.data, 'draft'), icon: Briefcase },
        { label: 'Certifications', published: count(certifications.data, 'published'), drafts: count(certifications.data, 'draft'), icon: FileText },
      ]);

      const { data: versions } = await supabase
        .from('content_versions')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (versions?.length) {
        setLastUpdate(new Date(versions[0].created_at).toLocaleString());
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-neutral-400 text-sm">Loading stats...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, published, drafts, icon: Icon }) => (
          <div key={label} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-accent/10">
                <Icon size={18} className="text-accent" />
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

      {lastUpdate && (
        <div className="mt-8 p-4 rounded-xl border border-neutral-800 bg-neutral-900 text-sm text-neutral-400">
          Last update: <span className="text-white">{lastUpdate}</span>
        </div>
      )}
    </div>
  );
}
