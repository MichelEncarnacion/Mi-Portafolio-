import { useState, useCallback, useEffect } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';
import type { Lang } from '../lib/types';

const locales: Record<Lang, typeof en> = { en, es };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('lang') as Lang) ?? 'en';
}

export function useTranslation() {
  const [lang, setLang] = useState<Lang>(getStoredLang);

  // Sync with other component instances via CustomEvent
  useEffect(() => {
    const handler = (e: Event) => {
      setLang((e as CustomEvent<Lang>).detail);
    };
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string): string =>
      getNestedValue(locales[lang] as unknown as Record<string, unknown>, key),
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'es' : 'en';
      window.dispatchEvent(new CustomEvent<Lang>('lang-change', { detail: next }));
      return next;
    });
  }, []);

  return { lang, setLang, toggleLang, t };
}
