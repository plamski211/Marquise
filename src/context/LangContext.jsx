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

  const value = useMemo(() => ({ lang, toggle, t }), [lang, toggle, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
