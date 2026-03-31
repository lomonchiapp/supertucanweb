import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Country {
  code: string;
  name: string;
  flag: string;
  phone: string;
  currency: string;
  language: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: 'dominican_republic', name: 'República Dominicana', flag: '🇩🇴', phone: '+1', currency: 'DOP', language: 'es' },
  { code: 'panama', name: 'Panamá', flag: '🇵🇦', phone: '+507', currency: 'PAB', language: 'es' },
  { code: 'colombia', name: 'Colombia', flag: '🇨🇴', phone: '+57', currency: 'COP', language: 'es' },
  { code: 'mexico', name: 'México', flag: '🇲🇽', phone: '+52', currency: 'MXN', language: 'es' },
  { code: 'guatemala', name: 'Guatemala', flag: '🇬🇹', phone: '+502', currency: 'GTQ', language: 'es' },
  { code: 'costa_rica', name: 'Costa Rica', flag: '🇨🇷', phone: '+506', currency: 'CRC', language: 'es' },
  { code: 'honduras', name: 'Honduras', flag: '🇭🇳', phone: '+504', currency: 'HNL', language: 'es' },
  { code: 'nicaragua', name: 'Nicaragua', flag: '🇳🇮', phone: '+505', currency: 'NIO', language: 'es' },
  { code: 'el_salvador', name: 'El Salvador', flag: '🇸🇻', phone: '+503', currency: 'USD', language: 'es' },
  { code: 'ecuador', name: 'Ecuador', flag: '🇪🇨', phone: '+593', currency: 'USD', language: 'es' },
  { code: 'peru', name: 'Perú', flag: '🇵🇪', phone: '+51', currency: 'PEN', language: 'es' },
  { code: 'bolivia', name: 'Bolivia', flag: '🇧🇴', phone: '+591', currency: 'BOB', language: 'es' },
  { code: 'other', name: 'Otro País', flag: '🌎', phone: '+1', currency: 'USD', language: 'es' },
];

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

interface CountryState {
  selectedCountry: Country | null;
  selectedLanguage: Language;
  hasSelectedCountry: boolean;
  lastSelectionDate: string | null;
  isDetecting: boolean;
  setCountry: (country: Country) => void;
  setLanguage: (language: Language) => void;
  setHasSelectedCountry: (selected: boolean) => void;
  setIsDetecting: (detecting: boolean) => void;
  detectCountry: () => Promise<void>;
  shouldShowLanding: () => boolean;
}

const COUNTRY_CODE_MAP: Record<string, string> = {
  DO: 'dominican_republic',
  PA: 'panama',
  CO: 'colombia',
  MX: 'mexico',
  GT: 'guatemala',
  CR: 'costa_rica',
  HN: 'honduras',
  NI: 'nicaragua',
  SV: 'el_salvador',
  EC: 'ecuador',
  PE: 'peru',
  BO: 'bolivia',
};

export const useCountryStore = create<CountryState>()(
  persist(
    (set, get) => ({
      selectedCountry: null,
      selectedLanguage: LANGUAGES[0],
      hasSelectedCountry: false,
      lastSelectionDate: null,
      isDetecting: false,

      setCountry: (country) => set({ selectedCountry: country }),
      setLanguage: (language) => set({ selectedLanguage: language }),

      setHasSelectedCountry: (selected) => {
        set({
          hasSelectedCountry: selected,
          lastSelectionDate: selected ? new Date().toISOString() : null,
        });
      },

      setIsDetecting: (detecting) => set({ isDetecting: detecting }),

      shouldShowLanding: () => {
        const { hasSelectedCountry, lastSelectionDate } = get();
        if (!hasSelectedCountry) return true;
        if (!lastSelectionDate) return true;

        // Solo mostrar de nuevo después de 30 días
        const lastDate = new Date(lastSelectionDate);
        const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince > 30;
      },

      detectCountry: async () => {
        const state = get();
        if (state.isDetecting) return;

        set({ isDetecting: true });

        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();

          if (data?.country) {
            const detectedCode = COUNTRY_CODE_MAP[data.country];
            const detectedCountry = COUNTRIES.find((c) => c.code === detectedCode);
            set({ selectedCountry: detectedCountry || COUNTRIES.find((c) => c.code === 'other')! });
          }
        } catch {
          const defaultCountry = COUNTRIES.find((c) => c.code === 'dominican_republic');
          if (defaultCountry) set({ selectedCountry: defaultCountry });
        } finally {
          set({ isDetecting: false });
        }
      },
    }),
    {
      name: 'country-storage',
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        selectedLanguage: state.selectedLanguage,
        hasSelectedCountry: state.hasSelectedCountry,
        lastSelectionDate: state.lastSelectionDate,
      }),
    }
  )
);
