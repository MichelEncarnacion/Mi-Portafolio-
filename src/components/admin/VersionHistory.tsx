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
