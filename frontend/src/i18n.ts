import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './common/locales/en';
import frTranslation from './common/locales/fr';

const isBrowser = typeof window !== 'undefined';
const savedLanguage = isBrowser
  ? localStorage.getItem('i18nextLng') || 'en'
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

if (isBrowser) {
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
  });
}

export default i18n;
