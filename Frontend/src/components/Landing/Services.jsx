import React from 'react';
import { motion } from 'framer-motion';
import { Video, Brain, Calendar, Shield, Pill, FolderHeart } from 'lucide-react';
import TextReveal from '../ui/TextReveal';
import { useLanguage } from '../../i18n/LanguageContext';

const features = [
  { icon: Video, title: 'Video Consultation', sub: 'भिडियो परामर्श', desc: 'HD video calls with screen sharing and real-time digital prescriptions.', color: '#2563EB', bg: '#EFF6FF' },
  { icon: Brain, title: 'AI Symptom Checker', sub: 'AI लक्षण जाँच', desc: 'Describe symptoms in Nepali or English — instant AI-powered guidance.', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: Calendar, title: 'Smart Scheduling', sub: 'स्मार्ट तालिका', desc: 'Real-time availability. Book, reschedule, or cancel in one tap.', color: '#0891B2', bg: '#ECFEFF' },
  { icon: Shield, title: 'Secure & Private', sub: 'सुरक्षित', desc: 'End-to-end encrypted. HIPAA-aligned privacy for your medical data.', color: '#059669', bg: '#ECFDF5' },
  { icon: Pill, title: 'Digital Prescriptions', sub: 'डिजिटल नुस्खा', desc: 'Receive prescriptions digitally. Order from partner pharmacies.', color: '#DC2626', bg: '#FEF2F2' },
  { icon: FolderHeart, title: 'Health Records', sub: 'स्वास्थ्य रेकर्ड', desc: 'All your history, reports, and prescriptions in one dashboard.', color: '#D97706', bg: '#FFFBEB' },
];

export default function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="sec" style={{ background: 'var(--white)' }}>
      <div className="ctr">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <TextReveal>
            <span className="inline-block text-[0.7rem] font-extrabold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full"
              style={{ color: 'var(--blue-600)', background: 'var(--blue-50)' }}>{t('services.badge')}</span>
          </TextReveal>
          <TextReveal delay={0.05}><h2>{t('services.title')}</h2></TextReveal>
          <TextReveal delay={0.1}><p className="text-[1.05rem] mt-4" style={{ color: 'var(--s500)' }}>{t('services.subtitle')}</p></TextReveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} className="feat-card group"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <div className="relative z-10">
                  <motion.div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-5"
                    style={{ background: f.bg }}
                    whileHover={{ scale: 1.15, rotate: -8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                    <Icon size={24} style={{ color: f.color }} strokeWidth={1.8} />
                  </motion.div>
                  <h3 className="text-[1.1rem] font-extrabold mb-0.5" style={{ color: 'var(--navy-800)' }}>{f.title}</h3>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: f.color }}>{f.sub}</p>
                  <p className="text-[0.875rem] leading-[1.65]" style={{ color: 'var(--s500)' }}>{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
