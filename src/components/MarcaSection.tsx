import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigationStore } from '@/store/navigationStore';
import { ModernQuoteSheet } from './ModernQuoteSheet';

const STATS = [
  { value: '15+', label: 'AÑOS DE EXPERIENCIA' },
  { value: '50K+', label: 'CLIENTES SATISFECHOS' },
  { value: '120+', label: 'DEALERS AUTORIZADOS' },
  { value: '24/7', label: 'SOPORTE TÉCNICO' },
];

const VALUES = [
  {
    title: 'CALIDAD',
    description:
      'Cada vehículo Super Tucán pasa por rigurosos controles de calidad para garantizar durabilidad, seguridad y rendimiento excepcional.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'INNOVACIÓN',
    description:
      'Constantemente evolucionamos nuestros diseños y tecnologías para ofrecer la mejor experiencia de conducción posible.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'COMUNIDAD',
    description:
      'Más que clientes, somos una familia. Construimos relaciones duraderas basadas en confianza y respeto mutuo.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
];

export function MarcaSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const historiaRef = useRef<HTMLDivElement>(null);
  const setActiveSection = useNavigationStore((s) => s.setActiveSection);
  const [isQuoteSheetOpen, setIsQuoteSheetOpen] = useState(false);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' }
      );
    }
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, delay: 0.4, ease: 'back.out(1.7)' }
      );
    }
    if (valuesRef.current) {
      gsap.fromTo(
        valuesRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ══════════ Hero ══════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-50">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(227,6,19,0.05) 0%, transparent 60%)',
          }}
        />

        <div ref={heroRef} className="relative max-w-[1100px] mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
          <img
            src="/logo-full.png"
            alt="Super Tucán"
            className="h-14 mx-auto mb-8"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo-white.png';
              (e.currentTarget as HTMLImageElement).style.filter = 'invert(1)';
            }}
          />
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
              SOBRE NOSOTROS
            </span>
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-neutral-900 tracking-tight uppercase mb-6 leading-[0.9]">
            MÁS QUE UNA MARCA
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed font-sans">
            Somos pasión por la movilidad, innovación en cada detalle y compromiso con quienes eligen
            la libertad sobre dos ruedas.
          </p>
          <button
            onClick={() => historiaRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:bg-neutral-900 hover:text-white px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] font-accent transition-all duration-300"
            style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
          >
            DESCUBRE NUESTRA HISTORIA
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* ══════════ Stats ══════════ */}
      <div className="relative bg-neutral-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(227,6,19,0.6) 14px, rgba(227,6,19,0.6) 15px)',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

        <div ref={statsRef} className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-5xl md:text-6xl font-bold leading-none mb-2">
                <span className="text-[var(--color-primary)]">{stat.value.charAt(0)}</span>
                {stat.value.slice(1)}
              </div>
              <div className="text-neutral-400 text-[10px] md:text-xs font-bold tracking-[0.25em] font-accent">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ Historia ══════════ */}
      <div ref={historiaRef} className="py-20 lg:py-28 bg-white" id="historia">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src="/logo-icon.png"
                  alt="Super Tucán Heritage"
                  className="w-2/3 h-2/3 object-contain"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[var(--color-primary)]/15 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-[var(--color-primary)]/10 rounded-full" />
              {/* Decorative number */}
              <span
                className="absolute -bottom-8 right-0 font-display font-bold text-9xl text-neutral-100 select-none pointer-events-none -z-10"
                aria-hidden="true"
              >
                15+
              </span>
            </div>

            <div className="space-y-7">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
                  <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                    DESDE 2010
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight uppercase mb-5 leading-[0.95]">
                  NUESTRA HISTORIA
                </h2>
                <p className="text-neutral-600 leading-relaxed font-sans mb-4">
                  Desde nuestros inicios, Super Tucán ha sido sinónimo de calidad, innovación y pasión
                  por las dos ruedas. Comenzamos como un sueño de ofrecer movilidad accesible y
                  confiable para todos.
                </p>
                <p className="text-neutral-600 leading-relaxed font-sans">
                  Hoy, somos líderes en el mercado de motocicletas y scooters en el Caribe y
                  Latinoamérica, siempre comprometidos con la excelencia y la satisfacción de
                  nuestros clientes.
                </p>
              </div>

              <div className="relative bg-neutral-50 border-l-4 border-[var(--color-primary)] p-6">
                <h3 className="font-display text-2xl font-bold text-[var(--color-primary)] mb-3 uppercase">
                  NUESTRA MISIÓN
                </h3>
                <p className="text-neutral-700 font-sans leading-relaxed">
                  Proporcionar vehículos de dos ruedas de alta calidad que conecten a las personas con
                  sus destinos, combinando tecnología avanzada, diseño excepcional y un servicio al
                  cliente incomparable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Valores ══════════ */}
      <div className="py-20 lg:py-28 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                FILOSOFÍA
              </span>
              <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight uppercase mb-4 leading-[0.95]">
              NUESTROS VALORES
            </h2>
            <p className="text-neutral-600 font-sans">
              Los principios que guían cada decisión y nos mantienen conectados con nuestros clientes.
            </p>
          </div>

          <div ref={valuesRef} className="grid md:grid-cols-3 gap-6">
            {VALUES.map((val, i) => (
              <div
                key={val.title}
                className="group relative bg-white border border-neutral-100 hover:border-[var(--color-primary)] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10"
              >
                {/* Diagonal corner accent on hover */}
                <div
                  className="absolute top-0 right-0 w-14 h-14 bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
                />

                <div className="font-display text-7xl font-bold text-neutral-100 leading-none mb-4">
                  0{i + 1}
                </div>
                <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)] group-hover:text-white text-[var(--color-primary)] flex items-center justify-center mb-5 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={val.icon} />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-3 uppercase">
                  {val.title}
                </h3>
                <p className="text-neutral-600 font-sans leading-relaxed text-sm">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CTA ══════════ */}
      <div className="relative py-20 lg:py-24 bg-neutral-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(255,255,255,0.5) 14px, rgba(255,255,255,0.5) 15px)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(227,6,19,0.2), transparent 60%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
              ÚNETE A LA FAMILIA
            </span>
            <div className="h-[2px] w-10 bg-[var(--color-primary)]" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight uppercase mb-5 leading-[0.95]">
            ¿LISTO PARA UNIRTE?
          </h2>
          <p className="text-neutral-300 text-lg mb-10 font-sans max-w-2xl mx-auto">
            Descubre por qué miles de personas confían en Super Tucán para sus aventuras diarias.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveSection('modelos')}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white px-8 py-4 text-xs font-bold tracking-[0.2em] font-accent transition-colors"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              VER MODELOS
            </button>
            <button
              onClick={() => setIsQuoteSheetOpen(true)}
              className="border border-white/30 hover:border-white hover:bg-white hover:text-neutral-900 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] font-accent transition-all"
              style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}
            >
              CONTACTAR
            </button>
          </div>
        </div>
      </div>

      <ModernQuoteSheet isOpen={isQuoteSheetOpen} onClose={() => setIsQuoteSheetOpen(false)} />
    </div>
  );
}
