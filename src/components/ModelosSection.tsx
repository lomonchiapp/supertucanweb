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
    <div className="min-h-screen bg-gray-950">
      {/* ══════════ Header con tabs de categoría ══════════ */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          {/* Título */}
          <div className="pt-10 pb-6">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight uppercase">
              MODELOS
            </h1>
            <p className="text-gray-500 text-sm font-sans mt-2 tracking-wide">
              Descubre la línea completa de vehículos Super Tucán
            </p>
          </div>

          {/* Tabs de categoría */}
          <div className="flex gap-0 -mb-px">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = getBikesByCategory(cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-6 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-colors duration-300 border-b-2 ${
                    isActive
                      ? 'text-white border-red-600'
                      : 'text-white/30 border-transparent hover:text-white/60'
                  }`}
                >
                  {cat.name}
                  {count > 0 && (
                    <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-red-600 text-white' : 'bg-white/5 text-white/30'
                    }`}>
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
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Descripción de categoría */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight uppercase">
              {activeCategoryInfo?.name}
            </h2>
            <p className="text-gray-500 text-sm font-sans mt-1">{activeCategoryInfo?.description}</p>
          </div>
          <span className="text-xs text-white/20 font-accent tracking-[0.15em]">
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
    <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-400 overflow-hidden">
      {/* Línea roja top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

      {/* Layout horizontal: imagen | info */}
      <div className="flex flex-col sm:flex-row">
        {/* Imagen */}
        <div className="relative sm:w-[55%] h-56 sm:h-64 flex items-center justify-center overflow-hidden bg-black/20">
          {/* Splash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255,255,255,0.04) 0%, transparent 70%)',
            }}
          />
          {mainImage && (
            <LazyImage
              src={mainImage}
              alt={`${bike.name} ${currentColor.name}`}
              className="relative z-10 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}
            />
          )}
          {/* Badge */}
          {bike.featured && (
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-red-600 text-white px-2.5 py-0.5 text-[9px] font-bold tracking-[0.15em] font-accent">
                DESTACADO
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* Header */}
          <div>
            <h3 className="font-display text-3xl font-bold text-white tracking-tight uppercase leading-none">
              {bike.name}
            </h3>
            <p className="text-gray-500 text-xs font-sans mt-2 leading-relaxed line-clamp-2">
              {bike.description}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
              <div className="font-accent text-sm font-bold text-red-500">{bike.specs.engine}</div>
              <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">MOTOR</div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
              <div className="font-accent text-sm font-bold text-red-500">{bike.specs.maxSpeed}</div>
              <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">VEL. MAX</div>
            </div>
            {bike.specs.power && (
              <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                <div className="font-accent text-sm font-bold text-red-500">{bike.specs.power}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">POTENCIA</div>
              </div>
            )}
            {bike.specs.fuelTank && (
              <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                <div className="font-accent text-sm font-bold text-red-500">{bike.specs.fuelTank}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">TANQUE</div>
              </div>
            )}
            {bike.specs.weight && (
              <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                <div className="font-accent text-sm font-bold text-red-500">{bike.specs.weight}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">PESO</div>
              </div>
            )}
            {bike.specs.transmission && (
              <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                <div className="font-accent text-sm font-bold text-red-500">{bike.specs.transmission}</div>
                <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">TRANSMISIÓN</div>
              </div>
            )}
          </div>

          {/* Expanded specs */}
          {specsExpanded && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {bike.specs.brakeType && (
                <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                  <div className="font-accent text-sm font-bold text-red-500">{bike.specs.brakeType}</div>
                  <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">FRENOS</div>
                </div>
              )}
              {bike.specs.startType && (
                <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                  <div className="font-accent text-sm font-bold text-red-500">{bike.specs.startType}</div>
                  <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">ARRANQUE</div>
                </div>
              )}
              {bike.specs.wheelSize && (
                <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                  <div className="font-accent text-sm font-bold text-red-500">{bike.specs.wheelSize}</div>
                  <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">RUEDAS</div>
                </div>
              )}
              {bike.specs.seatHeight && (
                <div className="bg-white/[0.03] border border-white/5 rounded px-3 py-2">
                  <div className="font-accent text-sm font-bold text-red-500">{bike.specs.seatHeight}</div>
                  <div className="text-[9px] text-white/30 font-accent tracking-[0.15em] mt-0.5">ALTURA ASIENTO</div>
                </div>
              )}
            </div>
          )}

          {/* Toggle expanded specs */}
          {(bike.specs.brakeType || bike.specs.startType || bike.specs.wheelSize || bike.specs.seatHeight) && (
            <button
              onClick={() => setSpecsExpanded(!specsExpanded)}
              className="mt-2 text-[9px] text-white/30 hover:text-white/50 font-accent tracking-[0.15em] transition-colors duration-200"
            >
              {specsExpanded ? '- MENOS SPECS' : '+ MÁS SPECS'}
            </button>
          )}

          {/* Colores */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-white/30 font-accent tracking-[0.15em]">COLOR</span>
              <div className="flex gap-1.5">
                {bike.colors.map((color: BikeColor) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === color.value
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-white/15 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/40 font-sans ml-auto">{currentColor.name}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={onQuote}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 text-[10px] font-bold tracking-[0.2em] font-accent transition-colors duration-300"
              style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              COTIZAR
            </button>
            <Link
              to={`/modelos/${bike.slug}`}
              className="px-4 py-2.5 border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all duration-300 text-[10px] font-bold tracking-[0.2em] font-accent inline-flex items-center justify-center"
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

/* ═══════════════════════════════════════════════════ */
/* EMPTY STATE                                        */
/* ═══════════════════════════════════════════════════ */
function EmptyState() {
  return (
    <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="font-display text-2xl font-bold text-white/40 tracking-tight uppercase">
        PRÓXIMAMENTE
      </h3>
      <p className="text-white/20 text-xs font-sans mt-2">Nuevos modelos en desarrollo</p>
    </div>
  );
}
