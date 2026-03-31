import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBikeBySlug, bikesData } from '@/data/bikes';
import type { BikeColor } from '@/types/bikes';
import { LazyImage } from './ui/lazy-image';
import { Header } from './Header';
import { Footer } from './Footer';
import { ModernQuoteSheet } from './ModernQuoteSheet';

const SPEC_LABELS: Record<string, string> = {
  engine: 'Motor',
  maxSpeed: 'Velocidad Máxima',
  power: 'Potencia',
  fuelTank: 'Tanque',
  weight: 'Peso',
  brakeType: 'Frenos',
  transmission: 'Transmisión',
  startType: 'Arranque',
  wheelSize: 'Rueda',
  seatHeight: 'Altura Asiento',
};

export default function ModelPage() {
  const { slug } = useParams<{ slug: string }>();
  const bike = slug ? getBikeBySlug(slug) : undefined;

  const [selectedColor, setSelectedColor] = useState(bike?.colors[0]?.value || '');
  const [quoteOpen, setQuoteOpen] = useState(false);

  if (!bike) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-6xl font-bold text-white tracking-tight">404</h1>
          <p className="text-gray-500 text-sm font-sans mt-4">
            Modelo no encontrado
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-red-600 hover:bg-red-500 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-colors"
          >
            VOLVER AL INICIO
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
        <title>{bike.name} - Super Tucán Motocicletas</title>
        <meta name="description" content={bike.description} />
        <meta property="og:title" content={`${bike.name} - Super Tucán`} />
        <meta property="og:description" content={bike.description} />
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
              VOLVER AL CATÁLOGO
            </Link>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight uppercase leading-none">
              {bike.name}
            </h1>
            <p className="text-gray-400 text-sm font-sans mt-4 max-w-md leading-relaxed">
              {bike.description}
            </p>
            {/* Quick specs */}
            <div className="flex gap-4 mt-8 justify-center md:justify-start">
              <div className="bg-white/[0.04] border border-white/10 rounded-lg px-5 py-3 text-center">
                <div className="font-accent text-xl font-bold text-red-500">{bike.specs.engine}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-1">MOTOR</div>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-lg px-5 py-3 text-center">
                <div className="font-accent text-xl font-bold text-red-500">{bike.specs.maxSpeed}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-1">VEL. MAX</div>
              </div>
              {bike.specs.power && (
                <div className="bg-white/[0.04] border border-white/10 rounded-lg px-5 py-3 text-center">
                  <div className="font-accent text-xl font-bold text-red-500">{bike.specs.power}</div>
                  <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-1">POTENCIA</div>
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
                COTIZAR
              </button>
              <Link
                to="/"
                className="px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all text-[10px] font-bold tracking-[0.2em] font-accent"
                style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 100%, 0% 100%)' }}
              >
                DONDE COMPRAR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ Color Selector ══════════ */}
      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-[10px] text-white/30 font-accent tracking-[0.2em]">
            SELECCIONAR COLOR
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
          ESPECIFICACIONES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {specEntries.map(([key, value]) => (
            <div
              key={key}
              className="bg-white/[0.03] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"
            >
              <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mb-2">
                {SPEC_LABELS[key] || key.toUpperCase()}
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
            GALERÍA
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
              OTROS MODELOS
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
                        {related.description}
                      </p>
                      <span className="inline-block mt-3 text-red-500 text-[10px] font-bold tracking-[0.2em] font-accent group-hover:text-red-400 transition-colors">
                        VER DETALLES →
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
      <ModernQuoteSheet isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
