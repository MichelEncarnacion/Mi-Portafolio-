import { motion } from 'framer-motion';
import { ExternalLink, GitFork } from 'lucide-react';
import type { Project, Lang } from '../../lib/types';

interface ProjectCardProps {
  project: Project;
  lang: Lang;
  index: number;
}

export default function ProjectCard({ project, lang, index }: ProjectCardProps) {
  const description = lang === 'en' ? project.description_en : project.description_es;
  const isInProgress = !project.end_date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 transition-shadow duration-300"
    >
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent-violet/10 relative overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-heading font-bold text-accent/20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            isInProgress
              ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20'
              : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20'
          }`}>
            {isInProgress ? '🟢 In Progress' : '✅ Done'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-base font-heading font-semibold leading-snug">{project.title}</h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-3 leading-relaxed">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        {(project.project_url || project.repo_url) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-violet transition-colors"
              >
                <ExternalLink size={13} /> Live Demo
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-violet transition-colors"
              >
                <GitFork size={13} /> Code
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
