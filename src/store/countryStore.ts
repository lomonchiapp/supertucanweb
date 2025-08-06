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
  { code: 'other', name: 'Otro País', flag: '🌎', phone: '+1', currency: 'USD', language: 'es' }
];

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
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

export const useCountryStore = create<CountryState>()(
  persist(
    (set, get) => ({
      selectedCountry: null,
      selectedLanguage: LANGUAGES[0], // Español por defecto
      hasSelectedCountry: false,
      lastSelectionDate: null,
      isDetecting: false,

      setCountry: (country) => set({ selectedCountry: country }),
      
      setLanguage: (language) => set({ selectedLanguage: language }),
      
      setHasSelectedCountry: (selected) => {
        const today = new Date().toDateString();
        set({ hasSelectedCountry: selected, lastSelectionDate: selected ? today : null });
      },
      
      setIsDetecting: (detecting) => set({ isDetecting: detecting }),

      shouldShowLanding: () => {
        const { hasSelectedCountry, lastSelectionDate } = get();
        if (!hasSelectedCountry) return true;
        
        const today = new Date().toDateString();
        return lastSelectionDate !== today;
      },

      detectCountry: async () => {
        const { setIsDetecting, setCountry } = get();
        setIsDetecting(true);

        try {
          // Intentar detectar país por IP
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          if (data && data.country) {
            // Mapear códigos de país ISO a nuestros códigos
            const countryMapping: { [key: string]: string } = {
              'DO': 'dominican_republic',
              'PA': 'panama',
              'CO': 'colombia',
              'MX': 'mexico',
              'GT': 'guatemala',
              'CR': 'costa_rica',
              'HN': 'honduras',
              'NI': 'nicaragua',
              'SV': 'el_salvador',
              'EC': 'ecuador',
              'PE': 'peru',
              'BO': 'bolivia'
            };

            const detectedCountryCode = countryMapping[data.country];
            const detectedCountry = COUNTRIES.find(c => c.code === detectedCountryCode);
            
            if (detectedCountry) {
              setCountry(detectedCountry);
            } else {
              // Si no está en nuestra lista, usar "Otro País"
              const otherCountry = COUNTRIES.find(c => c.code === 'other');
              if (otherCountry) setCountry(otherCountry);
            }
          }
        } catch (error) {
          console.log('No se pudo detectar el país, usando República Dominicana por defecto');
          // Fallback a República Dominicana (sede principal)
          const defaultCountry = COUNTRIES.find(c => c.code === 'dominican_republic');
          if (defaultCountry) setCountry(defaultCountry);
        } finally {
          setIsDetecting(false);
        }
      }
    }),
    {
      name: 'country-storage',
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        selectedLanguage: state.selectedLanguage,
        hasSelectedCountry: state.hasSelectedCountry,
        lastSelectionDate: state.lastSelectionDate
      })
    }
  )
);