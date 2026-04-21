import React from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, HeartPulse, ArrowRight } from 'lucide-react';
import TextReveal from '../ui/TextReveal';
import { useLanguage } from '../../i18n/LanguageContext';

const steps = [
  { num: '01', icon: Search, title: 'Search & Choose', nepali: 'खोज्नुहोस्', desc: 'Browse verified doctors by specialty, language, rating, and real-time availability — across all 77 districts.', img: '/doctor-2.png' },
  { num: '02', icon: CalendarCheck, title: 'Book Instantly', nepali: 'बुक गर्नुहोस्', desc: 'Choose video, audio, or chat. Pay securely via Khalti, eSewa, or card. Instant confirmation.', img: '/doctor-3.png' },
  { num: '03', icon: HeartPulse, title: 'Get Treated', nepali: 'उपचार पाउनुहोस्', desc: 'Meet your doctor in a private, encrypted session. Get digital prescriptions and follow-up care plans.', img: '/doctor-1.png' },
];

export default function Process() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="sec" style={{ background: 'var(--s50)' }}>
      <div className="ctr">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <TextReveal>
            <span className="inline-block text-[0.7rem] font-extrabold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full"
              style={{ color: 'var(--blue-600)', background: 'var(--blue-50)' }}>{t('process.badge')}</span>
          </TextReveal>
          <TextReveal delay={0.05}><h2>{t('process.title')}</h2></TextReveal>
          <TextReveal delay={0.1}><p className="text-[1.05rem] mt-4" style={{ color: 'var(--s500)' }}>{t('process.subtitle')}</p></TextReveal>
        </div>

        <div className="flex flex-col gap-16 lg:gap-24">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const rev = i % 2 === 1;
            return (
              <motion.div key={step.num}
                className={`flex flex-col ${rev ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>

                {/* Photo — interactive */}
                <div className="w-full lg:w-1/2 flex-shrink-0 group cursor-pointer">
                  <motion.div className="relative rounded-[24px] overflow-hidden"
                    style={{ boxShadow: '0 16px 48px -12px rgba(15,23,42,0.1)' }}
                    whileHover={{ y: -8, boxShadow: '0 32px 72px -16px rgba(15,23,42,0.15)' }}
                    transition={{ duration: 0.4 }}>
                    <img src={step.img} alt={step.title}
                      className="w-full h-[280px] md:h-[340px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]" />
                    {/* Step number badge */}
                    <motion.div className="absolute top-5 left-5 w-12 h-12 rounded-[14px] flex items-center justify-center text-sm font-black text-white"
                      style={{ background: 'var(--blue-600)' }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                      {step.num}
                    </motion.div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <motion.div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-5"
                    style={{ background: 'var(--blue-50)' }}
                    whileHover={{ scale: 1.12, rotate: -6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                    <Icon size={28} style={{ color: 'var(--blue-600)' }} strokeWidth={1.8} />
                  </motion.div>
                  <h3 className="text-[1.75rem] md:text-[2.25rem] font-extrabold mb-2"
                    style={{ color: 'var(--navy-800)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                    {step.title}
                  </h3>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--blue-600)' }}>
                    {step.nepali}
                  </p>
                  <p className="text-[1.05rem] leading-[1.75] mb-5" style={{ color: 'var(--s500)' }}>
                    {step.desc}
                  </p>
                  <motion.a href="#" className="inline-flex items-center gap-2 text-[0.9rem] font-bold group/link"
                    style={{ color: 'var(--blue-600)' }}
                    whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    {t('hero.learnMore')}
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
