import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigationStore } from '@/store/navigationStore';
import { useCountryStore } from '@/store/countryStore';
import { ModernQuoteSheet } from './ModernQuoteSheet';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isQuoteSheetOpen, setIsQuoteSheetOpen] = useState(false);
  const flagRef = useRef<HTMLDivElement>(null);
  const { activeSection, setActiveSection, setSelectedCategory } = useNavigationStore();

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveSection('modelos');
    setIsMegaMenuOpen(false);
  };

  useEffect(() => {
    if (flagRef.current) {
      // Animación seamless - primer y último gradiente idénticos para loop perfecto
      const gradients = [
        'linear-gradient(45deg, #000000 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #000000 100%)',
        'linear-gradient(65deg, #1a1a1a 0%, #2a2a2a 25%, #000000 50%, #2a2a2a 75%, #1a1a1a 100%)',
        'linear-gradient(85deg, #2a2a2a 0%, #000000 25%, #1a1a1a 50%, #000000 75%, #2a2a2a 100%)',
        'linear-gradient(105deg, #1a1a1a 0%, #2a2a2a 25%, #000000 50%, #2a2a2a 75%, #1a1a1a 100%)',
        'linear-gradient(45deg, #000000 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #000000 100%)' // Mismo que el primero
      ];

      const tl = gsap.timeline({ repeat: -1 });

      // Set inicial sin animación
      gsap.set(flagRef.current, {
        background: gradients[0]
      });

      // Loop seamless - empezar desde el segundo gradiente
      for (let i = 1; i < gradients.length; i++) {
        tl.to(flagRef.current, {
          background: gradients[i],
          duration: 1.2,
          ease: "none" // Sin easing para transición uniforme
        });
      }
    }
  }, []);

  return (
    <>
      {/* Header Desktop */}
      <header className="hidden lg:block absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-0">
          <div className="flex items-center justify-center pt-6">
            
            {/* Navegación Izquierda */}
            <div className="flex items-center space-x-8 flex-1">
              {/* Botón Modelos con Megamenú */}
              <div className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <NavButton 
                  title="MODELOS" 
                  isActive={activeSection === 'modelos'}
                  onClick={() => setActiveSection('modelos')}
                />
                
                {/* Megamenú */}
                <div 
                  className={`fixed left-0 right-0 w-full bg-white/95 backdrop-blur-md shadow-2xl border-b border-gray-200/50 overflow-hidden z-[40] transition-all duration-500 ${
                    isMegaMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                  }`}
                  style={{ 
                    top: '100px', // Posición fija desde la parte superior
                    maxWidth: '100vw'
                  }}
                >
                  <MegaMenuContent onCategoryClick={handleCategoryClick} onQuoteClick={() => setIsQuoteSheetOpen(true)} />
                </div>
              </div>
              
              <NavButton 
                title="LA MARCA" 
                isActive={activeSection === 'marca'}
                onClick={() => setActiveSection('marca')}
              />
            </div>

            {/* LOGO PROTAGONISTA - Centro */}
            <div className="mx-12">
              <div 
                ref={flagRef} 
                className="relative p-10 -mt-10 shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-300 overflow-hidden"
                style={{
                  background: 'linear-gradient(-45deg, #000000, #1a1a1a, #000000, #2a2a2a)',
                  backgroundSize: '400% 400%',
                  animation: 'gradientShift 8s ease-in-out infinite'
                }}
                onClick={() => setActiveSection('hero')}
              >
                <img
                  src="/logo-white.png"
                  alt="Super Tucán"
                  className="h-28 w-auto mt-10 filter drop-shadow-2xl relative z-10"
                />
                
                {/* Efecto de brillo sutil */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    animation: 'shimmer 6s ease-in-out infinite'
                  }}
                ></div>
              </div>
            </div>
            
            <style>{`
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              
              @keyframes shimmer {
                0%, 100% { transform: translateX(-100%) rotate(45deg); }
                50% { transform: translateX(100%) rotate(45deg); }
              }
            `}</style>

            {/* Navegación Derecha */}
            <div className="flex items-center justify-end space-x-8 flex-1">
              <NavButton 
                title="DEALERS" 
                isActive={activeSection === 'dealers'}
                onClick={() => setActiveSection('dealers')}
              />
              <NavButton 
                title="PARTES" 
                isActive={activeSection === 'partes'}
                onClick={() => setActiveSection('partes')}
              />
              
              {/* Selector de Idioma */}
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Header Mobile */}
      <header className="lg:hidden absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between p-4">
          
          {/* LOGO CON FONDO NEGRO ANIMADO - Izquierda en Mobile */}
          <div className="flex items-center">
            <div ref={flagRef} className="relative bg-black p-4 -mt-4 shadow-xl rounded-lg">
              <img
                src="/logo-white.png"
                alt="Super Tucán"
                className="h-12 w-auto filter drop-shadow-xl cursor-pointer"
                onClick={() => setActiveSection('hero')}
              />
            </div>
          </div>

          {/* Botón de Menú Mobile */}
          <button 
            onClick={openMenu}
            className="group"
          >
            <div className="w-12 h-12 bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-700/50 shadow-xl flex items-center justify-center transition-all duration-300 group-hover:bg-gray-800/90 group-hover:scale-110">
              <div className="flex flex-col space-y-1">
                <div className="w-5 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-6"></div>
                <div className="w-3 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-6"></div>
                <div className="w-5 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-6"></div>
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Offcanvas Menu */}
      <div className={`fixed inset-0 z-[100] ${isMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-lg transition-opacity duration-500"
          onClick={closeMenu}
        ></div>
        
        {/* Panel del Menú */}
        <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl transform transition-all duration-500 ease-out ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          
          {/* Header del menú */}
          <div className="relative p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <img 
                src="/logo-full.png" 
                alt="Super Tucán" 
                className="h-12 w-auto filter drop-shadow-lg" 
              />
              
              <button 
                onClick={closeMenu}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Navegación */}
          <nav className="p-8 space-y-8">
            {/* Selector de idioma móvil */}
            <div className="flex justify-center mb-8">
              <LanguageSelector />
            </div>
            
            {/* Items del menú */}
            {[
              { key: 'modelos', name: 'MODELOS' },
              { key: 'marca', name: 'LA MARCA' },
              { key: 'dealers', name: 'DEALERS' },
              { key: 'partes', name: 'PARTES' }
            ].map((item, index) => (
              <button 
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key as any);
                  closeMenu();
                }}
                className="group block relative overflow-hidden w-full text-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                
                <span 
                  className="relative block text-3xl font-black text-white group-hover:text-red-400 transition-all duration-300 transform group-hover:translate-x-4"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  {item.name}
                </span>
                
                <div className="h-0.5 bg-gradient-to-r from-red-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2"></div>
              </button>
            ))}
            
            {/* CTA destacado */}
            <div className="pt-8 mt-8 border-t border-white/10">
              <button 
                onClick={() => {
                  setIsQuoteSheetOpen(true);
                  closeMenu();
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-6 text-2xl font-black hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                COTIZAR AHORA
              </button>
            </div>
            
            {/* Información de contacto */}
            <div className="pt-8 space-y-4 text-center">
              <div className="text-white/60 text-sm" style={{ fontFamily: 'Bebas Neue' }}>
                ¿NECESITAS AYUDA?
              </div>
              <div className="text-white text-lg font-bold">
                +1 234 567 8900
              </div>
            </div>
          </nav>
          
          {/* Footer del menú con redes sociales */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex justify-center space-x-6">
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.986 11.988 11.986s11.987-5.366 11.987-11.986C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.317C4.198 14.553 3.5 13.353 3.5 11.987s.698-2.566 1.626-3.684c.875-.827 2.026-1.317 3.323-1.317s2.448.49 3.323 1.317c.928 1.118 1.626 2.318 1.626 3.684s-.698 2.566-1.626 3.684c-.875.827-2.026 1.317-3.323 1.317z"/>
                </svg>
              </a>
              
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sheet de Cotización Moderno */}
      <ModernQuoteSheet 
        isOpen={isQuoteSheetOpen} 
        onClose={() => setIsQuoteSheetOpen(false)} 
      />
    </>
  );
}

// Componente para los botones de navegación
function NavButton({ title, isActive, onClick }: {
  title: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const { activeSection } = useNavigationStore();
  
  // Determinar color del texto según la sección activa
  const getTextColor = () => {
    if (isActive) {
      return 'text-red-600';
    }
    
    // En secciones con fondo oscuro, usar texto blanco
    if (activeSection === 'modelos' || activeSection === 'partes') {
      return 'text-white hover:text-red-400';
    }
    
    // En otras secciones, usar texto negro
    return 'text-black hover:text-red-600';
  };

  return (
    <button
      onClick={onClick}
      className={`group relative px-6 py-4 transition-all duration-500 ${getTextColor()}`}
    >
      {/* Efecto de sombra creativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"></div>
      
      {/* Texto principal */}
      <span 
        className="relative text-2xl font-black tracking-widest transition-all duration-500 group-hover:scale-110 group-hover:tracking-wider"
        style={{ 
          fontFamily: 'Bebas Neue',
          textShadow: (() => {
            if (isActive) {
              return activeSection === 'modelos' || activeSection === 'partes' 
                ? '2px 2px 4px rgba(0,0,0,0.5)' 
                : '2px 2px 4px rgba(0,0,0,0.3)';
            }
            return activeSection === 'modelos' || activeSection === 'partes'
              ? '1px 1px 2px rgba(0,0,0,0.3)'
              : '1px 1px 2px rgba(0,0,0,0.1)';
          })()
        }}
      >
        {title}
      </span>
      
      {/* Línea decorativa mejorada */}
      <div 
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transition-all duration-500 rounded-full ${
          isActive ? 'w-full shadow-lg shadow-red-500/50' : 'w-0 group-hover:w-full group-hover:shadow-md group-hover:shadow-red-500/30'
        }`}
      ></div>
      
      {/* Efectos laterales creativos */}
      <div className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-red-600 transition-all duration-300 ${
        isActive ? 'h-8' : 'group-hover:h-4'
      }`}></div>
      <div className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-red-600 transition-all duration-300 ${
        isActive ? 'h-8' : 'group-hover:h-4'
      }`}></div>
      
      {/* Partículas decorativas */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
    </button>
  );
}

