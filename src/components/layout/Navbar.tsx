import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import LanguageToggle from '../ui/LanguageToggle';

const NAV_ITEMS = ['hero', 'projects', 'skills', 'experience', 'contact'] as const;
const isHomePage = () => typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '');

export default function Navbar() {
  const { lang, toggleLang, t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < lastScrollY || currentY < 100);
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_ITEMS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200 dark:border-neutral-800"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="text-xl font-heading font-bold bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent"
          >
            ME
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => isHomePage() ? scrollTo(item) : (window.location.href = `/#${item}`)}
                className={`relative text-sm font-medium transition-colors ${
                  activeSection === item
                    ? 'text-accent'
                    : 'text-text-secondary hover:text-text-primary dark:hover:text-text-primary-dark'
                }`}
              >
                {t(`nav.${item}`)}
                {activeSection === item && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                  />
                )}
              </button>
            ))}
            <a
              href="/about"
              className={`relative text-sm font-medium transition-colors ${
                typeof window !== 'undefined' && window.location.pathname === '/about'
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary dark:hover:text-text-primary-dark'
              }`}
            >
              {t('nav.about')}
            </a>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LanguageToggle lang={lang} onToggle={toggleLang} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-text-secondary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-text-secondary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => isHomePage() ? scrollTo(item) : (window.location.href = `/#${item}`)}
                  className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === item
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {t(`nav.${item}`)}
                </button>
              ))}
              <a
                href="/about"
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  typeof window !== 'undefined' && window.location.pathname === '/about'
                    ? 'text-accent bg-accent/10'
                    : 'text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {t('nav.about')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
