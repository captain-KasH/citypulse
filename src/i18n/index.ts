import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: (callback: (lng: string) => void) => {
    const bestLanguage = RNLocalize.findBestLanguageTag(['en', 'ar']);
    callback(bestLanguage?.languageTag || 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;