import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/lib/i18n'

export type Language = 'en' | 'vi'

interface LanguageState {
  currentLanguage: Language
  availableLanguages: Language[]
  
  // Actions
  changeLanguage: (language: Language) => Promise<void>
  getCurrentLanguage: () => Language
  getAvailableLanguages: () => Language[]
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'vi',
      availableLanguages: ['en', 'vi'],

      changeLanguage: async (language: Language) => {
        await i18n.changeLanguage(language)
        set({ currentLanguage: language })
      },

      getCurrentLanguage: () => get().currentLanguage,
      
      getAvailableLanguages: () => get().availableLanguages,
    }),
    {
      name: 'language-store',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage
      })
    }
  )
)
