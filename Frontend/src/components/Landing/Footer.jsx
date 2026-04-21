import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t('footer.platform')]: [
      { label: t('dash.findDoctors'), href: '/dashboard/find-doctors' },
      { label: t('services.prescription.title'), href: '/dashboard/prescriptions' },
      { label: t('dash.appointments'), href: '/dashboard/appointments' },
      { label: t('footer.forDoctors'), href: '/home/DoctorRegister' },
    ],
    [t('footer.company')]: [
      { label: t('footer.aboutUs'), href: '#' },
      { label: t('footer.careers'), href: '#' },
      { label: t('footer.contact'), href: '#' },
    ],
    [t('footer.legal')]: [
      { label: t('footer.privacy'), href: '#' },
      { label: t('footer.terms'), href: '#' },
      { label: t('footer.hipaa'), href: '#' },
    ],
  };

  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.45)' }}>
      <div className="ctr py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <motion.div className="w-10 h-10 rounded-[12px] flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.08, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                <img src="/logo.png" alt="SajhaDoctor" className="w-full h-full object-cover rounded-[12px]" />
              </motion.div>
              <span className="text-[1.3rem] font-extrabold text-white tracking-[-0.03em]">
                Sajha<span style={{ color: 'var(--blue-400)' }}>Doctor</span>
              </span>
            </Link>
            <p className="text-[0.9rem] leading-relaxed max-w-[280px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {t('footer.tagline')}
            </p>
            <p className="text-[0.9rem] italic font-medium" style={{ color: 'var(--blue-400)' }}>
              "{t('footer.nepaliMotto')}"
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] mb-5" style={{ color: 'rgba(255,255,255,0.18)' }}>
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map(l => (
                  <li key={l.label}>
                    <Link to={l.href}
                      className="text-[0.85rem] inline-block transition-all duration-300 hover:text-white hover:translate-x-1.5">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-7">
          <p className="text-[0.75rem]" style={{ color: 'rgba(255,255,255,0.15)' }}>
            © {new Date().getFullYear()} SajhaDoctor. {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            {[t('footer.privacy'), t('footer.terms')].map(txt => (
              <a key={txt} href="#" className="text-[0.75rem] transition-all duration-300 hover:text-white">{txt}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
