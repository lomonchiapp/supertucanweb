import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getBikeBySlug, bikesData } from '@/data/bikes';
import type { BikeColor, BikeModel, BikeCategory } from '@/types/bikes';
import { LazyImage } from './ui/lazy-image';
import { Header } from './Header';
import { Footer } from './Footer';
import { ModernQuoteSheet } from './ModernQuoteSheet';
import { FinancingDialog } from './FinancingDialog';

const SPEC_LABEL_KEYS: Record<string, string> = {
  engine: 'modelPage.specs.engine',
  maxSpeed: 'modelPage.specs.maxSpeed',
  power: 'modelPage.specs.power',
  fuelTank: 'modelPage.specs.fuelTank',
  weight: 'modelPage.specs.weight',
  brakeType: 'modelPage.specs.brakeType',
  transmission: 'modelPage.specs.transmission',
  startType: 'modelPage.specs.startType',
  wheelSize: 'modelPage.specs.wheelSize',
  seatHeight: 'modelPage.specs.seatHeight',
};

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  motocicleta: 'categories.motocicleta.name',
  passola: 'categories.passola.name',
  atv: 'categories.atv.name',
  sport: 'categories.sport.name',
};

// Convierte un doc de Firestore + sus colores a la forma BikeModel que espera la UI
async function loadBikeFromFirestore(slug: string): Promise<BikeModel | null> {
  const snapshot = await getDoc(doc(db, 'models', slug));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const colorsSnap = await getDocs(
    query(collection(db, 'models', slug, 'colors'), orderBy('order', 'asc'))
  );
  const colors: BikeColor[] = colorsSnap.docs.map((d) => {
    const c = d.data();
    return {
      name: c.name ?? '',
      value: c.value ?? d.id,
      hex: c.hex ?? '#6B7280',
      images: {
        main: c.images?.main ?? '',
        front: c.images?.front ?? c.images?.main ?? '',
        additional: Array.isArray(c.images?.additional) ? c.images.additional : [],
      },
    };
  });

  return {
    id: snapshot.id,
    name: data.name ?? snapshot.id,
    slug: data.slug ?? snapshot.id,
    category: (data.category ?? data.categoryId ?? 'motocicleta') as BikeCategory,
    featured: data.featured ?? false,
    description: data.description ?? '',
    specs: {
      engine: data.specs?.engine ?? '',
      maxSpeed: data.specs?.maxSpeed ?? '',
      power: data.specs?.power,
      fuelTank: data.specs?.fuelTank,
      weight: data.specs?.weight,
      brakeType: data.specs?.brakeType,
      transmission: data.specs?.transmission,
      startType: data.specs?.startType,
      wheelSize: data.specs?.wheelSize,
      seatHeight: data.specs?.seatHeight,
    },
    colors,
  };
}

/* ─────────────────────────────────────────────────────────── */

