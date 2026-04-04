import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download, FolderOpen } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useState, useEffect } from 'react';
import type { HeroContent } from '../../lib/types';

function useTypewriter(text: string, speed = 50, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

interface HeroProps {
  data: HeroContent | null;
}

export default function Hero({ data }: HeroProps) {
  const { lang, t } = useTranslation();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const greeting = lang === 'en' ? (data?.greeting_en ?? 'Hi, I\'m') : (data?.greeting_es ?? 'Hola, soy');
  const tagline = lang === 'en' ? (data?.tagline_en ?? 'Software Engineering Student & Full-Stack Developer') : (data?.tagline_es ?? 'Estudiante de Ingeniería de Software & Desarrollador Full-Stack');
  const description = lang === 'en' ? (data?.description_en ?? '') : (data?.description_es ?? '');
  const name = data?.name ?? 'Michel Encarnación';

  const { displayed: displayedName, done: nameDone } = useTypewriter(name, 55, 300);
  const { displayed: displayedTagline } = useTypewriter(tagline, 30, nameDone ? 0 : 99999);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Parallax Background blobs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-lg text-text-secondary"
            >
              {greeting}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mt-2 text-accent leading-tight"
            >
              {displayedName}
              <span className="animate-pulse text-accent">█</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: 0.4 }}
              className="text-xl sm:text-2xl font-heading font-medium mt-4 text-text-primary dark:text-text-primary-dark"
            >
              {displayedTagline}
              {nameDone && displayedTagline.length < tagline.length && (
                <span className="animate-pulse text-accent">█</span>
              )}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base text-text-secondary mt-6 max-w-lg leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start"
            >
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-black font-bold hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all duration-300"
              >
                <FolderOpen size={18} />
                {t('hero.cta_projects')}
              </a>
              <a
                href="/cv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-105 transition-all duration-300"
              >
                <Download size={18} />
                {t('hero.cta_cv')}
              </a>
            </motion.div>
          </div>

          {/* Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center w-full"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 flex-shrink-0">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-accent/30"
              />
              <div className="absolute inset-3 lg:inset-4 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-sm border border-white/10" />
              <div className="absolute inset-6 lg:inset-8 rounded-full overflow-hidden">
                {data?.profile_image_url ? (
                  <img
                    src={data.profile_image_url}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-accent flex items-center justify-center">
                    <span className="text-3xl lg:text-5xl font-heading font-bold text-black">ME</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={22} className="text-text-secondary" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
