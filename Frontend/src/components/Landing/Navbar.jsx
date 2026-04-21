import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router';
import { useLanguage } from '../../i18n/LanguageContext';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const linkKeys = [
  { key: 'nav.services', href: '#services' },
  { key: 'nav.howItWorks', href: '#how-it-works' },
  { key: 'nav.doctors', href: '#doctors' },
  { key: 'nav.testimonials', href: '#reviews' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const barW = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const { t } = useLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      {/* Progress bar with gradient */}
      <motion.div style={{ width: barW }}
        className="fixed top-0 left-0 h-[3px] z-[200]"
        animate={{ opacity: scrolled ? 1 : 0 }}>
        <div className="h-full" style={{ background: 'linear-gradient(90deg, var(--blue-600), var(--blue-400), var(--blue-300))' }} />
      </motion.div>

      <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.6)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(15,23,42,0.06)' : '1px solid transparent',
        }}>
        <div className="ctr flex items-center justify-between" style={{ height: '72px' }}>

          {/* Logo — interactive */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-11 h-11 rounded-[13px] flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <img src="/logo.png" alt="SajhaDoctor" className="w-full h-full object-cover rounded-[13px]" />
            </motion.div>
            <span className="text-[1.4rem] font-extrabold tracking-[-0.03em]" style={{ color: 'var(--navy-800)' }}>
              Sajha<span style={{ color: 'var(--blue-600)' }}>Doctor</span>
            </span>
          </Link>

          {/* Desktop nav — ANIMATED UNDERLINE LINKS */}
          <nav className="hidden lg:flex items-center gap-8">
            {linkKeys.map(l => (
              <a key={l.key} href={l.href} onClick={e => go(e, l.href)} className="nav-item">
                {t(l.key)}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/home/Login">
              <motion.span
                className="text-[0.9rem] font-bold px-5 py-2.5 rounded-[12px] block"
                style={{ color: 'var(--s600)' }}
                whileHover={{ backgroundColor: 'var(--s100)', color: 'var(--navy-800)' }}
                transition={{ duration: 0.2 }}
              >
                {t('nav.login')}
              </motion.span>
            </Link>
            <Link to="/home/PatientRegister">
              <motion.button className="btn-primary btn-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                {t('nav.getStarted')}
              </motion.button>
            </Link>
          </div>

          {/* Hamburger */}
          <button className="lg:hidden w-11 h-11 flex items-center justify-center rounded-[12px] transition-colors"
            onClick={() => setOpen(!open)} aria-label="Menu"
            style={{ background: open ? 'var(--blue-50)' : 'transparent' }}>
            <div className="flex flex-col gap-[5px]">
              <motion.span className="block w-[18px] h-[2px] rounded-full origin-center"
                style={{ background: open ? 'var(--blue-600)' : 'var(--navy-800)' }}
                animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} />
              <motion.span className="block w-[12px] h-[2px] rounded-full"
                style={{ background: open ? 'var(--blue-600)' : 'var(--navy-800)' }}
                animate={open ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }} />
              <motion.span className="block w-[18px] h-[2px] rounded-full origin-center"
                style={{ background: open ? 'var(--blue-600)' : 'var(--navy-800)' }}
                animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile fullscreen */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] bg-white/98 backdrop-blur-md flex flex-col pt-24 px-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <nav className="flex flex-col">
              {linkKeys.map((l, i) => (
                <motion.a key={l.key} href={l.href} onClick={e => go(e, l.href)}
                  className="text-[1.75rem] font-extrabold py-5 flex items-center justify-between group tracking-tight"
                  style={{ color: 'var(--navy-800)', borderBottom: '1px solid var(--s100)' }}
                  initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <span>{t(l.key)}</span>
                  <motion.span className="text-lg" style={{ color: 'var(--blue-600)' }}
                    initial={{ x: -8, opacity: 0 }} whileHover={{ x: 0, opacity: 1 }}>→</motion.span>
                </motion.a>
              ))}
            </nav>
            <motion.div className="flex flex-col gap-3 mt-10"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex justify-center mb-2"><LanguageSwitcher /></div>
              <Link to="/home/Login" className="btn-secondary w-full text-center" onClick={() => setOpen(false)}>{t('nav.login')}</Link>
              <Link to="/home/PatientRegister" className="btn-primary w-full text-center" onClick={() => setOpen(false)}>{t('nav.getStarted')}</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
