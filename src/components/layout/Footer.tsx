import { Heart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-text-secondary">
        <p>
          &copy; {year} Michel Encarnaci&oacute;n. {t('footer.rights')}
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5">
          {t('footer.built_with')}
          <Heart size={14} className="text-red-500 fill-red-500" />
          Astro &amp; React
        </p>
      </div>
    </footer>
  );
}
