import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore, type NavigationSection } from '@/store/navigationStore';
import { useCountryStore, type Language } from '@/store/countryStore';
import i18n from '@/i18n';
import { ModernQuoteSheet } from './ModernQuoteSheet';
import { bikesData } from '@/data/bikes';

interface NavItem {
  key: NavigationSection;
  name: string;
  hasMega?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'modelos', name: 'header.nav.modelos', hasMega: true },
  { key: 'marca', name: 'header.nav.marca' },
  { key: 'dealers', name: 'header.nav.dealers' },
  { key: 'partes', name: 'header.nav.partes' },
];

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMegaKey, setOpenMegaKey] = useState<NavigationSection | null>(null);
  const [isQuoteSheetOpen, setIsQuoteSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { activeSection, setActiveSection, setSelectedCategory } = useNavigationStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setOpenMegaKey(null);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveSection('modelos');
    setOpenMegaKey(null);
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════ */}
      {/* DESKTOP HEADER                                            */}
      {/* ════════════════════════════════════════════════════════ */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
            : 'bg-white/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Top utility bar — fondo oscuro */}
        <div className="bg-neutral-950 text-neutral-300">
          <div className="max-w-[1400px] mx-auto px-8 h-9 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-5">
              <a href="tel:+18092468383" className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.25 1.13a11 11 0 005.5 5.5l1.13-2.25a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                </svg>
                <span className="font-semibold tracking-wide">+1 809 246 8383</span>
              </a>
              <span className="text-neutral-700">|</span>
              <span className="tracking-wide">{t('header.topbar.hours')}</span>
            </div>
            <div className="flex items-center gap-5">
              <button className="hover:text-[var(--color-primary)] transition-colors tracking-wide">{t('header.topbar.customerService')}</button>
              <span className="text-neutral-700">|</span>
              <button className="hover:text-[var(--color-primary)] transition-colors tracking-wide">{t('header.topbar.findDealer')}</button>
              <span className="text-neutral-700">|</span>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Main nav row */}
        <div className="max-w-[1400px] mx-auto px-8 h-[72px] flex items-center gap-10">
          {/* Logo */}
          <button
            onClick={() => setActiveSection('hero')}
            className="flex-shrink-0 focus:outline-none group"
            aria-label={t('header.aria.goHome')}
          >
            <img
              src="/logo-full.png"
              alt="Super Tucán"
              className="h-11 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                // Fallback: si /logo-full.png no existe usar /logo-white.png con filtro
                (e.currentTarget as HTMLImageElement).src = '/logo-white.png';
                (e.currentTarget as HTMLImageElement).style.filter = 'invert(1)';
              }}
            />
          </button>

          {/* Nav horizontal */}
          <nav
            className="flex items-stretch flex-1 self-stretch"
            aria-label={t('header.aria.mainNav')}
            onMouseLeave={() => setOpenMegaKey(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.key;
              const isMegaOpen = openMegaKey === item.key;
              const highlighted = isActive || isMegaOpen;
              return (
                <div
                  key={item.key}
                  className="relative h-full flex items-stretch"
                  onMouseEnter={item.hasMega ? () => setOpenMegaKey(item.key) : () => setOpenMegaKey(null)}
                >
                  <button
                    onClick={() => setActiveSection(item.key)}
                    className={`relative flex items-center px-6 text-[16px] font-bold tracking-[0.16em] font-accent transition-colors duration-200 hover:bg-[var(--color-primary)] hover:text-white ${
                      highlighted ? 'bg-[var(--color-primary)] text-white' : 'text-neutral-800'
                    }`}
                    aria-expanded={item.hasMega ? isMegaOpen : undefined}
                  >
                    {t(item.name)}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Right cluster: search + cotizar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-[var(--color-primary)] transition-colors"
              aria-label={t('header.aria.search')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>

            <button
              onClick={() => setIsQuoteSheetOpen(true)}
              className="ml-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-2.5 text-xs font-bold tracking-[0.18em] font-accent transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0% 100%)' }}
            >
              {t('header.cta.quote')}
            </button>
          </div>
        </div>

        {/* Mega menú: full-width debajo del nav */}
        {NAV_ITEMS.filter((i) => i.hasMega).map((item) => (
          <div
            key={item.key}
            className={`absolute left-0 right-0 top-full transition-all duration-300 ease-out ${
              openMegaKey === item.key
                ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                : 'opacity-0 invisible -translate-y-2 pointer-events-none'
            }`}
            onMouseEnter={() => setOpenMegaKey(item.key)}
            onMouseLeave={() => setOpenMegaKey(null)}
          >
            {item.key === 'modelos' && (
              <ModelosMegaMenu
                onCategoryClick={handleCategoryClick}
                onQuoteClick={() => setIsQuoteSheetOpen(true)}
              />
            )}
          </div>
        ))}
      </header>

      {/* ════════════════════════════════════════════════════════ */}
      {/* MOBILE HEADER                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="h-full flex items-center justify-between px-4">
          <button
            onClick={() => setActiveSection('hero')}
            className="focus:outline-none"
            aria-label={t('header.aria.goHome')}
          >
            <img
              src="/logo-full.png"
              alt="Super Tucán"
              className="h-9 w-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo-white.png';
                (e.currentTarget as HTMLImageElement).style.filter = 'invert(1)';
              }}
            />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700"
              aria-label={t('header.aria.search')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label={t('header.aria.openMenu')}
              aria-expanded={isMenuOpen}
              className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center"
            >
              <div className="flex flex-col gap-[5px]">
                <div className="w-[18px] h-[2px] bg-neutral-800 rounded-full" />
                <div className="w-[14px] h-[2px] bg-neutral-800 rounded-full" />
                <div className="w-[18px] h-[2px] bg-neutral-800 rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Spacers para empujar contenido bajo header fijo */}
      <div className="h-[112px] hidden lg:block" />
      <div className="h-16 lg:hidden" />

      {/* ════════════════════════════════════════════════════════ */}
      {/* OFFCANVAS MOBILE                                          */}
      {/* ════════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <img
                src="/logo-full.png"
                alt="Super Tucán"
                className="h-8 w-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-white.png';
                  (e.currentTarget as HTMLImageElement).style.filter = 'invert(1)';
                }}
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700"
                aria-label={t('header.aria.closeMenu')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="px-4 py-4" aria-label={t('header.aria.mobileNav')}>
              <div className="space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSection(item.key);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-4 rounded-lg text-[15px] font-bold tracking-[0.12em] font-accent transition-colors ${
                      activeSection === item.key
                        ? 'text-[var(--color-primary)] bg-red-50'
                        : 'text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{t(item.name)}</span>
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsQuoteSheetOpen(true);
                  setIsMenuOpen(false);
                }}
                className="mt-6 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-4 text-sm font-bold tracking-[0.2em] font-accent transition-colors"
                style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
              >
                {t('header.cta.quoteNow')}
              </button>

              <div className="mt-6 pt-6 border-t border-neutral-100">
                <p className="text-neutral-500 text-[10px] font-bold tracking-[0.25em] font-accent mb-3">{t('header.mobile.attention')}</p>
                <a href="tel:+18092468383" className="block text-neutral-900 font-bold text-xl hover:text-[var(--color-primary)] transition-colors">
                  +1 809 246 8383
                </a>
                <a href="tel:+18092466630" className="block text-neutral-900 font-bold text-xl hover:text-[var(--color-primary)] transition-colors mt-1">
                  +1 809 246 6630
                </a>
                <p className="text-neutral-500 text-xs mt-1">{t('header.mobile.phoneHours')}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-100">
                <LanguageSelector />
              </div>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex justify-center gap-3">
                {(
                  [
                    { name: 'facebook', url: 'https://facebook.com/supertucan' },
                    { name: 'instagram', url: 'https://instagram.com/supertucan' },
                    { name: 'youtube', url: 'https://youtube.com/@supertucan' },
                  ] as const
                ).map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[var(--color-primary)] hover:text-white text-neutral-700 flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <SocialIcon name={social.name} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* SEARCH OVERLAY                                            */}
      {/* ════════════════════════════════════════════════════════ */}
      {isSearchOpen && (
        <SearchOverlay onClose={() => setIsSearchOpen(false)} />
      )}

      <ModernQuoteSheet isOpen={isQuoteSheetOpen} onClose={() => setIsQuoteSheetOpen(false)} />
    </>
  );
}

/* ═════════════════════════════════════════════════════════ */

function LanguageSelector() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLanguage, setLanguage } = useCountryStore();
  const ref = useRef<HTMLDivElement>(null);

  const langs: Language[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ];
  const current = langs.find((l) => l.code === selectedLanguage?.code) || langs[0];

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] text-neutral-600 hover:text-[var(--color-primary)] transition-colors tracking-wide"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('header.aria.language')}
      >
        <span>{current.flag}</span>
        <span className="font-bold uppercase">{current.code}</span>
        <svg
          className={`w-2.5 h-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl overflow-hidden z-50 min-w-[150px]"
          role="listbox"
        >
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l);
                i18n.changeLanguage(l.code);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedLanguage?.code === l.code}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors ${
                selectedLanguage?.code === l.code
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-neutral-700 hover:bg-neutral-50'
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

function ModelosMegaMenu({
  onCategoryClick,
  onQuoteClick,
}: {
  onCategoryClick: (categoryId: string) => void;
  onQuoteClick: () => void;
}) {
  const { t } = useTranslation();
  const categories = [
    {
      id: 'motocicleta',
      name: 'header.mega.motocicleta.name',
      tagline: 'header.mega.motocicleta.tagline',
      image: '/bikes/ADRI SPORT/roja/main.avif',
    },
    {
      id: 'passola',
      name: 'header.mega.passola.name',
      tagline: 'header.mega.passola.tagline',
      image: '/bikes/BWS/azul/main.avif',
    },
    {
      id: 'sport',
      name: 'header.mega.sport.name',
      tagline: 'header.mega.sport.tagline',
      image: '/bikes/ST 125/rojo/main.avif',
    },
    {
      id: 'atv',
      name: 'header.mega.atv.name',
      tagline: 'header.mega.atv.tagline',
      image: null,
    },
  ];

  const featuredBikes = bikesData.slice(0, 4);

  return (
    <div className="relative bg-white border-t border-neutral-100 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      {/* Barra roja superior */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-primary)]" />

      <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-12 gap-8">
        {/* Columna izquierda: categorías */}
        <div className="col-span-7">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 font-accent">{t('header.mega.categoriesTitle')}</h3>
            <button
              onClick={() => onCategoryClick('all')}
              className="text-[11px] font-bold tracking-[0.15em] text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
            >
              {t('header.mega.viewAll')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className="group relative overflow-hidden rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 hover:border-[var(--color-primary)]/30 transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg bg-white border border-neutral-100 overflow-hidden flex items-center justify-center">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={t(cat.name)}
                        className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <svg className="w-7 h-7 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-neutral-900 tracking-[0.1em] font-accent group-hover:text-[var(--color-primary)] transition-colors">
                      {t(cat.name)}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">{t(cat.tagline)}</div>
                  </div>
                  <svg
                    className="w-4 h-4 text-neutral-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Columna derecha: modelos destacados */}
        <div className="col-span-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 font-accent">{t('header.mega.featuredTitle')}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featuredBikes.map((bike) => {
              const firstColor = bike.colors[0];
              return (
                <button
                  key={bike.id}
                  onClick={() => onCategoryClick(bike.category)}
                  className="group relative overflow-hidden rounded-lg border border-neutral-100 hover:border-[var(--color-primary)]/40 transition-all duration-300 text-left"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={firstColor.images.main}
                      alt={bike.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-3 py-2 border-t border-neutral-100">
                    <div className="text-xs font-bold text-neutral-900 tracking-[0.08em] font-accent group-hover:text-[var(--color-primary)] transition-colors">
                      {bike.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{bike.specs.engine}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA bar */}
          <button
            onClick={onQuoteClick}
            className="mt-4 w-full flex items-center justify-between bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-3 transition-colors duration-300"
            style={{ clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0% 100%)' }}
          >
            <div>
              <div className="text-[10px] tracking-[0.2em] opacity-80 font-accent">{t('header.mega.ctaEyebrow')}</div>
              <div className="text-sm font-bold tracking-[0.1em] font-accent">{t('header.mega.ctaTitle')}</div>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════ */

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = query
    ? bikesData.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()) || b.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-24 lg:pt-32">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('header.search.placeholder')}
            className="flex-1 text-base text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="text-[11px] font-bold tracking-[0.15em] font-accent text-neutral-500 hover:text-[var(--color-primary)] transition-colors"
          >
            {t('header.search.esc')}
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {query && filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-neutral-500">
              {t('header.search.noResults')} <span className="font-bold text-neutral-700">"{query}"</span>
            </div>
          )}
          {filtered.length > 0 && (
            <div className="p-2">
              {filtered.map((b) => (
                <a
                  key={b.id}
                  href={`/modelos/${b.slug}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden">
                    <img src={b.colors[0].images.main} alt={b.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900 font-accent tracking-wider">{b.name}</div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">{b.category} · {b.specs.engine}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
          {!query && (
            <div className="p-5">
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 mb-3 font-accent">{t('header.search.suggestions')}</p>
              <div className="flex flex-wrap gap-2">
                {['Adri Sport', 'BWS', 'CG200', 'ST 125', 'Repuestos', 'Cotizar'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[var(--color-primary)] hover:text-white text-xs text-neutral-700 font-bold tracking-wide transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════ */

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    facebook:
      'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    instagram:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    youtube:
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  };
  return paths[name] ? (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  ) : null;
}
