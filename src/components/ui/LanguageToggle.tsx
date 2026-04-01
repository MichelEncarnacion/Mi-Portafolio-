import type { Lang } from '../../lib/types';

interface LanguageToggleProps {
  lang: Lang;
  onToggle: () => void;
}

export default function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700
                 transition-colors duration-200 text-text-primary dark:text-text-primary-dark"
      aria-label={`Switch to ${lang === 'en' ? 'Spanish' : 'English'}`}
    >
      <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
      <span className="text-text-secondary">/</span>
      <span className={lang === 'es' ? 'opacity-100' : 'opacity-40'}>ES</span>
    </button>
  );
}
