interface SkillChipProps {
  name: string;
  proficiency: number;
  yearsExperience: string | null;
}

function getLevel(proficiency: number): 'proficient' | 'familiar' | 'learning' {
  if (proficiency >= 70) return 'proficient';
  if (proficiency >= 50) return 'familiar';
  return 'learning';
}

const LEVEL_STYLES = {
  proficient: 'bg-accent/15 text-accent border-accent/40',
  familiar: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700',
  learning: 'bg-neutral-50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-800',
} as const;

const LEVEL_DOT = {
  proficient: 'bg-accent',
  familiar: 'bg-neutral-400 dark:bg-neutral-500',
  learning: 'bg-neutral-300 dark:bg-neutral-700',
} as const;

export default function SkillChip({ name, proficiency, yearsExperience }: SkillChipProps) {
  const level = getLevel(proficiency);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${LEVEL_STYLES[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${LEVEL_DOT[level]}`} />
      <span>{name}</span>
      {yearsExperience && (
        <span className="text-xs opacity-60 font-normal">{yearsExperience}</span>
      )}
    </div>
  );
}
