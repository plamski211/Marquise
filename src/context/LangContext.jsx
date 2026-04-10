import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations } from '../i18n/translations';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  const toggle = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'bg' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  }, []);

  const t = useCallback((key) => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }, [lang]);

  /** Translate a product field — returns bg version if available, otherwise original */
  const tp = useCallback((product, field) => {
    if (lang === 'bg') {
      const bgValue = product[`${field}_bg`];
      if (bgValue) return bgValue;
    }
    return product[field];
  }, [lang]);

  const value = useMemo(() => ({ lang, toggle, t, tp }), [lang, toggle, t, tp]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
