import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './common/locales/en';
import frTranslation from './common/locales/fr';
import arTranslation from './common/locales/ar';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    ar: {
      translation: arTranslation,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
