import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import en from './locales/en.json'
import vi from './locales/vi.json'

const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  }
}

// Initialize i18n
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      lng: 'en',
      debug: false,
      
      interpolation: {
        escapeValue: false
      },
    
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage']
      },
    
      react: {
        useSuspense: false
      }
    })
}

export default i18n
