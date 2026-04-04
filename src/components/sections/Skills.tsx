import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import SkillChip from '../ui/SkillChip';
import { SkillChipSkeleton } from '../ui/Skeleton';
import type { Skill, Certification } from '../../lib/types';

interface SkillsProps {
  skills: Skill[] | null;
  certifications: Certification[] | null;
}

const CATEGORIES = ['languages', 'frameworks', 'databases', 'other'] as const;

const LEVEL_LEGEND = [
  { label: 'Proficient', dot: 'bg-accent', desc: 'Use regularly, comfortable defending it' },
  { label: 'Familiar', dot: 'bg-neutral-400 dark:bg-neutral-500', desc: 'Have worked with it, can get things done' },
  { label: 'Learning', dot: 'bg-neutral-300 dark:bg-neutral-700', desc: 'Currently exploring' },
] as const;

export default function Skills({ skills, certifications }: SkillsProps) {
  const { lang, t } = useTranslation();

  if (!skills) return (
    <section id="skills" className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: 18 }).map((_, i) => <SkillChipSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );

  if (skills.length === 0) return null;

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = (skills ?? []).filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-4">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold">
            {t('skills.title')}
          </h2>
        </ScrollReveal>

        {/* Legend */}
        <ScrollReveal className="flex flex-wrap justify-center gap-5 mb-14 text-xs text-neutral-500 dark:text-neutral-400">
          {LEVEL_LEGEND.map(({ label, dot, desc }) => (
            <span key={label} className="flex items-center gap-1.5" title={desc}>
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </ScrollReveal>

        <div className="grid gap-10 md:grid-cols-2">
          {CATEGORIES.map((category) => {
            const catSkills = grouped[category];
            if (!catSkills || catSkills.length === 0) return null;
            return (
              <ScrollReveal key={category}>
                <div>
                  <h3 className="text-sm font-mono font-semibold text-accent mb-4 uppercase tracking-widest">
                    {t(`skills.${category}`)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        name={skill.name}
                        proficiency={skill.proficiency}
                        yearsExperience={skill.years_experience}
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <ScrollReveal className="mt-16">
            <h3 className="text-sm font-mono font-semibold text-accent mb-6 text-center uppercase tracking-widest">
              {t('skills.certifications')}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="px-5 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-accent/30 transition-colors"
                >
                  <p className="font-medium text-sm text-neutral-800 dark:text-neutral-200">
                    {lang === 'en' ? cert.title_en : cert.title_es}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
