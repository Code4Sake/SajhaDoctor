import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Premium language toggle button — EN ↔ ने
 * Usage: <LanguageSwitcher /> or <LanguageSwitcher variant="minimal" />
 */
export default function LanguageSwitcher({ variant = 'default' }) {
  const { lang, toggleLanguage, isNepali } = useLanguage();

  if (variant === 'minimal') {
    return (
      <motion.button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
        style={{ background: 'var(--s50)', color: 'var(--s600)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isNepali ? 'Switch to English' : 'नेपालीमा बदल्नुहोस्'}
      >
        <span style={{ opacity: isNepali ? 0.4 : 1, transition: 'opacity 0.2s' }}>EN</span>
        <span style={{ color: 'var(--s300)' }}>|</span>
        <span style={{ opacity: isNepali ? 1 : 0.4, transition: 'opacity 0.2s' }}>ने</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative flex items-center gap-0 rounded-full overflow-hidden"
      style={{
        background: 'var(--s100)',
        padding: '3px',
        width: '72px',
        height: '32px',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      title={isNepali ? 'Switch to English' : 'नेपालीमा बदल्नुहोस्'}
    >
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-[3px] w-[33px] h-[26px] rounded-full"
        style={{
          background: 'var(--blue-600)',
          boxShadow: '0 2px 8px -2px rgba(37,99,235,0.4)',
        }}
        animate={{ left: isNepali ? '36px' : '3px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* EN label */}
      <span
        className="relative z-10 flex-1 text-center text-xs font-extrabold transition-colors duration-200"
        style={{ color: isNepali ? 'var(--s400)' : 'white' }}
      >
        EN
      </span>

      {/* NE label */}
      <span
        className="relative z-10 flex-1 text-center text-xs font-extrabold transition-colors duration-200"
        style={{ color: isNepali ? 'white' : 'var(--s400)' }}
      >
        ने
      </span>
    </motion.button>
  );
}
