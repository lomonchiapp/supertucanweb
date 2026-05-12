import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Language {
  code: 'es' | 'en' | 'pt';
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

interface CountryState {
  selectedLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useCountryStore = create<CountryState>()(
  persist(
    (set) => ({
      selectedLanguage: LANGUAGES[0],
      setLanguage: (language) => set({ selectedLanguage: language }),
    }),
    {
      name: 'country-storage',
      partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
    }
  )
);
