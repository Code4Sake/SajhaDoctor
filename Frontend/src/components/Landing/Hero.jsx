import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, Check, Star, Clock, Video, Shield, Users } from 'lucide-react';
import TextReveal from '../ui/TextReveal';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  // Cursor spotlight
  const spotRef = useRef(null);
  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;
    const move = (e) => { el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px'; };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Parallax on photos
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -40]);
  const y2 = useTransform(scrollY, [0, 600], [0, -60]);
  const y3 = useTransform(scrollY, [0, 600], [0, -25]);

  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--white)', paddingTop: '72px' }}>
      {/* Cursor spotlight */}
      <div ref={spotRef} className="hero-spotlight hidden lg:block" />

      {/* Subtle top-right blob */}
      <div className="absolute top-0 right-0 w-[50%] h-[70%] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 20%, rgba(37,99,235,0.04), transparent 60%)', zIndex: 0 }} />

      <div className="ctr relative" style={{ zIndex: 1 }}>
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center" style={{ minHeight: 'calc(100vh - 72px)' }}>

          {/* ——— LEFT COPY ——— */}
          <div className="py-16 lg:py-0 lg:pr-6">
            <TextReveal delay={0}>
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[0.8rem] font-bold mb-8 cursor-default"
                style={{ background: 'var(--blue-50)', color: 'var(--blue-600)', border: '1px solid var(--blue-100)' }}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 24px -6px rgba(37,99,235,0.15)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)', animation: 'pulse-dot 2s infinite' }} />
                {t('hero.badge')}
              </motion.div>
            </TextReveal>

            <TextReveal delay={0.06}>
              <h1 className="display-xl mb-6">
                {t('hero.title1')}{' '}
                <span className="relative inline-block" style={{ color: 'var(--blue-600)' }}>
                  {t('hero.title2')}
                  <motion.svg className="absolute -bottom-1.5 left-0 w-full h-[10px]" viewBox="0 0 200 10" fill="none"
                    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}>
                    <motion.path d="M3 7C50 2 120 2 197 7" stroke="var(--blue-300)" strokeWidth="4" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.8 }} />
                  </motion.svg>
                </span>
                {' '}{t('hero.title3')}
              </h1>
            </TextReveal>

            <TextReveal delay={0.12}>
              <p className="text-[1.15rem] leading-[1.75] mb-8 max-w-[500px]" style={{ color: 'var(--s500)' }}>
                {t('hero.subtitle')}
              </p>
            </TextReveal>

            <TextReveal delay={0.2}>
              <div className="flex flex-wrap gap-3.5 mb-9">
                <Link to="/home/PatientRegister">
                  <motion.button className="btn-primary"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    {t('hero.bookNow')} <ArrowRight size={18} strokeWidth={2.5} />
                  </motion.button>
                </Link>
                <Link to="/home/DoctorRegister">
                  <motion.button className="btn-secondary"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    {t('auth.doctor')} →
                  </motion.button>
                </Link>
              </div>
            </TextReveal>

            <TextReveal delay={0.28}>
              <div className="flex flex-wrap gap-5 text-[0.85rem] font-semibold" style={{ color: 'var(--s500)' }}>
                {[
                  t('hero.stat.doctors'),
                  t('hero.stat.available'),
                ].map(item => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--blue-50)' }}>
                      <Check size={11} style={{ color: 'var(--blue-600)' }} strokeWidth={3.5} />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </TextReveal>
          </div>

          {/* ——— RIGHT: PHOTO COLLAGE WITH PARALLAX ——— */}
          <div className="relative hidden lg:flex justify-end" style={{ minHeight: '540px' }}>

            {/* Photo 1 — BIG main */}
            <motion.div style={{ y: y1, zIndex: 3 }}
              className="absolute top-0 right-0 w-[270px] h-[370px] rounded-[22px] overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="w-full h-full relative group">
                <img src="/doctor-1.png" alt="Doctor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.12), transparent 40%)' }} />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-500" />
              </div>
            </motion.div>

            {/* Photo 2 — Top left */}
            <motion.div style={{ y: y2, zIndex: 2 }}
              className="absolute top-6 left-0 w-[185px] h-[245px] rounded-[20px] overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="w-full h-full group">
                <img src="/doctor-2.png" alt="Doctor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </motion.div>

            {/* Photo 3 — Bottom left */}
            <motion.div style={{ y: y3, zIndex: 4 }}
              className="absolute bottom-6 left-10 w-[175px] h-[215px] rounded-[20px] overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="w-full h-full group">
                <img src="/doctor-3.png" alt="Doctor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </motion.div>

            {/* ═ FLOATING INTERACTIVE CARDS ═ */}

            {/* Rating */}
            <motion.div className="absolute top-[-12px] left-[34%] glass-float" style={{ zIndex: 20 }}
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}>
              <div className="flex gap-[2px] mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FBBF24" stroke="#FBBF24" />)}
              </div>
              <p className="text-[0.8rem] font-extrabold" style={{ color: 'var(--navy-800)' }}>4.9 out of 5</p>
              <p className="text-[0.65rem] font-medium" style={{ color: 'var(--s400)' }}>50,000+ patient reviews</p>
            </motion.div>

            {/* Video call */}
            <motion.div className="absolute right-[-16px] top-[50%] glass-float" style={{ zIndex: 20 }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'var(--blue-50)' }}>
                  <Video size={18} style={{ color: 'var(--blue-600)' }} />
                </div>
                <div>
                  <p className="text-[0.8rem] font-extrabold" style={{ color: 'var(--navy-800)' }}>HD Video Call</p>
                  <p className="text-[0.65rem] font-medium" style={{ color: 'var(--s400)' }}>Crystal clear quality</p>
                </div>
              </div>
            </motion.div>

            {/* Available */}
            <motion.div className="absolute bottom-[-8px] right-4 glass-float" style={{ zIndex: 20 }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'var(--green-bg)' }}>
                  <Clock size={18} style={{ color: 'var(--green)' }} />
                </div>
                <div>
                  <p className="text-[0.8rem] font-extrabold" style={{ color: 'var(--navy-800)' }}>Available Now</p>
                  <p className="text-[0.65rem] font-bold" style={{ color: 'var(--green)' }}>Book in under 2 min</p>
                </div>
              </div>
            </motion.div>

            {/* Encrypted badge — floating */}
            <motion.div className="absolute bottom-[120px] left-[-12px] glass-float flex items-center gap-2"
              style={{ zIndex: 20, padding: '9px 16px', borderRadius: '999px', animation: 'float-slow 5s ease-in-out infinite' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}>
              <Shield size={14} style={{ color: 'var(--blue-600)' }} strokeWidth={2.5} />
              <span className="text-[0.72rem] font-bold" style={{ color: 'var(--s600)' }}>End-to-End Encrypted</span>
            </motion.div>

            {/* Decorative blur */}
            <div className="absolute top-20 left-12 w-[300px] h-[300px] rounded-full"
              style={{ background: 'var(--blue-100)', opacity: 0.25, filter: 'blur(100px)', zIndex: 0 }} />
          </div>
        </div>
      </div>
    </section>
  );
}
