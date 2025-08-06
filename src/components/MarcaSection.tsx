import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function MarcaSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animaciones de entrada
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }

    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "back.out(1.7)" }
      );
    }

    if (valuesRef.current) {
      gsap.fromTo(valuesRef.current.children,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white pt-40">
      
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20">
        <div className="absolute inset-0 bg-[url('/bg.avif')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          
          {/* Logo Principal */}
          <div className="mb-8">
            <img 
              src="/logo-full-white.png" 
              alt="Super Tucán" 
              className="h-20 mx-auto filter drop-shadow-2xl"
            />
          </div>

          {/* Título Principal */}
          <h1 
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            style={{ fontFamily: 'Bebas Neue' }}
          >
            MÁS QUE UNA MARCA
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Somos pasión por la movilidad, innovación en cada detalle y compromiso 
            con quienes eligen la libertad sobre dos ruedas.
          </p>

          {/* CTA */}
          <div className="inline-flex items-center bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl">
            <span className="text-lg font-bold">DESCUBRE NUESTRA HISTORIA</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div ref={statsRef} className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="text-center">
              <div 
                className="text-4xl md:text-6xl font-black text-red-600 mb-2"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                15+
              </div>
              <div className="text-gray-600 font-medium">Años de Experiencia</div>
            </div>

            <div className="text-center">
              <div 
                className="text-4xl md:text-6xl font-black text-red-600 mb-2"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                50K+
              </div>
              <div className="text-gray-600 font-medium">Clientes Satisfechos</div>
            </div>

            <div className="text-center">
              <div 
                className="text-4xl md:text-6xl font-black text-red-600 mb-2"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                100+
              </div>
              <div className="text-gray-600 font-medium">Dealers Autorizados</div>
            </div>

            <div className="text-center">
              <div 
                className="text-4xl md:text-6xl font-black text-red-600 mb-2"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                24/7
              </div>
              <div className="text-gray-600 font-medium">Soporte Técnico</div>
            </div>

          </div>
        </div>
      </div>

      {/* Historia y Misión */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Imagen */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-red-100 to-red-50 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/logo-icon.png"
                  alt="Super Tucán Heritage"
                  className="w-full h-full object-contain p-16"
                />
              </div>
              {/* Elemento decorativo */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-600/10 rounded-full -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-red-600/5 rounded-full -z-10"></div>
            </div>

            {/* Contenido */}
            <div className="space-y-8">
              <div>
                <h2 
                  className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  NUESTRA HISTORIA
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Desde nuestros inicios, Super Tucán ha sido sinónimo de calidad, 
                  innovación y pasión por las dos ruedas. Comenzamos como un sueño 
                  de ofrecer movilidad accesible y confiable para todos.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Hoy, somos líderes en el mercado de motocicletas y scooters, 
                  siempre comprometidos con la excelencia y la satisfacción de 
                  nuestros clientes.
                </p>
              </div>

              {/* Misión */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl">
                <h3 
                  className="text-2xl font-black text-red-800 mb-3"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  NUESTRA MISIÓN
                </h3>
                <p className="text-red-700 font-medium">
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
      <div ref={valuesRef} className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
              style={{ fontFamily: 'Bebas Neue' }}
            >
              NUESTROS VALORES
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los principios que guían cada decisión y nos mantienen conectados 
              con nuestros clientes y comunidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Valor 1 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 
                className="text-2xl font-black text-gray-900 mb-4"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                CALIDAD
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cada vehículo Super Tucán pasa por rigurosos controles de calidad 
                para garantizar durabilidad, seguridad y rendimiento excepcional.
              </p>
            </div>

            {/* Valor 2 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 
                className="text-2xl font-black text-gray-900 mb-4"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                INNOVACIÓN
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Constantemente evolucionamos nuestros diseños y tecnologías para 
                ofrecer la mejor experiencia de conducción posible.
              </p>
            </div>

            {/* Valor 3 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 
                className="text-2xl font-black text-gray-900 mb-4"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                COMUNIDAD
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Más que clientes, somos una familia. Construimos relaciones 
                duraderas basadas en confianza y respeto mutuo.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            style={{ fontFamily: 'Bebas Neue' }}
          >
            ¿LISTO PARA UNIRTE A LA FAMILIA?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubre por qué miles de personas confían en Super Tucán para sus aventuras diarias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              VER MODELOS
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105">
              CONTACTAR
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}