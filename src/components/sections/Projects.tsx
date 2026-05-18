import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { ProjectCardSkeleton } from '../ui/Skeleton';
import type { Project } from '../../lib/types';

interface ProjectsProps {
  data: Project[] | null;
}

export default function Projects({ data }: ProjectsProps) {
  const { lang, t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  if (!data) return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );

  if (data.length === 0) return null;

  const allTags = Array.from(new Set(data.flatMap((p) => p.tags))).sort();
  const filtered = activeTag ? data.filter((p) => p.tags.includes(activeTag)) : data;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold">
            {t('projects.title')}
          </h2>
        </ScrollReveal>

        {/* Filter chips */}
        <ScrollReveal className="flex flex-wrap gap-2 justify-center mb-10" role="group" aria-label="Filter projects by tag">
          <button
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200 border ${
              activeTag === null
                ? 'bg-accent text-black border-accent font-semibold'
                : 'border-neutral-700 text-neutral-400 hover:border-accent/50 hover:text-accent'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              aria-pressed={activeTag === tag}
              className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200 border ${
                activeTag === tag
                  ? 'bg-accent text-black border-accent font-semibold'
                  : 'border-neutral-700 text-neutral-400 hover:border-accent/50 hover:text-accent'
              }`}
            >
              {tag}
            </button>
          ))}
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              lang={lang}
              index={i}
              onClick={setSelectedProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        lang={lang}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
