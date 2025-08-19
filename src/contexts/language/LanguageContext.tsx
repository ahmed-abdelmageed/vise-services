import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageContextType } from './types';
import { translations } from './translations';

export const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  toggleLanguage: () => {},
  t: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLang = sessionStorage.getItem('language');
    return storedLang === 'en' || storedLang === 'ar' ? (storedLang as Language) : 'ar';
  });

  useEffect(() => {
    sessionStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
