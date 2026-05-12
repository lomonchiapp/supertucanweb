import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bikesData } from '@/data/bikes';
import { useNavigationStore } from '@/store/navigationStore';
import { ModernQuoteSheet } from './ModernQuoteSheet';
import { usePublishedNews } from '@/admin/hooks/useNews';
import type { BikeModel, BikeColor } from '@/types/bikes';

/* ─────────────────────────────────────────────────────────── */
/* CONFIG                                                      */
/* ─────────────────────────────────────────────────────────── */

const HERO_SLIDES = [
  {
    id: 'adri-sport-roja',
    eyebrow: 'home.hero.adriSport.eyebrow',
    title: 'ADRI SPORT',
    subtitle: 'home.hero.adriSport.subtitle',
    description: 'home.hero.adriSport.description',
    image: '/bikes/ADRI SPORT/roja/main.avif',
    bikeId: 'adri-sport',
    color: 'roja',
    cta: 'home.hero.adriSport.cta',
    accent: '#e30613',
  },
  {
    id: 'cg200-rojo',
    eyebrow: 'home.hero.cg200.eyebrow',
    title: 'CG 200',
    subtitle: 'home.hero.cg200.subtitle',
    description: 'home.hero.cg200.description',
    image: '/bikes/CG200/rojo/main.avif',
    bikeId: 'cg200',
    color: 'rojo',
    cta: 'home.hero.cg200.cta',
    accent: '#b8050f',
  },
  {
    id: 'bws-azul',
    eyebrow: 'home.hero.bws.eyebrow',
    title: 'BWS',
    subtitle: 'home.hero.bws.subtitle',
    description: 'home.hero.bws.description',
    image: '/bikes/BWS/azul/main.avif',
    bikeId: 'bws',
    color: 'azul',
    cta: 'home.hero.bws.cta',
    accent: '#1a1a1a',
  },
];

const CATEGORIES = [
  {
    id: 'motocicleta',
    name: 'home.categoryGrid.items.motocicleta.name',
    description: 'home.categoryGrid.items.motocicleta.description',
    image: '/bikes/ADRI SPORT/negra/main.avif',
    count: bikesData.filter((b) => b.category === 'motocicleta').length,
  },
  {
    id: 'passola',
    name: 'home.categoryGrid.items.passola.name',
    description: 'home.categoryGrid.items.passola.description',
    image: '/bikes/BWS/blanco/main.avif',
    count: bikesData.filter((b) => b.category === 'passola').length,
  },
  {
    id: 'sport',
    name: 'home.categoryGrid.items.sport.name',
    description: 'home.categoryGrid.items.sport.description',
    image: '/bikes/ST 125/rojo/main.avif',
    count: bikesData.filter((b) => b.category === 'sport').length,
  },
  {
    id: 'atv',
    name: 'home.categoryGrid.items.atv.name',
    description: 'home.categoryGrid.items.atv.description',
    image: null,
    count: 0,
  },
];

/* ─────────────────────────────────────────────────────────── */
/* MAIN                                                        */
/* ─────────────────────────────────────────────────────────── */

