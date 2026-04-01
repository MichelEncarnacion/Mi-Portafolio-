import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SkillBarProps {
  name: string;
  proficiency: number;
  yearsExperience: string | null;
  delay?: number;
}

export default function SkillBar({ name, proficiency, yearsExperience, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{name}</span>
        {yearsExperience && (
          <span className="text-xs text-text-secondary">{yearsExperience}</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-violet"
        />
      </div>
    </div>
  );
}
