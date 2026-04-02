import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, GraduationCap, Trophy, Users } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import type { Experience as ExperienceType } from '../../lib/types';

interface ExperienceProps {
  data: ExperienceType[] | null;
}

const TYPE_ICONS = {
  work: Briefcase,
  education: GraduationCap,
  hackathon: Trophy,
  leadership: Users,
} as const;

function TimelineItem({ item, index }: { item: ExperienceType; index: number }) {
  const { lang, t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const title = lang === 'en' ? item.title_en : item.title_es;
  const description = lang === 'en' ? item.description_en : item.description_es;
  const Icon = TYPE_ICONS[item.type] ?? Briefcase;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', {
      month: 'short',
      year: 'numeric',
    });

  const startDate = formatDate(item.start_date);
  const endDate = item.end_date ? formatDate(item.end_date) : t('experience.present');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-14 pb-10 last:pb-0"
    >
      {/* Vertical line */}
      {index < 100 && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
          style={{ originY: 0 }}
          className="absolute left-[17px] top-10 bottom-0 w-px bg-gradient-to-b from-accent to-transparent last:hidden"
        />
      )}

      {/* Icon dot */}
      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20">
        <Icon size={16} className="text-white" />
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:shadow-md transition-shadow">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
            {startDate} — {endDate}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-text-secondary capitalize">
            {item.type}
          </span>
        </div>
        <h3 className="text-base font-heading font-semibold">{title}</h3>
        <p className="text-sm text-accent mt-0.5">{item.organization}</p>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">{description}</p>
        {item.extra_info && (
          <p className="text-xs text-text-secondary mt-2 italic border-t border-neutral-100 dark:border-neutral-800 pt-2">
            {item.extra_info}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function Experience({ data }: ExperienceProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold">
            {t('experience.title')}
          </h2>
        </ScrollReveal>

        <div>
          {data.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
