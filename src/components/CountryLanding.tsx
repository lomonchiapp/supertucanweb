import { useEffect, useState } from 'react';
import { useCountryStore, COUNTRIES, LANGUAGES, type Country, type Language } from '@/store/countryStore';

export function CountryLanding() {
  const {
    selectedCountry,
    selectedLanguage,
    isDetecting,
    setCountry,
    setLanguage,
    setHasSelectedCountry,
    detectCountry,
  } = useCountryStore();

  const [tempCountry, setTempCountry] = useState<Country | null>(selectedCountry);
  const [tempLanguage, setTempLanguage] = useState<Language>(selectedLanguage);

  // Detectar país solo una vez al montar
  useEffect(() => {
    detectCountry();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar país detectado
  useEffect(() => {
    if (selectedCountry && !tempCountry) {
      setTempCountry(selectedCountry);
    }
  }, [selectedCountry, tempCountry]);

  const handleConfirm = () => {
    if (tempCountry) {
      setCountry(tempCountry);
      setLanguage(tempLanguage);
      setHasSelectedCountry(true);
    }
  };

  // App.tsx controla si este componente se renderiza o no,
  // así que aquí simplemente mostramos el modal.

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-landing-title"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/icon.png" alt="Super Tucán" className="h-12 w-auto mx-auto mb-3" />
          <h2 id="country-landing-title" className="text-xl font-black text-gray-900 mb-2 font-sans tracking-wider">
            BIENVENIDO A SUPER TUCÁN
          </h2>
          <p className="text-sm text-gray-600">Selecciona tu país e idioma</p>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          {/* Dropdown País */}
          <div>
            <label htmlFor="country-select" className="block text-sm font-bold text-gray-700 mb-2 font-sans">
              PAÍS
            </label>
            <div className="relative">
              <select
                id="country-select"
                value={tempCountry?.code || ''}
                onChange={(e) => {
                  const country = COUNTRIES.find((c) => c.code === e.target.value);
                  if (country) setTempCountry(country);
                }}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors duration-300 appearance-none bg-white font-sans"
              >
                <option value="">Selecciona tu país</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {tempCountry && !isDetecting && (
              <p className="text-xs text-gray-500 mt-1">Detectado automáticamente: {tempCountry.name}</p>
            )}
          </div>

          {/* Dropdown Idioma */}
          <div>
            <label htmlFor="language-select" className="block text-sm font-bold text-gray-700 mb-2 font-sans">
              IDIOMA
            </label>
            <div className="relative">
              <select
                id="language-select"
                value={tempLanguage.code}
                onChange={(e) => {
                  const language = LANGUAGES.find((l) => l.code === e.target.value);
                  if (language) setTempLanguage(language);
                }}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors duration-300 appearance-none bg-white font-sans"
              >
                {LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.flag} {language.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isDetecting && (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin mr-3" />
              <span className="text-sm text-gray-600">Detectando ubicación...</span>
            </div>
          )}

          {/* Botón */}
          <button
            onClick={handleConfirm}
            disabled={!tempCountry || !tempLanguage}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-black hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-sans"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
}
