import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigationStore } from '@/store/navigationStore';
import { ModernQuoteSheet } from './ModernQuoteSheet';

const STATS = [
  { value: '15+', label: 'Años de Experiencia' },
  { value: '50K+', label: 'Clientes Satisfechos' },
  { value: '100+', label: 'Dealers Autorizados' },
  { value: '24/7', label: 'Soporte Técnico' },
];

const VALUES = [
  {
    title: 'CALIDAD',
    description: 'Cada vehículo Super Tucán pasa por rigurosos controles de calidad para garantizar durabilidad, seguridad y rendimiento excepcional.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'INNOVACIÓN',
    description: 'Constantemente evolucionamos nuestros diseños y tecnologías para ofrecer la mejor experiencia de conducción posible.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'COMUNIDAD',
    description: 'Más que clientes, somos una familia. Construimos relaciones duraderas basadas en confianza y respeto mutuo.',
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
      gsap.fromTo(heroRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );
    }
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: 'back.out(1.7)' }
      );
    }
    if (valuesRef.current) {
      gsap.fromTo(valuesRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[url('/bg.avif')] bg-cover bg-center opacity-10" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.05) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <img src="/logo-white.png" alt="Super Tucán" className="h-16 mx-auto mb-8 opacity-80" />
          <h1 className="font-display text-6xl md:text-8xl font-bold text-white tracking-tight uppercase mb-6">
            MÁS QUE UNA MARCA
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-sans">
            Somos pasión por la movilidad, innovación en cada detalle y compromiso
            con quienes eligen la libertad sobre dos ruedas.
          </p>
          <button
            onClick={() => historiaRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 px-6 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-all duration-300"
          >
            DESCUBRE NUESTRA HISTORIA
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-white/5">
        <div ref={statsRef} className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-5xl md:text-6xl font-bold text-red-500 mb-2">{stat.value}</div>
              <div className="text-gray-500 text-sm font-sans font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historia */}
      <div ref={historiaRef} className="py-20" id="historia">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                <img src="/logo-icon.png" alt="Super Tucán Heritage" className="w-2/3 h-2/3 object-contain opacity-60" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-red-600/20 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-red-600/10 rounded-full" />
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight uppercase mb-6">
                  NUESTRA HISTORIA
                </h2>
                <p className="text-gray-400 leading-relaxed font-sans mb-4">
                  Desde nuestros inicios, Super Tucán ha sido sinónimo de calidad,
                  innovación y pasión por las dos ruedas. Comenzamos como un sueño
                  de ofrecer movilidad accesible y confiable para todos.
                </p>
                <p className="text-gray-400 leading-relaxed font-sans">
                  Hoy, somos líderes en el mercado de motocicletas y scooters,
                  siempre comprometidos con la excelencia y la satisfacción de
                  nuestros clientes.
                </p>
              </div>

              <div className="bg-red-600/5 border border-red-600/10 rounded-xl p-6">
                <h3 className="font-display text-2xl font-bold text-red-500 mb-3 uppercase">
                  NUESTRA MISIÓN
                </h3>
                <p className="text-gray-400 font-sans leading-relaxed">
                  Proporcionar vehículos de dos ruedas de alta calidad que conecten
                  a las personas con sus destinos, combinando tecnología avanzada,
                  diseño excepcional y un servicio al cliente incomparable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight uppercase mb-4">
              NUESTROS VALORES
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-sans">
              Los principios que guían cada decisión y nos mantienen conectados con nuestros clientes.
            </p>
          </div>

          <div ref={valuesRef} className="grid md:grid-cols-3 gap-6">
            {VALUES.map((val) => (
              <div
                key={val.title}
                className="group bg-white/[0.02] border border-white/5 hover:border-red-600/20 rounded-xl p-8 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={val.icon} />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3 uppercase">{val.title}</h3>
                <p className="text-gray-500 font-sans leading-relaxed text-sm">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight uppercase mb-6">
            ¿LISTO PARA UNIRTE?
          </h2>
          <p className="text-gray-400 text-lg mb-10 font-sans">
            Descubre por qué miles de personas confían en Super Tucán para sus aventuras diarias.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveSection('modelos')}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-colors"
              style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              VER MODELOS
            </button>
            <button
              onClick={() => setIsQuoteSheetOpen(true)}
              className="border border-white/15 text-white/70 hover:text-white hover:border-white/30 px-8 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-all"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 100%, 0% 100%)' }}
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
