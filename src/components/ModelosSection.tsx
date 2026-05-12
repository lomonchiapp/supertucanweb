import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBikesByCategory } from '@/data/bikes';
import { CATEGORIES } from '@/types/bikes';
import type { BikeModel, BikeColor } from '@/types/bikes';
import { LazyImage } from './ui/lazy-image';
import { useNavigationStore } from '@/store/navigationStore';
import { ModernQuoteSheet } from './ModernQuoteSheet';

export function ModelosSection() {
  const { selectedCategory } = useNavigationStore();
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  const currentModels = getBikesByCategory(activeCategory);
  const activeCategoryInfo = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* ══════════ Hero header ══════════ */}
      <div className="relative bg-gradient-to-br from-neutral-100 via-white to-neutral-50 border-b border-neutral-100 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 pt-14 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
              CATÁLOGO
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight uppercase leading-[0.95]">
            MODELOS
          </h1>
          <p className="text-neutral-600 text-base font-sans mt-3 max-w-2xl">
            Descubre la línea completa de vehículos Super Tucán. Elige tu próxima aventura entre nuestros modelos diseñados para cada estilo.
          </p>

          {/* Tabs de categoría */}
          <div className="flex gap-0 -mb-px mt-8 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = getBikesByCategory(cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 relative px-6 py-4 text-xs font-bold tracking-[0.2em] font-accent transition-colors duration-300 border-b-2 ${
                    isActive
                      ? 'text-neutral-900 border-[var(--color-primary)]'
                      : 'text-neutral-400 border-transparent hover:text-neutral-700'
                  }`}
                >
                  {cat.name}
                  {count > 0 && (
                    <span
                      className={`ml-2 text-[9px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════ Contenido ══════════ */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
        {/* Descripción de categoría */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 tracking-tight uppercase">
              {activeCategoryInfo?.name}
            </h2>
            <p className="text-neutral-500 text-sm font-sans mt-1">{activeCategoryInfo?.description}</p>
          </div>
          <span className="text-xs text-neutral-500 font-accent tracking-[0.15em] font-bold">
            {currentModels.length} MODELO{currentModels.length !== 1 ? 'S' : ''}
          </span>
        </div>

        {/* Grid de modelos */}
        {currentModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentModels.map((bike) => (
              <ModelCard key={bike.id} bike={bike} onQuote={() => setQuoteOpen(true)} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      <ModernQuoteSheet isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* MODEL CARD                                         */
/* ═══════════════════════════════════════════════════ */
function ModelCard({ bike, onQuote }: { bike: BikeModel; onQuote: () => void }) {
  const [selectedColor, setSelectedColor] = useState(bike.colors[0]?.value || '');
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const currentColor = bike.colors.find((c) => c.value === selectedColor) || bike.colors[0]!;
  const mainImage = currentColor?.images?.main || currentColor?.images?.front;

  return (
    <div className="group relative bg-white border border-neutral-100 hover:border-[var(--color-primary)]/40 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-neutral-900/10 hover:-translate-y-0.5">
      {/* Línea roja top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

      {/* Layout horizontal: imagen | info */}
      <div className="flex flex-col sm:flex-row">
        {/* Imagen */}
        <div className="relative sm:w-[48%] h-56 sm:h-72 flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
          {mainImage && (
            <LazyImage
              src={mainImage}
              alt={`${bike.name} ${currentColor.name}`}
              className="relative z-10 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
            />
          )}
          {/* Badge */}
          {bike.featured && (
            <div className="absolute top-3 left-3 z-20">
              <span
                className="bg-[var(--color-primary)] text-white px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] font-accent"
                style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
              >
                DESTACADO
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Header */}
          <div>
            <h3 className="font-display text-3xl font-bold text-neutral-900 tracking-tight uppercase leading-none">
              {bike.name}
            </h3>
            <p className="text-neutral-500 text-xs font-sans mt-2 leading-relaxed line-clamp-2">
              {bike.description}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <SpecBox value={bike.specs.engine} label="MOTOR" />
            <SpecBox value={bike.specs.maxSpeed} label="VEL. MAX" />
            {bike.specs.power && <SpecBox value={bike.specs.power} label="POTENCIA" />}
            {bike.specs.fuelTank && <SpecBox value={bike.specs.fuelTank} label="TANQUE" />}
            {bike.specs.weight && <SpecBox value={bike.specs.weight} label="PESO" />}
            {bike.specs.transmission && <SpecBox value={bike.specs.transmission} label="TRANSMISIÓN" />}
          </div>

          {/* Expanded specs */}
          {specsExpanded && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {bike.specs.brakeType && <SpecBox value={bike.specs.brakeType} label="FRENOS" />}
              {bike.specs.startType && <SpecBox value={bike.specs.startType} label="ARRANQUE" />}
              {bike.specs.wheelSize && <SpecBox value={bike.specs.wheelSize} label="RUEDAS" />}
              {bike.specs.seatHeight && <SpecBox value={bike.specs.seatHeight} label="ALTURA ASIENTO" />}
            </div>
          )}

          {/* Toggle expanded specs */}
          {(bike.specs.brakeType || bike.specs.startType || bike.specs.wheelSize || bike.specs.seatHeight) && (
            <button
              onClick={() => setSpecsExpanded(!specsExpanded)}
              className="mt-2 text-[9px] text-neutral-500 hover:text-[var(--color-primary)] font-accent tracking-[0.15em] transition-colors duration-200 self-start"
            >
              {specsExpanded ? '− MENOS SPECS' : '+ MÁS SPECS'}
            </button>
          )}

          {/* Colores */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-neutral-500 font-accent tracking-[0.15em] font-bold">COLOR</span>
              <div className="flex gap-1.5">
                {bike.colors.map((color: BikeColor) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === color.value
                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <span className="text-[10px] text-neutral-500 font-sans ml-auto font-bold">{currentColor.name}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={onQuote}
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3 text-[10px] font-bold tracking-[0.2em] font-accent transition-colors duration-300"
              style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              COTIZAR
            </button>
            <Link
              to={`/modelos/${bike.slug}`}
              className="px-5 py-3 border border-neutral-200 text-neutral-700 hover:text-white hover:border-neutral-900 hover:bg-neutral-900 transition-all duration-300 text-[10px] font-bold tracking-[0.2em] font-accent inline-flex items-center justify-center"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              DETALLES
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-neutral-50 border border-neutral-100 px-3 py-2">
      <div className="font-accent text-sm font-bold text-[var(--color-primary)]">{value}</div>
      <div className="text-[9px] text-neutral-500 font-accent tracking-[0.15em] mt-0.5 font-bold">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* EMPTY STATE                                        */
/* ═══════════════════════════════════════════════════ */
function EmptyState() {
  return (
    <div className="text-center py-24 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
      <div className="w-20 h-20 rounded-full border border-neutral-200 bg-white flex items-center justify-center mx-auto mb-5 shadow-sm">
        <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="font-display text-2xl font-bold text-neutral-400 tracking-tight uppercase">
        PRÓXIMAMENTE
      </h3>
      <p className="text-neutral-400 text-xs font-sans mt-2 tracking-wide">Nuevos modelos en desarrollo</p>
    </div>
  );
}
