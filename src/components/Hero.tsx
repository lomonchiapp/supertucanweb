import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArtisticFilter } from './ui/artistic-filter';
import { SkyBackground } from './ui/sky-background';
import { useCountryStore } from '@/store/countryStore';

// ✨ CONFIGURACIÓN ESCALABLE DEL HERO
const HERO_CONFIG = {
  // Categorías de motocicletas
  categories: [
    {
      id: 'deportiva',
      name: 'DEPORTIVA',
      description: 'Motocicletas diseñadas para velocidad y agilidad',
      icon: '🏍️',
      models: ['adri-sport']
    },
    {
      id: 'urbana',
      name: 'URBANA',
      description: 'Perfectas para la ciudad y uso diario',
      icon: '🏙️',
      models: ['bws']
    },
    {
      id: 'touring',
      name: 'TOURING',
      description: 'Para largas distancias y aventuras',
      icon: '🗺️',
      models: ['cg200']
    }
  ],
  
  // Modelos disponibles
  models: [
    {
      id: 'adri-sport',
      name: 'ADRI SPORT',
      folder: 'ADRI SPORT',
      description: 'EXPERIMENTA LA POTENCIA Y AGILIDAD DE NUESTRA MOTOCICLETA DEPORTIVA MÁS AVANZADA',
      specs: {
        engine: '125CC',
        maxSpeed: '85KM/H'
      },
      colors: [
        {
          id: 'azul',
          name: 'AZUL',
          folder: 'azul',
          primary: '#3b82f6',
          accent: '#1d4ed8',
          gallery: ['1.avif', '2.avif', '3.avif']
        },
        {
          id: 'roja',
          name: 'ROJA',
          folder: 'roja',
          primary: '#ef4444',
          accent: '#dc2626',
          gallery: ['1.avif']
        },
        {
          id: 'blanca',
          name: 'BLANCA',
          folder: 'blanca',
          primary: '#f8fafc',
          accent: '#e2e8f0',
          gallery: ['1.avif', '2.avif', '3.avif']
        },
        {
          id: 'negra',
          name: 'NEGRA',
          folder: 'negra',
          primary: '#1f2937',
          accent: '#111827',
          gallery: ['1.avif', '2.avif']
        }
      ]
    },
    {
      id: 'bws',
      name: 'BWS',
      folder: 'BWS',
      description: 'DISEÑO URBANO Y VERSATILIDAD PARA LA CIUDAD MODERNA',
      specs: {
        engine: '125CC',
        maxSpeed: '80KM/H'
      },
      colors: [
        {
          id: 'azul',
          name: 'AZUL',
          folder: 'azul',
          primary: '#3b82f6',
          accent: '#1d4ed8',
          gallery: ['1.avif', '2.avif', '3.avif']
        },
        {
          id: 'blanco',
          name: 'BLANCO',
          folder: 'blanco',
          primary: '#f8fafc',
          accent: '#e2e8f0',
          gallery: ['1.avif', '2.avif', '3.avif', '4.avif', '5.avif', '6.avif']
        }
      ]
    },
    {
      id: 'cg200',
      name: 'CG200',
      folder: 'CG200',
      description: 'POTENCIA Y RESISTENCIA PARA TODAS TUS AVENTURAS',
      specs: {
        engine: '200CC',
        maxSpeed: '95KM/H'
      },
      colors: [
        {
          id: 'rojo',
          name: 'ROJO',
          folder: 'rojo',
          primary: '#ef4444',
          accent: '#dc2626',
          gallery: ['1.avif', '2.avif', '3.avif', '4.avif', '5.avif', '6.avif', '7.avif', '8.avif', '9.avif']
        }
      ]
    }
  ],
  angles: [
    { id: 'main', name: 'Principal', file: 'main.avif' },
    { id: 'front', name: 'Frontal', file: 'front.avif' }
  ]
};

