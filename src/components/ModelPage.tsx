import { useEffect, useState } from 'react';
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

// Convierte un doc de Firestore + sus colores a la forma BikeModel que espera la UI
async function loadBikeFromFirestore(slug: string): Promise<BikeModel | null> {
  // Los modelos se guardan con el slug como doc ID (ver seed-firebase.ts)
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

export default function ModelPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  // Lookup en data estática primero
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

  useEffect(() => {
    if (bike && !selectedColor) {
      setSelectedColor(bike.colors[0]?.value || '');
    }
  }, [bike, selectedColor]);

  if (loadingDynamic) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-6xl font-bold text-white tracking-tight">{t('modelPage.notFound.title')}</h1>
          <p className="text-gray-500 text-sm font-sans mt-4">
            {t('modelPage.notFound.description')}
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-red-600 hover:bg-red-500 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-colors"
          >
            {t('modelPage.notFound.backHome')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentColor = bike.colors.find((c) => c.value === selectedColor) || bike.colors[0]!;
  const mainImage = currentColor?.images?.main || currentColor?.images?.front;
  const allImages = [
    currentColor.images.main,
    currentColor.images.front,
    ...currentColor.images.additional,
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const relatedModels = bikesData.filter((b) => b.id !== bike.id).slice(0, 3);

  const specEntries = Object.entries(bike.specs).filter(
    ([, value]) => value !== undefined && value !== ''
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Helmet>
        <title>{bike.name} - {t('modelPage.meta.titleSuffix')}</title>
        <meta name="description" content={t(bike.description)} />
        <meta property="og:title" content={`${bike.name} - Super Tucán`} />
        <meta property="og:description" content={t(bike.description)} />
        <meta property="og:image" content={bike.colors[0]?.images.main} />
        <link rel="canonical" href={`https://supertucan.com/modelos/${bike.slug}`} />
      </Helmet>

      <Header />

      {/* ══════════ Hero ══════════ */}
      <section className="relative w-full bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(220,38,38,0.06) 0%, transparent 70%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Image */}
          <div className="relative flex-1 flex items-center justify-center min-h-[300px] md:min-h-[420px]">
            {mainImage && (
              <LazyImage
                src={mainImage}
                alt={`${bike.name} ${currentColor.name}`}
                className="w-full h-full max-h-[420px] object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.5))' }}
              />
            )}
          </div>
          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-accent tracking-[0.15em] transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('modelPage.backToCatalog')}
            </Link>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight uppercase leading-none">
              {bike.name}
            </h1>
            <p className="text-gray-400 text-sm font-sans mt-4 max-w-md leading-relaxed">
              {t(bike.description)}
            </p>
            {/* Quick specs */}
            <div className="flex gap-4 mt-8 justify-center md:justify-start">
              <div className="bg-white/[0.04] border border-white/10 rounded-lg px-5 py-3 text-center">
                <div className="font-accent text-xl font-bold text-red-500">{bike.specs.engine}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-1">{t('modelPage.quickSpecs.motor')}</div>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-lg px-5 py-3 text-center">
                <div className="font-accent text-xl font-bold text-red-500">{bike.specs.maxSpeed}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-1">{t('modelPage.quickSpecs.maxSpeed')}</div>
              </div>
              {bike.specs.power && (
                <div className="bg-white/[0.04] border border-white/10 rounded-lg px-5 py-3 text-center">
                  <div className="font-accent text-xl font-bold text-red-500">{bike.specs.power}</div>
                  <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-1">{t('modelPage.quickSpecs.power')}</div>
                </div>
              )}
            </div>
            {/* CTA */}
            <div className="flex gap-3 mt-8 justify-center md:justify-start">
              <button
                onClick={() => setQuoteOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 text-[10px] font-bold tracking-[0.2em] font-accent transition-colors"
                style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
              >
                {t('modelPage.cta.quote')}
              </button>
              <Link
                to="/"
                className="px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all text-[10px] font-bold tracking-[0.2em] font-accent"
                style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 100%, 0% 100%)' }}
              >
                {t('modelPage.cta.whereToBuy')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ Color Selector ══════════ */}
      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-[10px] text-white/30 font-accent tracking-[0.2em]">
            {t('modelPage.colorSelector')}
          </span>
          <div className="flex gap-3">
            {bike.colors.map((color: BikeColor) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedColor === color.value
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: color.hex }}
                />
                <span className={`text-xs font-sans ${
                  selectedColor === color.value ? 'text-white' : 'text-white/40'
                }`}>
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ Spec Sheet ══════════ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-white tracking-tight uppercase mb-8">
          {t('modelPage.specsTitle')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {specEntries.map(([key, value]) => (
            <div
              key={key}
              className="bg-white/[0.03] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"
            >
              <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mb-2">
                {SPEC_LABEL_KEYS[key] ? t(SPEC_LABEL_KEYS[key]) : key.toUpperCase()}
              </div>
              <div className="font-accent text-lg font-bold text-white">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ Image Gallery ══════════ */}
      {allImages.length > 1 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="font-display text-3xl font-bold text-white tracking-tight uppercase mb-8">
            {t('modelPage.galleryTitle')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] bg-black/30 border border-white/5 rounded-lg overflow-hidden group"
              >
                <LazyImage
                  src={img}
                  alt={`${bike.name} ${currentColor.name} - ${idx + 1}`}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ Related Models ══════════ */}
      {relatedModels.length > 0 && (
        <section className="border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="font-display text-3xl font-bold text-white tracking-tight uppercase mb-8">
              {t('modelPage.related.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedModels.map((related) => {
                const relatedImage = related.colors[0]?.images?.main || related.colors[0]?.images?.front;
                return (
                  <Link
                    key={related.id}
                    to={`/modelos/${related.slug}`}
                    className="group block rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all overflow-hidden"
                  >
                    <div className="relative h-48 flex items-center justify-center bg-black/20">
                      {relatedImage && (
                        <LazyImage
                          src={relatedImage}
                          alt={related.name}
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-xl font-bold text-white tracking-tight uppercase">
                        {related.name}
                      </h3>
                      <p className="text-gray-500 text-xs font-sans mt-1 line-clamp-1">
                        {t(related.description)}
                      </p>
                      <span className="inline-block mt-3 text-red-500 text-[10px] font-bold tracking-[0.2em] font-accent group-hover:text-red-400 transition-colors">
                        {t('modelPage.related.viewDetails')}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <ModernQuoteSheet
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        prefilledBike={bike}
        prefilledColor={currentColor}
      />
    </div>
  );
}
