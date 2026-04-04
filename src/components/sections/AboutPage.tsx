import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import type { HeroContent, Experience, AboutContent } from '../../lib/types';

interface AboutPageProps {
  hero: HeroContent | null;
  experience: Experience[] | null;
  about: AboutContent | null;
}

const TYPE_COLORS: Record<string, string> = {
  work: 'bg-accent/10 border-accent/30 text-accent',
  education: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  hackathon: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  leadership: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
};

const TYPE_LABEL_EN: Record<string, string> = {
  work: 'Work',
  education: 'Education',
  hackathon: 'Hackathon',
  leadership: 'Leadership',
};

const TYPE_LABEL_ES: Record<string, string> = {
  work: 'Trabajo',
  education: 'Educación',
  hackathon: 'Hackathon',
  leadership: 'Liderazgo',
};

function formatDate(dateStr: string | null, presentLabel: string): string {
  if (!dateStr) return presentLabel;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function AboutPage({ hero, experience, about }: AboutPageProps) {
  const { lang, t } = useTranslation();

  const name = hero?.name ?? 'Michel Encarnación';
  const tagline = lang === 'en' ? (hero?.tagline_en ?? '') : (hero?.tagline_es ?? '');
  const description = lang === 'en' ? (hero?.description_en ?? '') : (hero?.description_es ?? '');
  const interests = (about?.interests ?? []).map((i) => ({
    icon: i.icon,
    label: lang === 'en' ? i.label_en : i.label_es,
  }));
  const typeLabel = lang === 'en' ? TYPE_LABEL_EN : TYPE_LABEL_ES;

  const published = experience?.filter((e) => e.status === 'published') ?? [];

  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-accent transition-colors mb-10 font-mono"
        >
          ← {lang === 'en' ? 'Back to Home' : 'Volver al Inicio'}
        </motion.a>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-14"
        >
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-accent/30 shadow-[0_0_24px_#4ade8033]">
              {hero?.profile_image_url ? (
                <img
                  src={hero.profile_image_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <span className="text-3xl font-heading font-bold text-accent">ME</span>
                </div>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-neutral-950" title="Available for opportunities" />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">{name}</h1>
            {tagline && (
              <p className="mt-1 text-accent font-mono text-sm">{tagline}</p>
            )}
            {description && (
              <p className="mt-4 text-neutral-300 leading-relaxed max-w-xl">{description}</p>
            )}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-14"
        >
          <h2 className="text-lg font-heading font-semibold text-white mb-5">
            {lang === 'en' ? 'Interests' : 'Intereses'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {interests.map((item) => (
              <span
                key={item.label}
                className="px-4 py-2 rounded-full text-sm font-mono bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-accent/40 hover:text-accent transition-colors"
              >
                {item.icon} {item.label}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Timeline */}
        {published.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2 className="text-lg font-heading font-semibold text-white mb-8">
              {lang === 'en' ? 'Timeline' : 'Trayectoria'}
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-700" />

              <div className="space-y-8">
                {published.map((entry, i) => {
                  const title = lang === 'en' ? entry.title_en : entry.title_es;
                  const desc = lang === 'en' ? entry.description_en : entry.description_es;
                  const startLabel = formatDate(entry.start_date, t('experience.present'));
                  const endLabel = entry.end_date
                    ? formatDate(entry.end_date, t('experience.present'))
                    : t('experience.present');

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                      className="pl-10 relative"
                    >
                      {/* Dot */}
                      <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          entry.type === 'work' ? 'bg-accent' :
                          entry.type === 'education' ? 'bg-blue-400' :
                          entry.type === 'hackathon' ? 'bg-purple-400' :
                          'bg-orange-400'
                        }`} />
                      </div>

                      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-neutral-700 transition-colors">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${TYPE_COLORS[entry.type] ?? 'bg-neutral-700 text-neutral-300'}`}>
                            {typeLabel[entry.type] ?? entry.type}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            {startLabel} — {endLabel}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white mt-1">{title}</h3>
                        <p className="text-xs text-accent/80 font-mono">{entry.organization}</p>
                        {desc && (
                          <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{desc}</p>
                        )}
                        {entry.extra_info && (
                          <p className="mt-1.5 text-xs text-neutral-500 italic">{entry.extra_info}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
