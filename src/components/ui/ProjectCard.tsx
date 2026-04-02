import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Project, Lang } from '../../lib/types';

interface ProjectCardProps {
  project: Project;
  lang: Lang;
  index: number;
  onClick: (project: Project) => void;
}

export default function ProjectCard({ project, lang, index, onClick }: ProjectCardProps) {
  const description = lang === 'en' ? project.description_en : project.description_es;
  const isInProgress = !project.end_date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onClick={() => onClick(project)}
      className="group cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_0_24px_#4ade8022]"
    >
      {/* Image */}
      <div className="aspect-video bg-neutral-800 relative overflow-hidden">
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
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'bg-neutral-700/80 text-neutral-300 border border-neutral-600'
          }`}>
            {isInProgress ? '● In Progress' : '✓ Done'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-base font-heading font-semibold text-white leading-snug">{project.title}</h3>
        <p className="mt-2 text-sm text-neutral-400 line-clamp-3 leading-relaxed">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-800 text-accent/80 border border-accent/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-neutral-600 font-mono group-hover:text-accent/60 transition-colors">
            click to expand →
          </p>
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs text-accent/70 hover:text-accent font-mono transition-colors"
            >
              <ExternalLink size={12} />
              live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
