import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import SkillBar from '../ui/SkillBar';
import type { Skill, Certification } from '../../lib/types';

interface SkillsProps {
  skills: Skill[] | null;
  certifications: Certification[] | null;
}

const CATEGORIES = ['languages', 'frameworks', 'databases', 'other'] as const;

export default function Skills({ skills, certifications }: SkillsProps) {
  const { lang, t } = useTranslation();

  if (!skills || skills.length === 0) return null;

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = (skills ?? []).filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold">
            {t('skills.title')}
          </h2>
        </ScrollReveal>

        <div className="grid gap-10 md:grid-cols-2">
          {CATEGORIES.map((category) => {
            const catSkills = grouped[category];
            if (!catSkills || catSkills.length === 0) return null;
            return (
              <ScrollReveal key={category}>
                <div>
                  <h3 className="text-lg font-heading font-semibold mb-5">
                    {t(`skills.${category}`)}
                  </h3>
                  <div className="space-y-4">
                    {catSkills.map((skill, i) => (
                      <SkillBar
                        key={skill.id}
                        name={skill.name}
                        proficiency={skill.proficiency}
                        yearsExperience={skill.years_experience}
                        delay={i * 0.08}
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
            <h3 className="text-lg font-heading font-semibold mb-6 text-center">
              {t('skills.certifications')}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="px-5 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-sm">
                    {lang === 'en' ? cert.title_en : cert.title_es}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
