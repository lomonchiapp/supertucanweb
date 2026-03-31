import { useState, useEffect, useRef } from 'react';
import { useNavigationStore, type NavigationSection } from '@/store/navigationStore';
import { useCountryStore } from '@/store/countryStore';
import { ModernQuoteSheet } from './ModernQuoteSheet';

const NAV_ITEMS: { key: NavigationSection; name: string }[] = [
  { key: 'modelos', name: 'MODELOS' },
  { key: 'marca', name: 'LA MARCA' },
  { key: 'dealers', name: 'DEALERS' },
  { key: 'partes', name: 'PARTES' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isQuoteSheetOpen, setIsQuoteSheetOpen] = useState(false);
  const { activeSection, setActiveSection, setSelectedCategory } = useNavigationStore();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveSection('modelos');
    setIsMegaMenuOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); setIsMegaMenuOpen(false); }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* ════════════════════════════════════════════════════════ */}
      {/* DESKTOP: Logo protagonista + barra de nav inferior      */}
      {/* ════════════════════════════════════════════════════════ */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50">
        {/* Fondo */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-b border-white/5" />

        <div className="relative">
          {/* Fila superior: idioma — LOGO — cotizar */}
          <div className="flex items-center justify-between max-w-7xl mx-auto px-8 h-20">
            {/* Izquierda: idioma */}
            <div className="w-40">
              <LanguageSelector />
            </div>

            {/* Centro: LOGO grande y protagonista */}
            <button
              onClick={() => setActiveSection('hero')}
              className="flex-shrink-0 focus:outline-none group"
              aria-label="Ir al inicio"
            >
              <img
                src="/logo-white.png"
                alt="Super Tucán"
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Derecha: CTA */}
            <div className="w-40 flex justify-end">
              <button
                onClick={() => setIsQuoteSheetOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-xs font-bold tracking-[0.2em] font-accent transition-all duration-300 hover:scale-105"
                style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0% 100%)' }}
              >
                COTIZAR
              </button>
            </div>
          </div>

          {/* Fila inferior: barra de navegación centrada */}
          <nav
            className="flex items-center justify-center gap-1 border-t border-white/5 h-10"
            aria-label="Navegación principal"
          >
            {NAV_ITEMS.map((item) => {
              const isModelos = item.key === 'modelos';
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={isModelos ? () => setIsMegaMenuOpen(true) : undefined}
                  onMouseLeave={isModelos ? () => setIsMegaMenuOpen(false) : undefined}
                >
                  <button
                    onClick={() => setActiveSection(item.key)}
                    className={`relative px-5 py-2 text-[11px] font-bold tracking-[0.25em] font-accent transition-colors duration-300 ${
                      activeSection === item.key
                        ? 'text-red-500'
                        : 'text-white/50 hover:text-white'
                    }`}
                    aria-expanded={isModelos ? isMegaMenuOpen : undefined}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-red-500 transition-all duration-300 ${
                      activeSection === item.key ? 'w-5' : 'w-0'
                    }`} />
                  </button>

                  {/* Mega menu solo en MODELOS */}
                  {isModelos && (
                    <div
                      className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-out ${
                        isMegaMenuOpen
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-3 pointer-events-none'
                      }`}
                      style={{ top: '120px' }}
                      role="menu"
                    >
                      <MegaMenuContent
                        onCategoryClick={handleCategoryClick}
                        onQuoteClick={() => setIsQuoteSheetOpen(true)}
                        isOpen={isMegaMenuOpen}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Separadores decorativos entre items */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[88px] pointer-events-none" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-px h-3 bg-white/10" />
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════ */}
      {/* MOBILE                                                   */}
      {/* ════════════════════════════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
        <div className="relative h-full flex items-center justify-between px-4">
          <button onClick={() => setActiveSection('hero')} className="focus:outline-none" aria-label="Ir al inicio">
            <img src="/logo-white.png" alt="Super Tucán" className="h-9 w-auto" />
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
            className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
          >
            <div className="flex flex-col gap-[5px]">
              <div className="w-[18px] h-[1.5px] bg-white rounded-full" />
              <div className="w-[14px] h-[1.5px] bg-white rounded-full" />
              <div className="w-[18px] h-[1.5px] bg-white rounded-full" />
            </div>
          </button>
        </div>
      </header>

      {/* Spacers */}
      <div className="h-[120px] hidden lg:block" />
      <div className="h-16 lg:hidden" />

      {/* ════════════════════════════════════════════════════════ */}
      {/* OFFCANVAS                                                */}
      {/* ════════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gray-950 shadow-2xl" role="dialog" aria-modal="true">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <img src="/logo-white.png" alt="Super Tucán" className="h-9 w-auto" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Cerrar menú"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-6" aria-label="Navegación móvil">
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => { setActiveSection(item.key); setIsMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-lg font-bold tracking-[0.15em] font-accent transition-colors ${
                      activeSection === item.key
                        ? 'text-red-500 bg-red-500/10'
                        : 'text-white hover:text-red-400 hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <LanguageSelector />
              </div>

              <button
                onClick={() => { setIsQuoteSheetOpen(true); setIsMenuOpen(false); }}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-4 text-sm font-bold tracking-[0.2em] font-accent rounded-lg transition-colors"
              >
                COTIZAR AHORA
              </button>

              <div className="mt-8 text-center">
                <p className="text-white/40 text-xs font-accent tracking-[0.2em] mb-1">AYUDA</p>
                <a href="tel:+12345678900" className="text-white font-bold font-sans hover:text-red-400 transition-colors duration-300">+1 234 567 8900</a>
              </div>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex justify-center gap-4">
                {([
                  { name: 'facebook', url: 'https://facebook.com/supertucan' },
                  { name: 'instagram', url: 'https://instagram.com/supertucan' },
                  { name: 'youtube', url: 'https://youtube.com/@supertucan' },
                ] as const).map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label={social.name}>
                    <SocialIcon name={social.name} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ModernQuoteSheet isOpen={isQuoteSheetOpen} onClose={() => setIsQuoteSheetOpen(false)} />
    </>
  );
}

/* ═════════════════════════════════════════════════════════ */

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLanguage, setLanguage } = useCountryStore();
  const ref = useRef<HTMLDivElement>(null);

  const langs = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ];
  const current = langs.find((l) => l.code === selectedLanguage?.code) || langs[0];

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white/50 hover:text-white transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Idioma"
      >
        <span>{current.flag}</span>
        <span className="font-bold tracking-[0.15em] font-accent uppercase">{current.code}</span>
        <svg className={`w-2.5 h-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-950 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 min-w-[140px]" role="listbox">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLanguage(l); setIsOpen(false); }}
              role="option"
              aria-selected={selectedLanguage?.code === l.code}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                selectedLanguage?.code === l.code ? 'bg-red-600 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{l.flag}</span>
              <span className="font-bold font-accent tracking-wider">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════ */

function MegaMenuContent({ onCategoryClick, onQuoteClick, isOpen }: {
  onCategoryClick: (categoryId: string) => void;
  onQuoteClick: () => void;
  isOpen: boolean;
}) {
  const categories = [
    { id: 'motocicleta', name: 'MOTOCICLETA', tag: '4 MODELOS', image: '/bikes/ADRI SPORT/azul/main.avif' },
    { id: 'passola', name: 'PASSOLA', tag: '2 MODELOS', image: '/bikes/BWS/azul/main.avif' },
    { id: 'atv', name: 'ATV', tag: 'PRONTO', image: null },
    { id: 'sport', name: 'SPORT', tag: '1 MODELO', image: '/bikes/ST 125/azul/main.avif' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Fondo oscuro con textura */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)',
          backgroundSize: '8px 8px',
        }}
      />
      {/* Línea roja top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-8 py-8">
        {/* Grid de categorías */}
        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="group relative overflow-hidden rounded-lg border border-white/8 hover:border-red-500/50 transition-all duration-400"
              role="menuitem"
              style={{
                transitionDelay: isOpen ? `${i * 60}ms` : '0ms',
              }}
            >
              {/* Fondo hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Imagen */}
              <div className="relative h-32 flex items-center justify-center overflow-hidden bg-black/30">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-white/25 tracking-[0.2em] font-accent">PRÓXIMAMENTE</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="relative px-4 py-3 flex items-center justify-between border-t border-white/5">
                <div>
                  <span className="block text-sm font-bold text-white tracking-[0.12em] font-accent group-hover:text-red-400 transition-colors duration-300">
                    {cat.name}
                  </span>
                  <span className="block text-[9px] text-white/30 tracking-[0.15em] font-accent mt-0.5">
                    {cat.tag}
                  </span>
                </div>
                {/* Flecha */}
                <svg
                  className="w-4 h-4 text-white/15 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Línea roja inferior animada */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
            </button>
          ))}
        </div>

        {/* CTA bar */}
        <div className="mt-5 flex items-center justify-between px-5 py-3 rounded-lg border border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-600/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-white/80 tracking-[0.1em] font-accent">¿NECESITAS AYUDA?</span>
              <span className="text-[10px] text-white/30 ml-2 font-sans">Nuestros expertos te asesoran</span>
            </div>
          </div>
          <button
            onClick={onQuoteClick}
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 text-[10px] font-bold tracking-[0.2em] font-accent transition-colors duration-300"
            style={{ clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0% 100%)' }}
          >
            COTIZAR AHORA
          </button>
        </div>
      </div>

      {/* Línea roja bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
    </div>
  );
}

/* ═════════════════════════════════════════════════════════ */

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  };
  return paths[name] ? (
    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d={paths[name]} /></svg>
  ) : null;
}
