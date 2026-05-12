import { useState } from 'react';
import { useCountryStore } from '@/store/countryStore';
import { useNavigationStore } from '@/store/navigationStore';

const CATEGORIES = [
  {
    id: 'motor',
    name: 'MOTOR',
    count: 45,
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  { id: 'carroceria', name: 'CARROCERÍA', count: 32, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'electrico', name: 'ELÉCTRICO', count: 28, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'frenos', name: 'FRENOS', count: 19, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'suspension', name: 'SUSPENSIÓN', count: 15, icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { id: 'accesorios', name: 'ACCESORIOS', count: 67, icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
];

const PARTS = [
  { id: 1, name: 'Filtro de Aceite Original', category: 'motor', model: 'ADRI SPORT / BWS / CG200', price: 25.99, originalPrice: 32.99, inStock: true, discount: 20 },
  { id: 2, name: 'Pastillas de Freno Delanteras', category: 'frenos', model: 'ADRI SPORT', price: 45.99, originalPrice: null, inStock: true, discount: 0 },
  { id: 3, name: 'Carenado Lateral Izquierdo', category: 'carroceria', model: 'BWS', price: 89.99, originalPrice: 109.99, inStock: false, discount: 18 },
  { id: 4, name: 'Bombillo LED H4', category: 'electrico', model: 'Universal', price: 15.99, originalPrice: null, inStock: true, discount: 0 },
  { id: 5, name: 'Kit de Cadena y Piñón', category: 'motor', model: 'CG200 / ST 125', price: 67.5, originalPrice: 79.99, inStock: true, discount: 15 },
  { id: 6, name: 'Amortiguador Trasero', category: 'suspension', model: 'ADRI SPORT', price: 120.0, originalPrice: null, inStock: true, discount: 0 },
];

export function PartesSection() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [cartItems, setCartItems] = useState<number[]>([]);
  const { selectedCountry } = useCountryStore();
  const { setActiveSection } = useNavigationStore();

  const filtered = activeCategory === 'todos' ? PARTS : PARTS.filter((p) => p.category === activeCategory);
  const activeCatName = CATEGORIES.find((c) => c.id === activeCategory)?.name || 'TODOS';

  const openWhatsApp = (partName: string) => {
    const msg = encodeURIComponent(`Hola, me interesa el repuesto: ${partName}. ¿Está disponible?`);
    window.open(`https://wa.me/18091234567?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ══════════ Hero ══════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-50 border-b border-neutral-100">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(227,6,19,0.06) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                CATÁLOGO OFICIAL
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight uppercase leading-[0.9]">
              REPUESTOS
              <br />
              <span className="text-[var(--color-primary)]">ORIGINALES</span>
            </h1>
            <p className="text-neutral-600 text-base font-sans mt-5 leading-relaxed max-w-lg">
              Repuestos originales y accesorios para tu Super Tucán con calidad garantizada y envío
              a {selectedCountry?.name || 'toda Latinoamérica'}.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 mt-6">
              {['Originales', 'Garantía 6 meses', 'Envío rápido'].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 text-xs text-neutral-700 font-accent tracking-[0.1em] font-bold"
                >
                  <svg className="w-4 h-4 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {badge}
                </div>
              ))}
            </div>

            {/* Stats inline */}
            <div className="flex gap-10 mt-10">
              {[
                { val: '200+', label: 'REPUESTOS' },
                { val: '12', label: 'PAÍSES' },
                { val: '24H', label: 'DESPACHO' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-[var(--color-primary)] leading-none">
                    {s.val}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-accent tracking-[0.25em] mt-1 font-bold">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Category tabs + Products ══════════ */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-neutral-100 overflow-x-auto -mb-px pt-8">
          <button
            onClick={() => setActiveCategory('todos')}
            className={`shrink-0 px-5 py-4 text-[10px] font-bold tracking-[0.2em] font-accent border-b-2 transition-colors ${
              activeCategory === 'todos'
                ? 'text-neutral-900 border-[var(--color-primary)]'
                : 'text-neutral-400 border-transparent hover:text-neutral-700'
            }`}
          >
            TODOS
            <span
              className={`ml-1.5 text-[8px] px-1.5 py-0.5 rounded-full ${
                activeCategory === 'todos' ? 'bg-[var(--color-primary)] text-white' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {PARTS.length}
            </span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-5 py-4 text-[10px] font-bold tracking-[0.2em] font-accent border-b-2 transition-colors ${
                activeCategory === cat.id
                  ? 'text-neutral-900 border-[var(--color-primary)]'
                  : 'text-neutral-400 border-transparent hover:text-neutral-700'
              }`}
            >
              {cat.name}
              <span
                className={`ml-1.5 text-[8px] px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.id ? 'bg-[var(--color-primary)] text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mt-10 mb-6 flex-wrap gap-3">
          <h2 className="font-display text-3xl font-bold text-neutral-900 tracking-tight uppercase">
            {activeCategory === 'todos' ? 'PRODUCTOS DESTACADOS' : activeCatName}
          </h2>
          <span className="text-xs text-neutral-500 font-accent tracking-[0.15em] font-bold">
            {filtered.length} PRODUCTO{filtered.length !== 1 ? 'S' : ''}
          </span>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
          {filtered.map((part) => {
            const catIcon = CATEGORIES.find((c) => c.id === part.category)?.icon || '';
            return (
              <div
                key={part.id}
                className="group relative bg-white border border-neutral-100 hover:border-[var(--color-primary)]/40 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-neutral-900/10 hover:-translate-y-0.5"
              >
                {/* Red line top */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left z-10" />

                <div className="flex">
                  {/* Icon area */}
                  <div className="w-28 shrink-0 bg-gradient-to-br from-neutral-50 to-neutral-100 border-r border-neutral-100 flex items-center justify-center relative">
                    <svg
                      className="w-12 h-12 text-neutral-300 group-hover:text-[var(--color-primary)]/70 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={catIcon} />
                    </svg>
                    {part.discount > 0 && (
                      <span
                        className="absolute top-2 left-2 bg-[var(--color-primary)] text-white text-[9px] font-bold font-accent px-1.5 py-0.5 tracking-wider"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)' }}
                      >
                        −{part.discount}%
                      </span>
                    )}
                    {!part.inStock && (
                      <span className="absolute bottom-2 left-2 bg-neutral-200 text-neutral-500 text-[9px] font-bold font-accent px-1.5 py-0.5 tracking-wider">
                        AGOTADO
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-sans leading-tight">
                        {part.name}
                      </h3>
                      <p className="text-[10px] text-neutral-500 font-accent tracking-[0.1em] mt-1 font-bold">
                        {part.model}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold text-neutral-900">
                          ${part.price.toFixed(2)}
                        </span>
                        {part.originalPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            ${part.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => {
                          if (part.inStock) {
                            setCartItems((prev) => [...prev, part.id]);
                            openWhatsApp(part.name);
                          }
                        }}
                        disabled={!part.inStock}
                        className={`text-[10px] font-bold tracking-[0.15em] font-accent px-3.5 py-2 transition-colors ${
                          part.inStock
                            ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white'
                            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        }`}
                        style={part.inStock ? { clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0% 100%)' } : undefined}
                      >
                        {part.inStock ? 'CONSULTAR' : 'AGOTADO'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════ CTA ══════════ */}
      <div className="relative bg-neutral-900 text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
              ATENCIÓN PERSONALIZADA
            </span>
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase mb-4 leading-[0.95]">
            ¿NO ENCUENTRAS LO QUE BUSCAS?
          </h2>
          <p className="text-neutral-300 font-sans mb-10 text-base lg:text-lg">
            Contacta a tu dealer más cercano para solicitar repuestos específicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                const msg = encodeURIComponent('Hola, necesito ayuda para encontrar un repuesto.');
                window.open(`https://wa.me/18091234567?text=${msg}`, '_blank');
              }}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white px-8 py-4 text-xs font-bold tracking-[0.2em] font-accent transition-colors"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              CONTACTAR POR WHATSAPP
            </button>
            <button
              onClick={() => setActiveSection('dealers')}
              className="border border-white/30 hover:border-white hover:bg-white hover:text-neutral-900 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] font-accent transition-all"
              style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}
            >
              VER DEALERS
            </button>
          </div>
        </div>
      </div>

      {/* Floating cart */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className="bg-[var(--color-primary)] text-white px-5 py-3 shadow-2xl shadow-red-500/30 flex items-center gap-3 text-sm font-bold"
            style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartItems.length} consultado{cartItems.length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
