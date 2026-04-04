import { useState, useEffect } from 'react';
import { Mail, CheckCheck, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function SubmissionsViewer() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setItems((data as Submission[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    setItems((prev) => prev.map((s) => s.id === id ? { ...s, read: true } : s));
  };

  const remove = async (id: string) => {
    await supabase.from('contact_submissions').delete().eq('id', id);
    setItems((prev) => prev.filter((s) => s.id !== id));
  };

  const unread = items.filter((s) => !s.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-3">
            Contact Submissions
            {unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-accent text-black font-bold">
                {unread} new
              </span>
            )}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">{items.length} total messages</p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && (
        <div className="text-neutral-400 text-sm">Loading...</div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-16 text-neutral-500">
          <Mail size={40} className="mx-auto mb-4 opacity-30" />
          <p>No submissions yet.</p>
        </div>
      )}

      <div className="space-y-3 max-w-2xl">
        {items.map((s) => (
          <div
            key={s.id}
            className={`rounded-xl border p-5 transition-colors ${
              s.read
                ? 'border-neutral-800 bg-neutral-900/40'
                : 'border-accent/30 bg-accent/5'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === s.id ? null : s.id);
                  if (!s.read) markRead(s.id);
                }}
              >
                <div className="flex items-center gap-2">
                  {!s.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                  <span className="font-medium text-white truncate">{s.name}</span>
                  <span className="text-xs text-neutral-500 shrink-0">
                    {new Date(s.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-accent/80 font-mono mt-0.5">{s.email}</p>
                {expanded !== s.id && (
                  <p className="text-sm text-neutral-400 mt-1 line-clamp-1">{s.message}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!s.read && (
                  <button
                    onClick={() => markRead(s.id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-accent hover:bg-accent/10 transition-colors"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => remove(s.id)}
                  title="Delete"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {expanded === s.id && (
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">{s.message}</p>
                <a
                  href={`mailto:${s.email}?subject=Re: Portfolio Contact`}
                  className="inline-flex items-center gap-2 mt-4 text-xs text-accent hover:underline font-mono"
                >
                  <Mail size={12} /> Reply to {s.email}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
