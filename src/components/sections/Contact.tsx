import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, Link, GitFork, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import ScrollReveal from '../ui/ScrollReveal';
import type { ContactInfo } from '../../lib/types';

interface ContactProps {
  contactInfo: ContactInfo | null;
}

export default function Contact({ contactInfo }: ContactProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT;

    if (!endpoint) {
      // Dev mode — simulate success
      setTimeout(() => setStatus('success'), 1000);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition text-sm';

  return (
    <section id="contact" className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold">
            {t('contact.title')}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <ScrollReveal>
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-center py-12"
              >
                <CheckCircle size={48} className="text-green-500" />
                <p className="text-lg font-medium">{t('contact.success')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
                    {t('contact.name')}
                  </label>
                  <input type="text" id="contact-name" name="name" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
                    {t('contact.email')}
                  </label>
                  <input type="email" id="contact-email" name="email" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 disabled:opacity-50"
                >
                  <Send size={16} />
                  {status === 'sending' ? '...' : t('contact.send')}
                </button>
                {status === 'error' && (
                  <p className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} /> {t('contact.error')}
                  </p>
                )}
              </form>
            )}
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal delay={0.15}>
            <div className="space-y-5 pt-2">
              {contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <span className="text-sm">{contactInfo.email}</span>
                </a>
              )}
              {contactInfo?.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <span className="text-sm">{contactInfo.phone}</span>
                </a>
              )}
              {contactInfo?.linkedin_url && (
                <a
                  href={contactInfo.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Link size={18} className="text-accent" />
                  </div>
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              {contactInfo?.github_url && (
                <a
                  href={contactInfo.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <GitFork size={18} className="text-accent" />
                  </div>
                  <span className="text-sm">GitHub</span>
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
