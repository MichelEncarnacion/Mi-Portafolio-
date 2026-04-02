import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitFork } from 'lucide-react';
import type { Project, Lang } from '../../lib/types';

interface ProjectModalProps {
  project: Project | null;
  lang: Lang;
  onClose: () => void;
}

export default function ProjectModal({ project, lang, onClose }: ProjectModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (project) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  const title = project?.title ?? '';
  const description = project
    ? (lang === 'en' ? project.long_description_en || project.description_en : project.long_description_es || project.description_es)
    : '';

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-accent/30 bg-neutral-950 shadow-2xl shadow-accent/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="font-mono text-xs text-neutral-400">
                  {title.toLowerCase().replace(/\s+/g, '-')}.md
                </span>
                <button
                  onClick={onClose}
                  className="text-neutral-500 hover:text-white transition-colors text-sm font-mono"
                >
                  [x]
                </button>
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono">
                <p className="text-accent text-sm mb-4">$ cat {title.toLowerCase().replace(/\s+/g, '-')}.md</p>

                <h2 className="text-xl font-sans font-bold text-white mb-3">{title}</h2>

                {project.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-neutral-800">
                    <img
                      src={project.image_url}
                      alt={title}
                      className="w-full object-cover max-h-48"
                    />
                  </div>
                )}

                <p className="text-neutral-300 text-sm font-sans leading-relaxed mb-4">{description}</p>

                {/* Stack */}
                {project.tags.length > 0 && (
                  <div className="mb-5">
                    <span className="text-accent text-xs">Stack: </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs border border-accent/30 text-accent bg-accent/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(project.project_url || project.repo_url) && (
                  <div className="flex gap-3 pt-4 border-t border-neutral-800">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors"
                      >
                        <ExternalLink size={12} /> ./demo
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors"
                      >
                        <GitFork size={12} /> ./repo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
