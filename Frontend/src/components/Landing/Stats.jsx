import React from 'react';
import TextReveal from '../ui/TextReveal';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Stats() {
  const { t } = useLanguage();

  const stats = [
    { value: 500, suffix: '+', label: t('stats.doctors') },
    { value: 77, suffix: '', label: t('stats.districts') },
    { value: 50, suffix: 'K+', label: t('stats.patients') },
    { value: 98, suffix: '%', label: t('stats.satisfaction') },
  ];

  return (
    <section style={{ background: 'var(--navy-800)' }}>
      <div className="ctr py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <TextReveal key={s.label} delay={i * 0.06}>
              <div className="text-center py-3">
                <div className="text-[2.25rem] md:text-[2.75rem] font-extrabold mb-0.5"
                  style={{ color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} duration={1800 + i * 200} />
                </div>
                <p className="text-[0.8rem] font-semibold" style={{ color: 'var(--blue-300)' }}>{s.label}</p>
              </div>
            </TextReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