export function Hero() {
  const [selectedModel, setSelectedModel] = useState('adri-sport');
  const [selectedColor, setSelectedColor] = useState('azul');
  const [selectedAngle, setSelectedAngle] = useState('main');
  const [isChanging, setIsChanging] = useState(false);
  
  const bikeRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const angleMenuRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Función para cambiar modelo con animación suave y completa
  const changeModel = (modelId: string) => {
    if (modelId === selectedModel || isChanging) return;

    setIsChanging(true);

    // Referencias a todos los elementos que deben animarse
    const elementsToAnimate = [
      bikeRef.current,
      subtitleRef.current,
      descriptionRef.current,
      specsRef.current,
      galleryRef.current,
      colorMenuRef.current
    ].filter(Boolean);

    // Crear elemento logo para la animación
    const logoElement = document.createElement('div');
    logoElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      width: 80px;
      height: 80px;
      background-image: url(/logo-icon.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(logoElement);

    // Timeline principal de la animación
    const tl = gsap.timeline();

    // 1. Animación de salida de todos los elementos
    tl.to(elementsToAnimate, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.05
    }, 0);

    // 2. Animación del logo (simultánea con salida)
    tl.fromTo(logoElement,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -180
      },
      {
        opacity: 1,
        scale: 1.2,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, 0.2);

    // 3. Cambio de datos y fade out del logo
    tl.call(() => {
      setSelectedModel(modelId);
      const newModel = HERO_CONFIG.models.find(m => m.id === modelId);
      if (newModel && newModel.colors.length > 0) {
        setSelectedColor(newModel.colors[0].id);
      }
      setSelectedAngle('main');
    }, [], 0.6);

    tl.to(logoElement, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3
    }, 0.8);

    // 4. Animación de entrada de todos los elementos
    tl.fromTo(elementsToAnimate, {
      opacity: 0,
      y: -20,
      scale: 0.95
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.2)",
      stagger: 0.05,
      onComplete: () => {
        document.body.removeChild(logoElement);
        setIsChanging(false);
      }
    }, 1.1);
  };

  // Función para cambiar color con animación
  const changeColor = (colorId: string) => {
    if (colorId === selectedColor || isChanging) return;
    
    setIsChanging(true);
    
    if (bikeRef.current) {
      // Animación de salida
      gsap.to(bikeRef.current, {
        scale: 0.8,
        opacity: 0,
        rotation: -10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSelectedColor(colorId);
          // Animación de entrada
          gsap.to(bikeRef.current, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            onComplete: () => setIsChanging(false)
          });
        }
      });
    }
  };

  // Función para cambiar ángulo con animación
  const changeAngle = (angleId: string) => {
    if (angleId === selectedAngle || isChanging) return;
    
    setIsChanging(true);
    
    if (bikeRef.current) {
      // Animación de transición suave
      gsap.to(bikeRef.current, {
        rotationY: angleId === 'front' ? 25 : 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setSelectedAngle(angleId);
          gsap.to(bikeRef.current, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => setIsChanging(false)
          });
        }
      });
    }
  };

  useEffect(() => {
    // Animaciones GSAP para la motocicleta
    if (bikeRef.current) {
      // Animación de entrada inicial
      gsap.fromTo(bikeRef.current,
        {
          x: -200,
          opacity: 0,
          rotation: -5
        },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 1.5,
          ease: "power3.out"
        }
      );

      // Animación continua de "respiración"
      gsap.to(bikeRef.current, {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Ligero balanceo como si estuviera en movimiento
      gsap.to(bikeRef.current, {
        rotation: 1,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Animaciones del texto
    if (titleRef.current && subtitleRef.current && buttonsRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(subtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(buttonsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );
    }

    // Animaciones de los menús flotantes
    if (colorMenuRef.current && angleMenuRef.current) {
      gsap.fromTo([colorMenuRef.current, angleMenuRef.current],
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1.5 }
      );
    }
  }, []);

  // Obtener configuración actual (escalable)
  const currentModel = HERO_CONFIG.models.find(m => m.id === selectedModel) || HERO_CONFIG.models[0];
  const currentColor = currentModel.colors.find(c => c.id === selectedColor) || currentModel.colors[0];
  const currentAngle = HERO_CONFIG.angles.find(a => a.id === selectedAngle) || HERO_CONFIG.angles[0];
  const currentImagePath = `/src/assets/bikes/${currentModel.folder}/${currentColor.folder}/${currentAngle.file}`;

  // Estado para la galería
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);

  // Estado para el selector de modelos
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Estado para cotización
  const [isQuoteSheetOpen, setIsQuoteSheetOpen] = useState(false);

  // Obtener imágenes de galería del color actual
  const galleryImages = currentColor.gallery.map(img =>
    `/src/assets/bikes/${currentModel.folder}/${currentColor.folder}/${img}`
  );

  // ✨ COMPONENTES MODULARES PARA ESCALABILIDAD

  // Componente de Selección de Colores
  const ColorSelector = ({ position = "desktop" }: { position?: "desktop" | "mobile" }) => (
    <div className={`${position === "mobile" ? "bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl" : "bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-700/50"}`}>
      {position === "desktop" && (
        <div className="text-xs font-bold text-white/80 mb-4 text-center" style={{ fontFamily: 'Bebas Neue' }}>COLORES</div>
      )}
      <div className={`flex ${position === "mobile" ? "flex-col space-y-2" : "flex-col space-y-4"}`}>
        {currentModel.colors.map((color) => (
          <button
            key={color.id}
            onClick={() => changeColor(color.id)}
            disabled={isChanging}
            className={`group relative ${position === "mobile" ? "w-10 h-10" : "w-14 h-14"} rounded-full border-2 transition-all duration-300 hover:scale-110 ${selectedColor === color.id ? 'border-white shadow-xl' : 'border-gray-500 hover:border-gray-300'
              }`}
            style={{ backgroundColor: color.primary }}
          >
            {selectedColor === color.id && (
              <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                <svg className={`${position === "mobile" ? "w-4 h-4" : "w-5 h-5"} text-white drop-shadow-md`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {position === "desktop" && (
              <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 bg-white text-gray-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-bold" style={{ fontFamily: 'Bebas Neue' }}>
                {color.name}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Componente de Selección de Ángulos
  const AngleSelector = ({ position = "desktop" }: { position?: "desktop" | "mobile" }) => (
    <div className={`${position === "mobile" ? "bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl" : "bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-700/50"}`}>
      {position === "desktop" && (
        <div className="text-xs font-bold text-white/80 mb-4 text-center" style={{ fontFamily: 'Bebas Neue' }}>VISTA</div>
      )}
      <div className={`flex ${position === "mobile" ? "flex-col space-y-2" : "flex-col space-y-3"}`}>
        {HERO_CONFIG.angles.map((angle) => (
          <button
            key={angle.id}
            onClick={() => changeAngle(angle.id)}
            disabled={isChanging}
            className={`${position === "mobile" ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm"} font-bold rounded-xl transition-all duration-300 ${selectedAngle === angle.id
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            style={{ fontFamily: 'Bebas Neue' }}
          >
            {position === "mobile" ? (angle.id === 'main' ? '3D' : 'FRONT') : angle.name}
          </button>
        ))}
      </div>
    </div>
  );

  // Componente de Galería Compacta
  const GalleryComponent = () => (
    galleryImages.length > 0 && (
      <div ref={galleryRef} className="flex gap-2 overflow-x-auto">
        {galleryImages.map((image, index) => (
          <button
            key={image}
            onClick={() => openGallery(index)}
            className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-gray-400"
          >
            <img
              src={image}
              alt={`${currentColor.name} ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300"></div>
          </button>
        ))}
      </div>
    )
  );

  // Componente de Botones de Acción
  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button
        className="flex-1 bg-gray-900 text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
        style={{ fontFamily: 'Bebas Neue' }}
      >
        SABER MAS
      </button>
      <button
        className="flex-1 text-white px-8 py-4 text-lg font-bold hover:shadow-lg transition-all duration-300"
        style={{
          fontFamily: 'Bebas Neue',
          backgroundColor: currentColor.primary
        }}
      >
        DONDE COMPRAR
      </button>
    </div>
  );

  const openGallery = (imageIndex: number = 0) => {
    setSelectedGalleryImage(imageIndex);
    setIsGalleryOpen(true);
  };

  const nextImage = () => {
    setSelectedGalleryImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setSelectedGalleryImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Funciones para el selector de modelos
  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const selectModelFromCategory = (modelId: string) => {
    changeModel(modelId);
    setIsModelSelectorOpen(false);
    setSelectedCategory(null);
  };

  const resetSelector = () => {
    setSelectedCategory(null);
  };

  return (
    <section className="relative min-h-screen laptop-hero-height -mt-10 overflow-hidden">
      {/* Fondo de cielo animado */}
      <SkyBackground />
      {/* barra blanca debajo del hero */}
      <div className="absolute h-120 bottom-50 left-0 w-full bg-white"></div>

      {/* Filtro artístico */}
      <ArtisticFilter />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen laptop-hero-content flex items-center pt-24 lg:pt-12 laptop:pt-14 desktop:pt-16 xl:pt-20">
        <div className="max-w-7xl mx-auto px-6 w-full">

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-10 laptop:gap-12 desktop:gap-14 items-center laptop-hero-grid">

            {/* Left Column - Motocicleta */}
            <div className="relative flex justify-center">
              <img
                ref={bikeRef}
                src={currentImagePath}
                alt={`ADRI SPORT ${currentColor.name}`}
                className="w-[500px] lg:w-[520px] laptop:w-[550px] desktop:w-[580px] xl:w-[600px] z-1000 h-auto object-contain drop-shadow-2xl transition-all duration-300"
                style={{
                  filter: isChanging ? 'blur(2px)' : 'none'
                }}
              />

              {/* Menú Flotante de Colores */}
              <div
                ref={colorMenuRef}
                className="absolute top-4 lg:top-8 laptop:top-12 desktop:top-16 xl:top-20 -left-12 lg:-left-16 laptop:-left-18 desktop:-left-20 xl:-left-24 z-30 laptop-colors-menu"
              >
                <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-700/50">
                  <div className="text-xs font-bold text-white/80 mb-4 text-center" style={{ fontFamily: 'Bebas Neue' }}>
                    COLORES
                  </div>
                  <div className="flex flex-col space-y-4">
                    {currentModel.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => changeColor(color.id)}
                        disabled={isChanging}
                        className={`group relative w-14 h-14 rounded-full border-2 transition-all duration-300 hover:scale-110 ${selectedColor === color.id
                            ? 'border-white shadow-xl'
                            : 'border-gray-500 hover:border-gray-300'
                          }`}
                        style={{ backgroundColor: color.primary }}
                      >
                        {selectedColor === color.id && (
                          <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}

                        {/* Tooltip */}
                        <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 bg-white text-gray-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-bold" style={{ fontFamily: 'Bebas Neue' }}>
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Menú Flotante de Ángulos */}
              <div
                ref={angleMenuRef}
                className="absolute bottom-16 lg:bottom-24 xl:bottom-32 -left-12 lg:-left-16 laptop:-left-18 desktop:-left-20 xl:-left-24 z-30 laptop-angles-menu"
              >
                <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-700/50">
                  <div className="text-xs font-bold text-white/80 mb-4 text-center" style={{ fontFamily: 'Bebas Neue' }}>
                    VISTA
                  </div>
                  <div className="flex flex-col space-y-3">
                    {HERO_CONFIG.angles.map((angle) => (
                      <button
                        key={angle.id}
                        onClick={() => changeAngle(angle.id)}
                        disabled={isChanging}
                        className={`px-5 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${selectedAngle === angle.id
                            ? 'bg-white text-gray-900 shadow-lg'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                        style={{ fontFamily: 'Bebas Neue' }}
                      >
                        {angle.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Texto */}
            <div className="space-y-2 lg:-mt-8 laptop:-mt-12 desktop:-mt-16 xl:-mt-20">
              <div>

                <h2
                  ref={subtitleRef}
                  className="text-5xl lg:text-6xl laptop:text-6xl desktop:text-7xl xl:text-8xl laptop-title font-black tracking-wider transform -skew-x-6 transition-colors duration-500"
                  style={{
                    fontFamily: 'Knewave',
                    color: currentColor.primary
                  }}
                >
                  {currentModel.name}
                </h2>
              </div>

              {/* Descripción adicional */}
              <div ref={descriptionRef} className="space-y-3">
                <p className="text-gray-700 text-xl lg:text-2xl leading-relaxed max-w-md" style={{ fontFamily: 'Bebas Neue' }}>
                  {currentModel.description}
                </p>

                {/* Especificaciones rápidas */}
                <div ref={specsRef} className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Bebas Neue', color: currentColor.primary }}>{currentModel.specs.engine}</div>
                    <div className="text-md text-gray-600 font-bold" style={{ fontFamily: 'Bebas Neue' }}>CILINDRAJE</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Bebas Neue', color: currentColor.primary }}>{currentModel.specs.maxSpeed}</div>
                    <div className="text-md text-gray-600 font-bold" style={{ fontFamily: 'Bebas Neue' }}>VEL. MAX</div>
                  </div>
                </div>
              </div>

              <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 lg:gap-5 laptop:gap-6 desktop:gap-7 pt-3 laptop-buttons">
                <button
                  onClick={() => setIsQuoteSheetOpen(true)}
                  className="bg-red-600 text-white px-8 lg:px-9 laptop:px-10 desktop:px-11 py-3 lg:py-3.5 laptop:py-4 text-xl lg:text-xl laptop:text-2xl laptop-button font-bold hover:bg-red-700 hover:shadow-lg transition-all duration-300"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  COTIZAR AHORA
                </button>
                <button
                  className="text-white px-8 lg:px-9 laptop:px-10 desktop:px-11 py-3 lg:py-3.5 laptop:py-4 text-xl lg:text-xl laptop:text-2xl laptop-button font-bold hover:shadow-lg transition-all duration-300"
                  style={{
                    fontFamily: 'Bebas Neue',
                    backgroundColor: currentColor.primary
                  }}
                >
                  DONDE COMPRAR
                </button>
              </div>

              {/* Galería Compacta Sin Cuadro */}
              {galleryImages.length > 0 && (
                <div ref={galleryRef} className="pt-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {galleryImages.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => openGallery(index)}
                        className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-gray-400"
                      >
                        <img
                          src={image}
                          alt={`${currentColor.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300"></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout Modular */}
          <div className="lg:hidden min-h-[100vh] pt-12 px-4 pb-8">
            <div className="h-full flex flex-col">

              {/* Área principal con motocicleta y texto superpuesto */}
              <div className="flex-1 relative flex items-center justify-center">

                {/* Controles de colores y ángulos - Pegados a la orilla */}
                <div className="absolute left-2 top-1/4 transform -translate-y-1/2 space-y-8 z-40">
                  <ColorSelector position="mobile" />
                </div>

                <div className="absolute left-2 bottom-1/4 transform translate-y-1/2 z-40">
                  <AngleSelector position="mobile" />
                </div>

                {/* Título móvil superpuesto - Encima de la imagen */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-20">
                  <h1
                    ref={titleRef}
                    className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 tracking-wide"
                    style={{ fontFamily: 'Bebas Neue' }}
                  >
                    VELOCIDAD Y SEGURIDAD
                  </h1>
                  <h2
                    ref={subtitleRef}
                    className="text-3xl sm:text-4xl font-black tracking-wider transform -skew-x-6 transition-colors duration-500"
                    style={{
                      fontFamily: 'Knewave',
                      color: currentColor.primary
                    }}
                  >
                    {currentModel.name}
                  </h2>
                </div>

                {/* Motocicleta centrada */}
                <img
                  ref={bikeRef}
                  src={currentImagePath}
                  alt={`${currentModel.name} ${currentColor.name}`}
                  className="w-[320px] sm:w-[400px] md:w-[450px] h-auto object-contain drop-shadow-2xl transition-all duration-300 mt-12"
                  style={{ filter: isChanging ? 'blur(2px)' : 'none' }}
                />
              </div>

              {/* Área inferior: Galería + Botones */}
              <div className="space-y-4 pb-6">
                {/* Galería */}
                <div className="flex justify-center">
                  <GalleryComponent />
                </div>

                {/* Botones al pie */}
                <div ref={buttonsRef}>
                  <ActionButtons />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos Flotantes Fijos */}

      {/* Flecha Anterior - Flotante Izquierda */}
      <button
        onClick={() => {
          const currentIndex = HERO_CONFIG.models.findIndex(m => m.id === selectedModel);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : HERO_CONFIG.models.length - 1;
          changeModel(HERO_CONFIG.models[prevIndex].id);
        }}
        disabled={isChanging}
        className="fixed left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-30 group"
      >
        <div className="w-14 h-14 bg-black/95 backdrop-blur-md rounded-full border-2 border-gray-700 shadow-xl hover:border-gray-500 transition-all duration-300 hover:scale-110 disabled:opacity-50 flex items-center justify-center">
          {/* Fondo dinámico */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>

          {/* Icono de flecha creativa - CORREGIDO PARA IZQUIERDA */}
          <div className="relative z-10 w-7 h-7 flex items-center justify-center">
            <div className="w-6 h-6 bg-white group-hover:bg-gray-200 transition-colors duration-300" style={{
              clipPath: 'polygon(40% 20%, 40% 35%, 80% 35%, 80% 65%, 40% 65%, 40% 80%, 0% 50%)'
            }}></div>
          </div>

          {/* Efecto de velocidad */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-0.5 bg-red-400 rounded-full"></div>
              <div className="w-1 h-0.5 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </button>

      {/* Flecha Siguiente - Flotante Derecha */}
      <button
        onClick={() => {
          const currentIndex = HERO_CONFIG.models.findIndex(m => m.id === selectedModel);
          const nextIndex = currentIndex < HERO_CONFIG.models.length - 1 ? currentIndex + 1 : 0;
          changeModel(HERO_CONFIG.models[nextIndex].id);
        }}
        disabled={isChanging}
        className="fixed right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-30 group"
      >
        <div className="w-14 h-14 bg-black/95 backdrop-blur-md rounded-full border-2 border-gray-700 shadow-xl hover:border-gray-500 transition-all duration-300 hover:scale-110 disabled:opacity-50 flex items-center justify-center">
          {/* Fondo dinámico */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>

          {/* Icono de flecha creativa - CORREGIDO PARA DERECHA */}
          <div className="relative z-10 w-7 h-7 flex items-center justify-center">
            <div className="w-6 h-6 bg-white group-hover:bg-gray-200 transition-colors duration-300" style={{
              clipPath: 'polygon(60% 20%, 100% 50%, 60% 80%, 60% 65%, 20% 65%, 20% 35%, 60% 35%)'
            }}></div>
          </div>

          {/* Efecto de velocidad */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-0.5">
              <div className="w-1 h-0.5 bg-blue-400 rounded-full"></div>
              <div className="w-1.5 h-0.5 bg-red-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </button>

      {/* Botón Cotizar - Esquina Inferior Derecha */}
      <button
        onClick={() => setIsQuoteSheetOpen(true)}
        className="fixed bottom-6 lg:bottom-8 right-4 lg:right-8 z-40 group"
      >
        <div className="bg-gradient-to-tr from-red-600 to-red-700 text-white p-5 rounded-2xl shadow-2xl border border-red-500/50 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-110">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs font-bold" style={{ fontFamily: 'Bebas Neue' }}>
              COTIZAR
            </span>
          </div>
        </div>
        <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Bebas Neue' }}>
          COTIZAR {currentModel.name}
        </div>
      </button>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group z-10"
          >
            <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Main image */}
          <div className="max-w-4xl max-h-[70vh] relative">
            <img
              src={galleryImages[selectedGalleryImage]}
              alt={`${currentColor.name} ${selectedGalleryImage + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4">
                <div className="flex gap-3">
                  {galleryImages.map((image, index) => (
                    <button
                      key={image}
                      onClick={() => setSelectedGalleryImage(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${selectedGalleryImage === index
                          ? 'ring-2 ring-white scale-110'
                          : 'opacity-70 hover:opacity-100'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${currentColor.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-6 left-6">
            <div className="bg-black/50 backdrop-blur-md rounded-lg px-4 py-2">
              <span className="text-white font-bold" style={{ fontFamily: 'Bebas Neue' }}>
                {selectedGalleryImage + 1} / {galleryImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Model Selector Offcanvas */}
      {isModelSelectorOpen && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-lg">
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            onClick={() => setIsModelSelectorOpen(false)}
          ></div>

          {/* Panel */}
          <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl transform transition-all duration-500 ease-out translate-x-0`}>

            {/* Header */}
            <div className="relative p-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Bebas Neue' }}>
                    EXPLORAR MODELOS
                  </h2>
                  <p className="text-white/60 text-sm mt-1" style={{ fontFamily: 'Bebas Neue' }}>
                    {selectedCategory ? 'SELECCIONA UN MODELO' : 'SELECCIONA UNA CATEGORÍA'}
                  </p>
                </div>

                <button
                  onClick={() => setIsModelSelectorOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Breadcrumb */}
              {selectedCategory && (
                <div className="flex items-center mt-4 text-white/80">
                  <button
                    onClick={resetSelector}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    style={{ fontFamily: 'Bebas Neue' }}
                  >
                    CATEGORÍAS
                  </button>
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span style={{ fontFamily: 'Bebas Neue' }}>
                    {HERO_CONFIG.categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(100vh-200px)]">

              {/* Step 1: Categories */}
              {!selectedCategory && (
                <div className="space-y-4">
                  {HERO_CONFIG.categories.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category.id)}
                      className="group w-full text-left p-6 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/50 hover:from-gray-700/70 hover:to-gray-600/70 hover:border-gray-500 transition-all duration-300 transform hover:scale-102"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl">{category.icon}</div>
                          <div>
                            <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'Bebas Neue' }}>
                              {category.name}
                            </h3>
                            <p className="text-white/60 text-sm mt-1">
                              {category.description}
                            </p>
                            <div className="text-xs text-white/40 mt-2" style={{ fontFamily: 'Bebas Neue' }}>
                              {category.models.length} MODELO{category.models.length > 1 ? 'S' : ''}
                            </div>
                          </div>
                        </div>

                        <svg className="w-6 h-6 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Models */}
              {selectedCategory && (
                <div className="space-y-4">
                  {HERO_CONFIG.categories
                    .find(c => c.id === selectedCategory)
                    ?.models.map((modelId, index) => {
                      const model = HERO_CONFIG.models.find(m => m.id === modelId);
                      if (!model) return null;

                      return (
                        <button
                          key={model.id}
                          onClick={() => selectModelFromCategory(model.id)}
                          className={`group w-full text-left p-6 rounded-2xl border transition-all duration-300 transform hover:scale-102 ${selectedModel === model.id
                              ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/30 border-blue-400/50'
                              : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50 hover:from-gray-700/70 hover:to-gray-600/70 hover:border-gray-500'
                            }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                                <img
                                  src={`/src/assets/bikes/${model.folder}/${model.colors[0].folder}/main.avif`}
                                  alt={model.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'Bebas Neue' }}>
                                  {model.name}
                                </h3>
                                <p className="text-white/60 text-sm mt-1 max-w-xs">
                                  {model.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-white/40" style={{ fontFamily: 'Bebas Neue' }}>
                                  <span>{model.specs.engine}</span>
                                  <span>•</span>
                                  <span>{model.specs.maxSpeed}</span>
                                  <span>•</span>
                                  <span>{model.colors.length} COLORES</span>
                                </div>
                              </div>
                            </div>

                            {selectedModel === model.id && (
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote Sheet para el modelo actual */}
      <QuoteSheetHero
        isOpen={isQuoteSheetOpen}
        onClose={() => setIsQuoteSheetOpen(false)}
        preselectedModel={{
          category: currentModel.id === 'adri-sport' || currentModel.id === 'cg200' ? 'motocicleta' :
            currentModel.id === 'bws' ? 'passola' : 'sport',
          model: currentModel.name,
          color: currentColor.name
        }}
      />
    </section>
  );
}

// Componente QuoteSheet especializado para Hero
function QuoteSheetHero({ isOpen, onClose, preselectedModel }: {
  isOpen: boolean;
  onClose: () => void;
  preselectedModel: {
    category: string;
    model: string;
    color: string;
  }
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });

  const { selectedCountry } = useCountryStore();

  const handleSubmit = () => {
    const quotationData = {
      ...preselectedModel,
      ...formData,
      country: selectedCountry?.name || 'República Dominicana',
      timestamp: new Date().toISOString()
    };

    console.log('Cotización enviada:', quotationData);
    // Aquí enviarías los datos a tu backend

    onClose();
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Sheet */}
      <div className={`relative w-full bg-white rounded-t-3xl shadow-2xl transform transition-all duration-500 ${isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2
                className="text-2xl font-black text-gray-900"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                COTIZAR {preselectedModel.model}
              </h2>
              <p className="text-sm text-gray-600">
                {preselectedModel.color} • {selectedCountry?.name || 'República Dominicana'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Resumen del vehículo */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3
                className="text-lg font-black text-gray-900"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                {preselectedModel.model}
              </h3>
              <p className="text-sm text-gray-600">Color: {preselectedModel.color}</p>
              <p className="text-sm text-gray-600">País: {selectedCountry?.name || 'República Dominicana'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-80 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Información de contacto</h3>

            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors duration-300"
            />

            <input
              type="tel"
              placeholder={`Teléfono (${selectedCountry?.phone || '+1'})`}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors duration-300"
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors duration-300"
            />

            <input
              type="text"
              placeholder="Ciudad"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-red-500 hover:text-red-600 transition-all duration-300"
          >
            CANCELAR
          </button>

          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.phone}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            ENVIAR COTIZACIÓN
          </button>
        </div>
      </div>
    </div>
  );
}