export default function ModelPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const staticBike = slug ? getBikeBySlug(slug) : undefined;
  const [dynamicBike, setDynamicBike] = useState<BikeModel | null>(null);
  const [loadingDynamic, setLoadingDynamic] = useState(!staticBike && !!slug);

  useEffect(() => {
    if (staticBike || !slug) return;
    let cancelled = false;
    setLoadingDynamic(true);
    loadBikeFromFirestore(slug)
      .then((b) => {
        if (!cancelled) setDynamicBike(b);
      })
      .catch(() => {
        if (!cancelled) setDynamicBike(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingDynamic(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, staticBike]);

  const bike = staticBike ?? dynamicBike ?? undefined;

  const [selectedColor, setSelectedColor] = useState(bike?.colors[0]?.value || '');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [financingOpen, setFinancingOpen] = useState(false);

  useEffect(() => {
    if (bike && !selectedColor) {
      setSelectedColor(bike.colors[0]?.value || '');
    }
  }, [bike, selectedColor]);

  if (loadingDynamic) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <h1 className="font-display text-7xl lg:text-9xl font-bold text-neutral-900 tracking-tight">
            {t('modelPage.notFound.title')}
          </h1>
          <p className="text-neutral-500 text-sm mt-4 font-accent tracking-[0.2em]">
            {t('modelPage.notFound.description')}
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-colors"
            style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
          >
            {t('modelPage.notFound.backHome')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ModelPageContent
      bike={bike}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
      quoteOpen={quoteOpen}
      setQuoteOpen={setQuoteOpen}
      financingOpen={financingOpen}
      setFinancingOpen={setFinancingOpen}
      t={t}
    />
  );
}

/* ─────────────────────────────────────────────────────────── */

function ModelPageContent({
  bike,
  selectedColor,
  setSelectedColor,
  quoteOpen,
  setQuoteOpen,
  financingOpen,
  setFinancingOpen,
  t,
}: {
  bike: BikeModel;
  selectedColor: string;
  setSelectedColor: (v: string) => void;
  quoteOpen: boolean;
  setQuoteOpen: (v: boolean) => void;
  financingOpen: boolean;
  setFinancingOpen: (v: boolean) => void;
  t: (k: string) => string;
}) {
  const currentColor = useMemo(
    () => bike.colors.find((c) => c.value === selectedColor) || bike.colors[0]!,
    [bike.colors, selectedColor]
  );
  const mainImage = currentColor?.images?.main || currentColor?.images?.front;
  const allImages = useMemo(
    () =>
      [currentColor.images.main, currentColor.images.front, ...currentColor.images.additional].filter(
        (img, idx, arr) => img && arr.indexOf(img) === idx
      ),
    [currentColor]
  );
  const relatedModels = useMemo(() => bikesData.filter((b) => b.id !== bike.id).slice(0, 3), [bike.id]);
  const specEntries = Object.entries(bike.specs).filter(
    ([, value]) => value !== undefined && value !== ''
  );
  const categoryLabel = CATEGORY_LABEL_KEYS[bike.category] ? t(CATEGORY_LABEL_KEYS[bike.category]) : bike.category.toUpperCase();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Helmet>
        <title>
          {bike.name} - {t('modelPage.meta.titleSuffix')}
        </title>
        <meta name="description" content={t(bike.description)} />
        <meta property="og:title" content={`${bike.name} - Super Tucán`} />
        <meta property="og:description" content={t(bike.description)} />
        <meta property="og:image" content={bike.colors[0]?.images.main} />
        <link rel="canonical" href={`https://supertucan.com/modelos/${bike.slug}`} />
      </Helmet>

      <Header />

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-50 pt-24 lg:pt-32 pb-12 lg:pb-20">
        {/* Diagonal pattern muy sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
          }}
        />
        {/* Red corner glow */}
        <div
          className="absolute top-0 right-0 w-2/3 h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 80% 30%, rgba(227,6,19,0.10), transparent 60%)',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 lg:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] font-accent text-neutral-500 hover:text-[var(--color-primary)] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t('modelPage.backToCatalog')}
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center">
            {/* Left: text content */}
            <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
                <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
                <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent uppercase">
                  {categoryLabel}
                </span>
                {bike.featured && (
                  <>
                    <div className="h-[2px] w-6 bg-neutral-300" />
                    <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 font-accent">
                      DESTACADO
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.85] tracking-tight text-neutral-900 uppercase mb-4">
                {bike.name}
              </h1>

              <p className="text-base lg:text-lg text-neutral-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
                {t(bike.description)}
              </p>

              {/* Quick specs row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0 mb-8">
                <div
                  className="p-3 sm:p-4 bg-white border border-neutral-100 shadow-sm"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)' }}
                >
                  <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] font-accent leading-none">
                    {bike.specs.engine}
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.18em] text-neutral-500 mt-1.5 font-accent">
                    {t('modelPage.quickSpecs.motor')}
                  </div>
                </div>
                <div
                  className="p-3 sm:p-4 bg-white border border-neutral-100 shadow-sm"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)' }}
                >
                  <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] font-accent leading-none">
                    {bike.specs.maxSpeed}
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.18em] text-neutral-500 mt-1.5 font-accent">
                    {t('modelPage.quickSpecs.maxSpeed')}
                  </div>
                </div>
                {bike.specs.power && (
                  <div
                    className="p-3 sm:p-4 bg-white border border-neutral-100 shadow-sm"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)' }}
                  >
                    <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] font-accent leading-none">
                      {bike.specs.power}
                    </div>
                    <div className="text-[9px] font-bold tracking-[0.18em] text-neutral-500 mt-1.5 font-accent">
                      {t('modelPage.quickSpecs.power')}
                    </div>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="group inline-flex items-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-4 text-[12px] font-bold tracking-[0.18em] font-accent transition-all duration-300 shadow-lg shadow-red-500/10 hover:shadow-red-500/30"
                  style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
                >
                  {t('modelPage.cta.quote')}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setFinancingOpen(true)}
                  className="inline-flex items-center gap-3 border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 px-7 py-3.5 text-[12px] font-bold tracking-[0.18em] font-accent transition-all duration-300"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}
                >
                  {t('modelPage.cta.whereToBuy')}
                </button>
              </div>
            </div>

            {/* Right: bike showcase */}
            <div className="relative order-1 lg:order-2 min-h-[320px] sm:min-h-[440px] lg:min-h-[560px] flex items-center justify-center overflow-hidden">
              {/* Speed lines detrás de la moto */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {[
                  { top: '22%', delay: '0s', duration: '2.4s', width: '60%' },
                  { top: '38%', delay: '0.5s', duration: '2.8s', width: '50%' },
                  { top: '52%', delay: '0.2s', duration: '2.2s', width: '70%' },
                  { top: '66%', delay: '1s', duration: '3s', width: '55%' },
                  { top: '78%', delay: '0.4s', duration: '2.6s', width: '45%' },
                ].map((line, i) => (
                  <span
                    key={i}
                    className="absolute h-px"
                    style={{
                      top: line.top,
                      width: line.width,
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(227,6,19,0.55) 50%, transparent 100%)',
                      animation: `mpSpeedStreak ${line.duration} linear ${line.delay} infinite`,
                      opacity: 0.22,
                    }}
                  />
                ))}
              </div>

              {/* Huge background letters with bike name initials */}
              <span
                className="absolute -top-6 right-4 lg:right-12 font-display font-bold leading-none text-neutral-100 select-none pointer-events-none uppercase whitespace-nowrap"
                style={{ fontSize: 'clamp(8rem, 22vw, 22rem)' }}
                aria-hidden="true"
              >
                {bike.name.split(' ')[0]}
              </span>

              {/* Soft radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 65% 50% at 50% 55%, rgba(227,6,19,0.08), transparent 70%)',
                }}
              />

              {/* Bike image — contenedor con aspect ratio + object-contain garantiza imagen completa */}
              <div className="relative z-10 w-full aspect-[4/3] flex items-center justify-center px-4 lg:px-8">
                {mainImage && (
                  <LazyImage
                    key={`${bike.id}-${currentColor.value}`}
                    src={mainImage}
                    alt={`${bike.name} ${currentColor.name}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{
                      filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.18))',
                      animation: 'mpBikeIn 0.6s ease-out, mpBikeFloat 4s ease-in-out 0.6s infinite',
                    }}
                  />
                )}
              </div>

              {/* Ground shadow */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.18), transparent 70%)',
                  filter: 'blur(8px)',
                  animation: 'mpReflectPulse 4s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes mpSpeedStreak {
            0% { transform: translateX(110%); opacity: 0; }
            15% { opacity: 0.22; }
            85% { opacity: 0.22; }
            100% { transform: translateX(-130%); opacity: 0; }
          }
          @keyframes mpBikeIn {
            from { transform: translateX(40px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes mpBikeFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes mpReflectPulse {
            0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
            50% { transform: translateX(-50%) scaleX(0.9); opacity: 0.8; }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="mpSpeedStreak"], [style*="mpBikeFloat"], [style*="mpReflectPulse"] {
              animation: none !important;
            }
          }
        `}</style>
      </section>

      {/* ════════════════ COLOR SELECTOR ════════════════ */}
      {bike.colors.length > 0 && (
        <section className="bg-neutral-50 border-y border-neutral-100">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-6 lg:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-6 bg-[var(--color-primary)]" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                  {t('modelPage.colorSelector')}
                </span>
                <span className="text-sm text-neutral-700 font-bold ml-2 uppercase tracking-wide">
                  {currentColor.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                {bike.colors.map((color) => {
                  const active = selectedColor === color.value;
                  return (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`group flex items-center gap-2 px-3 py-2 border-2 transition-all ${
                        active
                          ? 'border-[var(--color-primary)] bg-white shadow-md'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                      aria-label={color.name}
                    >
                      <span
                        className="w-5 h-5 rounded-full ring-1 ring-neutral-200 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span
                        className={`text-[10px] font-bold tracking-[0.18em] font-accent uppercase ${
                          active ? 'text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ SPECS BAND ════════════════ */}
      <section className="relative bg-neutral-950 text-white py-16 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(255,255,255,0.5) 14px, rgba(255,255,255,0.5) 15px)',
          }}
        />
        <div
          className="absolute top-0 left-0 w-1/2 h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(227,6,19,0.18), transparent 60%)',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
              FICHA TÉCNICA
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-10">
            {t('modelPage.specsTitle')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {specEntries.map(([key, value]) => (
              <div
                key={key}
                className="relative p-4 lg:p-5 bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-[var(--color-primary)]/50 transition-colors group"
                style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)' }}
              >
                <div className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] font-accent leading-none">
                  {value}
                </div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mt-2 font-accent uppercase">
                  {SPEC_LABEL_KEYS[key] ? t(SPEC_LABEL_KEYS[key]) : key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ GALLERY ════════════════ */}
      {allImages.length > 1 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
                  <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                    SHOWROOM
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight uppercase leading-[0.95]">
                  {t('modelPage.galleryTitle')}
                </h2>
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 font-accent">
                {String(allImages.length).padStart(2, '0')} IMÁGENES · {currentColor.name.toUpperCase()}
              </span>
            </div>

            <BentoGallery images={allImages} alt={`${bike.name} ${currentColor.name}`} />
          </div>
        </section>
      )}

      {/* ════════════════ RELATED ════════════════ */}
      {relatedModels.length > 0 && (
        <section className="bg-neutral-50 border-t border-neutral-100 py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                CATÁLOGO
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight uppercase leading-[0.95] mb-10">
              {t('modelPage.related.title')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              {relatedModels.map((related) => {
                const relatedImage = related.colors[0]?.images?.main || related.colors[0]?.images?.front;
                return (
                  <Link
                    key={related.id}
                    to={`/modelos/${related.slug}`}
                    className="group block bg-white border border-neutral-100 overflow-hidden hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-neutral-900/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center overflow-hidden p-4">
                      {relatedImage && (
                        <LazyImage
                          src={relatedImage}
                          alt={related.name}
                          className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                          style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))' }}
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-2xl font-bold text-neutral-900 tracking-tight uppercase leading-none">
                        {related.name}
                      </h3>
                      <p className="text-neutral-500 text-xs mt-2 line-clamp-1">{t(related.description)}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-neutral-500 font-accent">
                          {related.specs.engine} · {related.specs.maxSpeed}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] font-accent text-[var(--color-primary)] group-hover:gap-2 transition-all">
                          {t('modelPage.related.viewDetails')}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ STICKY MOBILE CTA ════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-primary)] font-accent uppercase">
              {bike.name}
            </div>
            <div className="text-xs text-neutral-600 truncate">
              {currentColor.name} · {bike.specs.engine}
            </div>
          </div>
          <button
            onClick={() => setQuoteOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-3 text-[11px] font-bold tracking-[0.18em] font-accent transition-colors"
            style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
          >
            {t('modelPage.cta.quote')}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Spacer para que el sticky no tape contenido */}
      <div className="lg:hidden h-20" />

      <Footer />

      <ModernQuoteSheet
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        prefilledBike={bike}
        prefilledColor={currentColor}
      />
      <FinancingDialog isOpen={financingOpen} onClose={() => setFinancingOpen(false)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* BENTO GALLERY — layout asimétrico que no aburre              */
/* ─────────────────────────────────────────────────────────── */

function BentoGallery({ images, alt }: { images: string[]; alt: string }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Layout: 1 grande + grilla para el resto. Solo mobile = 1 col simple.
  const [hero, ...rest] = images;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3 lg:gap-4">
        {/* Hero image */}
        <button
          onClick={() => setLightbox(hero)}
          className="group relative aspect-[16/10] lg:aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden border border-neutral-100 hover:border-[var(--color-primary)]/40 transition-colors"
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8">
            <LazyImage
              src={hero}
              alt={`${alt} 1`}
              className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </button>

        {/* Rest in 2-col grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3 lg:gap-4 lg:content-start">
            {rest.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(img)}
                className="group relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden border border-neutral-100 hover:border-[var(--color-primary)]/40 transition-colors"
              >
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <LazyImage
                    src={img}
                    alt={`${alt} ${i + 2}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resto de imágenes si hay más de 5 */}
      {rest.length > 4 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mt-3 lg:mt-4">
          {rest.slice(4).map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(img)}
              className="group relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden border border-neutral-100 hover:border-[var(--color-primary)]/40 transition-colors"
            >
              <div className="absolute inset-0 flex items-center justify-center p-3">
                <LazyImage
                  src={img}
                  alt={`${alt} ${i + 6}`}
                  className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox simple */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 lg:p-12 animate-[mpLightboxIn_0.2s_ease-out]"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 lg:top-6 lg:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightbox}
            alt={alt}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @keyframes mpLightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
