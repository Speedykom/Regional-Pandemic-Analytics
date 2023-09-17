import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './common/locales/en';
import frTranslation from './common/locales/fr';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
