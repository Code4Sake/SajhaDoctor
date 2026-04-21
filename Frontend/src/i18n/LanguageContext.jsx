import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('sajhadoctor-lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('sajhadoctor-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'ne' ? 'ne' : 'en');
  }, [lang]);

  /** Translate a key. Falls back to English, then to the key itself. */
  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ne' : 'en');
  const isNepali = lang === 'ne';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLanguage, isNepali }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