export function HomePage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteBike, setQuoteBike] = useState<BikeModel | undefined>();
  const [quoteColor, setQuoteColor] = useState<BikeColor | undefined>();

  const openQuote = (bike?: BikeModel, color?: BikeColor) => {
    setQuoteBike(bike);
    setQuoteColor(color);
    setIsQuoteOpen(true);
  };

  return (
    <div className="bg-white text-neutral-900">
      <HeroCarousel onQuote={() => openQuote()} />
      <CategoryGrid />
      <FeaturedModel onQuote={openQuote} />
      <ServicesBanner />
      <NewsSection />
      <QuickStats />

      <ModernQuoteSheet
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        prefilledBike={quoteBike}
        prefilledColor={quoteColor}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* HERO CAROUSEL                                               */
/* ─────────────────────────────────────────────────────────── */

function HeroCarousel({ onQuote }: { onQuote: () => void }) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused]);

  const slide = HERO_SLIDES[idx];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={t('home.hero.aria')}
    >
      {/* Diagonal accent shapes */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, transparent 30%, rgba(227,6,19,0.04) 50%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 min-h-[540px] lg:min-h-[640px] grid lg:grid-cols-2 items-center gap-8 py-12 lg:py-16">
        {/* Left: text */}
        <div key={`text-${slide.id}`} className="relative z-10 animate-slide-in-up text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
              {t(slide.eyebrow)}
            </span>
          </div>
          <h1
            className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-tight text-neutral-900 uppercase mb-3"
          >
            {slide.title}
          </h1>
          <h2 className="text-lg lg:text-xl font-bold tracking-[0.05em] text-neutral-700 uppercase mb-5">
            {t(slide.subtitle)}
          </h2>
          <p className="text-sm lg:text-base text-neutral-600 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
            {t(slide.description)}
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a
              href={`/modelos/${slide.bikeId}`}
              className="group inline-flex items-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-4 text-[12px] font-bold tracking-[0.18em] font-accent transition-all duration-300 shadow-lg shadow-red-500/10 hover:shadow-red-500/30"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              {t(slide.cta)}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <button
              onClick={onQuote}
              className="inline-flex items-center gap-3 border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] font-accent transition-all duration-300"
              style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}
            >
              {t('home.hero.quoteNow')}
            </button>
          </div>
        </div>

        {/* Right: bike image */}
        <div className="relative flex items-center justify-center min-h-[300px] lg:min-h-[480px] overflow-hidden">
          {/* Soft radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% 55%, rgba(227,6,19,0.08), transparent 70%)',
            }}
          />

          {/* Speed lines — streak desde la derecha hacia la izquierda detrás de la moto */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {[
              { top: '24%', delay: '0s', duration: '2.4s', width: '60%', opacity: 0.22 },
              { top: '36%', delay: '0.6s', duration: '2.8s', width: '50%', opacity: 0.18 },
              { top: '48%', delay: '0.2s', duration: '2.2s', width: '70%', opacity: 0.28 },
              { top: '60%', delay: '1.1s', duration: '3s', width: '55%', opacity: 0.2 },
              { top: '72%', delay: '0.4s', duration: '2.6s', width: '45%', opacity: 0.15 },
            ].map((line, i) => (
              <span
                key={i}
                className="absolute h-px"
                style={{
                  top: line.top,
                  width: line.width,
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(227,6,19,0.6) 50%, transparent 100%)',
                  opacity: line.opacity,
                  animation: `speedStreak ${line.duration} linear ${line.delay} infinite`,
                }}
              />
            ))}
          </div>

          {/* Huge background number */}
          <span
            className="absolute -top-4 right-0 lg:right-8 font-display font-bold text-[12rem] lg:text-[20rem] leading-none text-neutral-100 select-none pointer-events-none"
            aria-hidden="true"
          >
            0{idx + 1}
          </span>

          {/* Bike — con micro-oscilación (idle breathing) */}
          <img
            key={`bike-${slide.id}`}
            src={slide.image}
            alt={slide.title}
            className="relative z-10 max-w-[90%] max-h-[420px] lg:max-h-[520px] object-contain drop-shadow-2xl animate-slide-in-right"
            style={{ animation: 'slide-in-right 0.7s ease-out, bikeFloat 4s ease-in-out 0.7s infinite' }}
          />

          {/* Ground reflection con leve pulso */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.12), transparent 70%)',
              filter: 'blur(6px)',
              animation: 'reflectPulse 4s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Bottom: pagination + controls */}
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 pb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={`group relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${
                i === idx ? 'w-16 bg-neutral-200' : 'w-8 bg-neutral-200 hover:bg-neutral-300'
              }`}
              aria-label={t('home.hero.goToSlide', { n: i + 1 })}
            >
              {i === idx && !paused && (
                <span
                  className="absolute inset-y-0 left-0 bg-[var(--color-primary)]"
                  style={{ animation: 'progressBar 6.5s linear forwards' }}
                />
              )}
              {i === idx && paused && <span className="absolute inset-y-0 left-0 right-0 bg-[var(--color-primary)]" />}
            </button>
          ))}
          <span className="ml-3 text-xs text-neutral-500 font-bold tracking-[0.2em] font-accent">
            {String(idx + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="w-11 h-11 rounded-full border border-neutral-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-neutral-700 flex items-center justify-center transition-all duration-300"
            aria-label={t('home.hero.prev')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % HERO_SLIDES.length)}
            className="w-11 h-11 rounded-full border border-neutral-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-neutral-700 flex items-center justify-center transition-all duration-300"
            aria-label={t('home.hero.next')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
        @keyframes speedStreak {
          0% { transform: translateX(110%); opacity: 0; }
          15% { opacity: var(--speed-op, 0.25); }
          85% { opacity: var(--speed-op, 0.25); }
          100% { transform: translateX(-130%); opacity: 0; }
        }
        @keyframes bikeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes reflectPulse {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
          50% { transform: translateX(-50%) scaleX(0.92); opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .relative img[alt][src*="/bikes/"],
          .relative div[style*="reflectPulse"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* CATEGORY GRID                                               */
/* ─────────────────────────────────────────────────────────── */

function CategoryGrid() {
  const { t } = useTranslation();
  const { setActiveSection, setSelectedCategory } = useNavigationStore();

  const goToCategory = (id: string) => {
    setSelectedCategory(id);
    setActiveSection('modelos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('home.categoryGrid.eyebrow')}
          title={t('home.categoryGrid.title')}
          description={t('home.categoryGrid.description')}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12">
          {CATEGORIES.map((cat, i) => {
            const disabled = cat.count === 0;
            return (
              <button
                key={cat.id}
                onClick={() => !disabled && goToCategory(cat.id)}
                disabled={disabled}
                className={`group relative aspect-[3/4] overflow-hidden bg-neutral-50 border border-neutral-100 transition-all duration-500 text-left animate-slide-in-up ${
                  disabled ? 'cursor-not-allowed opacity-70' : 'hover:border-[var(--color-primary)] hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Background image */}
                {cat.image ? (
                  <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8">
                    <img
                      src={cat.image}
                      alt={t(cat.name)}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-300">
                    <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-bold tracking-[0.3em] font-accent">{t('home.categoryGrid.comingSoon')}</span>
                  </div>
                )}

                {/* Diagonal hover accent */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 50%)',
                    clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                  }}
                />

                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-white via-white/90 to-transparent">
                  <div className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] mb-1 font-accent">
                    {disabled ? t('home.categoryGrid.comingLabel') : `${cat.count} ${cat.count > 1 ? t('home.categoryGrid.modelsSuffixPlural') : t('home.categoryGrid.modelsSuffix')}`}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold tracking-[0.05em] text-neutral-900 font-display uppercase mb-1">
                    {t(cat.name)}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-snug">{t(cat.description)}</p>

                  {!disabled && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-neutral-900 group-hover:text-[var(--color-primary)] font-accent transition-colors">
                      {t('home.categoryGrid.explore')}
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* FEATURED MODEL                                              */
/* ─────────────────────────────────────────────────────────── */

function FeaturedModel({ onQuote }: { onQuote: (bike?: BikeModel, color?: BikeColor) => void }) {
  const { t } = useTranslation();
  // Use ADRI SPORT en roja como destacado
  const bike = bikesData.find((b) => b.id === 'adri-sport') || bikesData[0];
  const color = bike.colors.find((c) => c.value === 'roja') || bike.colors[0];

  const features = [
    { label: t('home.featured.specs.engine'), value: bike.specs.engine },
    { label: t('home.featured.specs.power'), value: bike.specs.power },
    { label: t('home.featured.specs.maxSpeed'), value: bike.specs.maxSpeed },
    { label: t('home.featured.specs.transmission'), value: bike.specs.transmission },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-neutral-900 text-white overflow-hidden">
      {/* Decorative diagonal lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent, transparent 16px, rgba(255,255,255,0.5) 16px, rgba(255,255,255,0.5) 17px)',
        }}
      />
      {/* Red accent corner */}
      <div
        className="absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(227,6,19,0.18), transparent 60%)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
              {t('home.featured.eyebrow')}
            </span>
          </div>

          <h2 className="font-display text-6xl lg:text-8xl font-bold leading-[0.9] tracking-tight uppercase mb-3">
            {bike.name}
          </h2>
          <p className="text-base lg:text-lg text-neutral-300 leading-relaxed max-w-lg mb-8">
            {t(bike.description)}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mb-8">
            {features.map((f) => (
              <div
                key={f.label}
                className="p-4 bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-[var(--color-primary)]/40 transition-colors"
                style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)' }}
              >
                <div className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] font-accent">
                  {f.value}
                </div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mt-1 font-accent">
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/modelos/${bike.slug}`}
              className="group inline-flex items-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white px-8 py-4 text-[12px] font-bold tracking-[0.18em] font-accent transition-all duration-300"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              {t('home.featured.ctaSpecs')}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <button
              onClick={() => onQuote(bike, color)}
              className="inline-flex items-center gap-3 border border-white/30 hover:border-white hover:bg-white hover:text-neutral-900 text-white px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] font-accent transition-all duration-300"
              style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}
            >
              {t('home.featured.ctaQuote')}
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex items-center justify-center min-h-[320px] lg:min-h-[500px]">
          <span
            className="absolute font-display font-bold text-[14rem] lg:text-[22rem] leading-none text-white/[0.04] select-none pointer-events-none"
            aria-hidden="true"
          >
            01
          </span>
          <img
            src={color.images.main}
            alt={`${bike.name} ${color.name}`}
            className="relative z-10 max-w-[95%] max-h-[480px] object-contain drop-shadow-[0_20px_40px_rgba(227,6,19,0.25)]"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* SERVICES BANNER                                             */
/* ─────────────────────────────────────────────────────────── */

function ServicesBanner() {
  const { t } = useTranslation();
  const { setActiveSection } = useNavigationStore();

  const services = [
    {
      id: 'dealers',
      title: t('home.services.dealers.title'),
      description: t('home.services.dealers.description'),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      action: () => setActiveSection('dealers'),
    },
    {
      id: 'partes',
      title: t('home.services.parts.title'),
      description: t('home.services.parts.description'),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      action: () => setActiveSection('partes'),
    },
    {
      id: 'service',
      title: t('home.services.maintenance.title'),
      description: t('home.services.maintenance.description'),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.045 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      action: () => setActiveSection('partes'),
    },
    {
      id: 'finance',
      title: t('home.services.financing.title'),
      description: t('home.services.financing.description'),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
        </svg>
      ),
      action: () => {},
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('home.services.eyebrow')}
          title={t('home.services.title')}
          description={t('home.services.description')}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12">
          {services.map((s, i) => (
            <button
              key={s.id}
              onClick={s.action}
              className="group relative bg-neutral-50 hover:bg-white border border-neutral-100 hover:border-[var(--color-primary)] p-6 lg:p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10 animate-slide-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Diagonal corner accent on hover */}
              <div
                className="absolute top-0 right-0 w-12 h-12 bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
              />

              <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white flex items-center justify-center mb-5 text-neutral-700 transition-colors">
                {s.icon}
              </div>
              <h3 className="text-base lg:text-lg font-bold tracking-[0.05em] text-neutral-900 mb-2 font-accent uppercase">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{s.description}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-neutral-900 group-hover:text-[var(--color-primary)] font-accent transition-colors">
                {t('home.services.learnMore')}
                <svg
                  className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* NEWS SECTION                                                */
/* ─────────────────────────────────────────────────────────── */

function NewsSection() {
  const { t, i18n } = useTranslation();
  const { setActiveSection } = useNavigationStore();
  const { news, loading } = usePublishedNews(3);

  // No mostrar la sección si no hay noticias publicadas y no estamos cargando
  if (!loading && news.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow={t('home.news.eyebrow')}
            title={t('home.news.title')}
            description={t('home.news.description')}
            align="left"
            embedded
          />
          <button
            onClick={() => setActiveSection('noticias')}
            className="self-start lg:self-end inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-neutral-900 hover:text-[var(--color-primary)] font-accent transition-colors"
          >
            {t('home.news.viewAll')}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-neutral-100 h-80 animate-pulse" />
              ))
            : news.map((n, i) => (
                <Link
                  key={n.id}
                  to={`/noticias/${n.slug}`}
                  className="group bg-white border border-neutral-100 overflow-hidden hover:border-[var(--color-primary)]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10 animate-slide-in-up block"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    {n.image && (
                      <img
                        src={n.image}
                        alt={n.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-[10px] font-bold tracking-[0.2em] px-3 py-1.5 font-accent uppercase">
                      {n.tag}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-3 font-accent">
                      {n.publishedAt
                        ? n.publishedAt
                            .toDate()
                            .toLocaleDateString(i18n.language, {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                            .toUpperCase()
                        : ''}
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-neutral-900 mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">{n.excerpt}</p>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-neutral-900 group-hover:text-[var(--color-primary)] font-accent transition-colors">
                      {t('home.news.readMore')}
                      <svg
                        className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* QUICK STATS / TRUST BAR                                     */
/* ─────────────────────────────────────────────────────────── */

function QuickStats() {
  const { t } = useTranslation();
  const stats = [
    { value: '15+', label: t('home.stats.years') },
    { value: '50K+', label: t('home.stats.customers') },
    { value: '120+', label: t('home.stats.service') },
    { value: '4', label: t('home.stats.models') },
  ];

  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 text-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center animate-slide-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="font-display text-5xl lg:text-6xl font-bold leading-none mb-2 text-white">
              <span className="text-[var(--color-primary)]">{s.value.charAt(0)}</span>
              {s.value.slice(1)}
            </div>
            <div className="text-[10px] lg:text-xs font-bold tracking-[0.25em] text-neutral-400 font-accent">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* SECTION HEADER (reusable)                                   */
/* ─────────────────────────────────────────────────────────── */

function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  embedded = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  embedded?: boolean;
}) {
  return (
    <div className={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-2xl ${embedded ? '' : ''}`}>
      <div className={`flex items-center gap-3 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
        <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
          {eyebrow}
        </span>
        <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
      </div>
      <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 uppercase leading-[0.95] mb-3">
        {title}
      </h2>
      {description && <p className="text-base text-neutral-600 leading-relaxed">{description}</p>}
    </div>
  );
}
