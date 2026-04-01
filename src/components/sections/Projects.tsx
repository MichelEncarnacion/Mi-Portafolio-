import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import ProjectCard from '../ui/ProjectCard';
import type { Project } from '../../lib/types';

interface ProjectsProps {
  data: Project[] | null;
}

export default function Projects({ data }: ProjectsProps) {
  const { lang, t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold">
            {t('projects.title')}
          </h2>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((project, i) => (
            <ProjectCard key={project.id} project={project} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