// Componente selector de idioma
function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSection } = useNavigationStore();
  const { selectedLanguage, setLanguage } = useCountryStore();
  
  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];
  
  // Usar el idioma seleccionado del store global
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage?.code) || languages[0];
  
  // Determinar color del texto según la sección activa
  const getTextColor = () => {
    // En secciones con fondo oscuro, usar texto blanco
    if (activeSection === 'modelos' || activeSection === 'partes') {
      return 'text-white hover:text-red-400';
    }
    
    // En otras secciones, usar texto negro
    return 'text-black hover:text-red-600';
  };
  
  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${getTextColor()}`}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span 
          className="font-bold text-sm tracking-wider"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          {currentLanguage?.code || 'ES'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        
        {/* Efecto de fondo al hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden z-[45] min-w-[160px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLanguage(language);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                selectedLanguage?.code === language.code
                  ? 'bg-red-600 text-white'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col items-start">
                <span 
                  className="font-bold text-sm tracking-wider"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  {language.code}
                </span>
                <span className="text-xs opacity-75">{language.name}</span>
              </div>
              {selectedLanguage?.code === language.code && (
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente del contenido del megamenú simplificado
function MegaMenuContent({ onCategoryClick, onQuoteClick }: { 
  onCategoryClick: (categoryId: string) => void;
  onQuoteClick: () => void;
}) {
  // Definición de categorías para el megamenú
  const categories = [
    {
      id: 'motocicleta',
      name: 'MOTOCICLETA',
      image: '/src/assets/bikes/ADRI SPORT/azul/main.avif',
      hasModels: true
    },
    {
      id: 'passola',
      name: 'PASSOLA',
      image: '/src/assets/bikes/BWS/azul/main.avif',
      hasModels: true
    },
    {
      id: 'atv',
      name: 'ATV',
      image: null,
      hasModels: false
    },
    {
      id: 'sport',
      name: 'SPORT',
      image: '/src/assets/bikes/ST 125/azul/main.avif',
      hasModels: true
    }
  ];
  
  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="relative z-10 p-8">
        {/* Header del megamenú */}
        <div className="text-center mb-8">
          <h3 
            className="text-3xl font-black text-gray-900 mb-2 tracking-wider"
            style={{ fontFamily: 'Bebas Neue' }}
          >
            EXPLORA NUESTROS VEHÍCULOS
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
        </div>
        
        {/* Grid de categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
              onClick={() => onCategoryClick(category.id)}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card contenedor */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 overflow-hidden">
                
                {/* Imagen miniatura */}
                <div className="relative h-32 overflow-hidden flex items-center justify-center">
                  {category.image ? (
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                      <div className="text-3xl mb-1">🚧</div>
                      <p 
                        className="text-xs font-black tracking-wider"
                        style={{ fontFamily: 'Bebas Neue' }}
                      >
                        PRÓXIMAMENTE
                      </p>
                    </div>
                  )}
                  
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Contenido de la card */}
                <div className="p-4">
                  <h4 
                    className="text-lg font-black text-gray-900 text-center tracking-wider"
                    style={{ fontFamily: 'Bebas Neue' }}
                  >
                    {category.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer del megamenú */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 text-white shadow-2xl mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h4 
                className="text-2xl font-black mb-2 tracking-wider"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                ¿NECESITAS AYUDA PARA ELEGIR?
              </h4>
              <p className="text-gray-300 text-sm">Nuestros expertos te ayudan a encontrar el vehículo perfecto</p>
            </div>
            
            <button 
              onClick={onQuoteClick}
              className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:from-red-700 hover:via-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-red-400/30"
              style={{ fontFamily: 'Bebas Neue' }}
            >
              COTIZAR AHORA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



