import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

export default function CTA() {
  const { t } = useLanguage();
  return (
    <section className="sec" style={{ background: 'var(--white)' }}>
      <div className="ctr">
        <motion.div className="blue-box px-6 py-16 md:px-16 md:py-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>

          <div className="absolute top-[-80px] right-[-60px] w-[240px] h-[240px] rounded-full opacity-[0.06]" style={{ background: 'white' }} />
          <div className="absolute bottom-[-60px] left-[-40px] w-[200px] h-[200px] rounded-full opacity-[0.04]" style={{ background: 'white' }} />

          <div className="relative max-w-2xl mx-auto">
            <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.3em] mb-6"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('cta.nepaliTag')}
            </p>
            <h2 className="text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-extrabold mb-6"
              style={{ color: 'white', lineHeight: 1.08, letterSpacing: '-0.045em' }}>
              {t('cta.title')}
            </h2>
            <p className="text-[1rem] md:text-[1.1rem] mb-10 max-w-md mx-auto leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.65)' }}>
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
              <Link to="/home/PatientRegister">
                <motion.button className="btn-white"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  {t('cta.getStarted')} <ArrowRight size={18} strokeWidth={2.5} />
                </motion.button>
              </Link>
              <Link to="/home/DoctorRegister">
                <motion.button
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[14px] text-white font-bold text-[0.95rem]"
                  style={{ border: '2px solid rgba(255,255,255,0.2)', background: 'transparent' }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)', scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  {t('cta.joinDoctor')}
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
