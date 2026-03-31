import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArtisticFilter } from './ui/artistic-filter';
import { SkyBackground } from './ui/sky-background';
import { useCountryStore } from '@/store/countryStore';
import { bikesData } from '@/data/bikes';
import type { BikeColor } from '@/types/bikes';

// ---------------------------------------------------------------------------
// HERO_CONFIG -- built dynamically from bikesData
// ---------------------------------------------------------------------------

interface HeroColor {
  id: string;
  name: string;
  folder: string;
  primary: string;
  accent: string;
  gallery: string[];
}

interface HeroModel {
  id: string;
  name: string;
  folder: string;
  description: string;
  category: string;
  specs: { engine: string; maxSpeed: string };
  colors: HeroColor[];
}

function bikeColorToHeroColor(bc: BikeColor): HeroColor {
  // Derive accent by darkening slightly -- use the hex as-is for accent too
  return {
    id: bc.value,
    name: bc.name.toUpperCase(),
    folder: bc.value,
    primary: bc.hex,
    accent: bc.hex,
    gallery: bc.images.additional.map((path) => {
      // path is like "/bikes/ADRI SPORT/azul/1.avif" -- extract just the filename
      const parts = path.split('/');
      return parts[parts.length - 1];
    }),
  };
}

const HERO_CONFIG = {
  categories: [
    {
      id: 'motocicleta',
      name: 'MOTOCICLETA',
      description: 'Potencia y versatilidad para todo terreno',
      models: ['adri-sport', 'cg200'],
    },
    {
      id: 'passola',
      name: 'PASSOLA',
      description: 'Ideal para la ciudad y uso urbano',
      models: ['bws'],
    },
    {
      id: 'sport',
      name: 'SPORT',
      description: 'Velocidad y rendimiento deportivo',
      models: ['st-125'],
    },
  ],

  models: bikesData.map(
    (bike): HeroModel => ({
      id: bike.id,
      name: bike.name,
      folder: bike.name, // folder matches the bike name (e.g. "ADRI SPORT", "BWS")
      description: bike.description.toUpperCase(),
      category: bike.category,
      specs: bike.specs,
      colors: bike.colors.map(bikeColorToHeroColor),
    })
  ),

  angles: [
    { id: 'main', name: 'Principal', file: 'main.avif' },
    { id: 'front', name: 'Frontal', file: 'front.avif' },
  ],
};

// ---------------------------------------------------------------------------
// Helper: image path builder (uses public/bikes/)
// ---------------------------------------------------------------------------

function imagePath(model: HeroModel, color: HeroColor, file: string) {
  return `/bikes/${model.folder}/${color.folder}/${file}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ColorSelector({
  position = 'desktop',
  currentModel,
  selectedColor,
  changeColor,
  isChanging,
}: {
  position?: 'desktop' | 'mobile';
  currentModel: HeroModel;
  selectedColor: string;
  changeColor: (id: string) => void;
  isChanging: boolean;
}) {
  return (
    <div
      className={
        position === 'mobile'
          ? 'bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl'
          : 'bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-700/50'
      }
    >
      {position === 'desktop' && (
        <div className="font-sans text-xs font-bold text-white/80 mb-4 text-center">
          COLORES
        </div>
      )}
      <div className={`flex ${position === 'mobile' ? 'flex-col space-y-2' : 'flex-col space-y-4'}`}>
        {currentModel.colors.map((color) => (
          <button
            key={color.id}
            onClick={() => changeColor(color.id)}
            disabled={isChanging}
            className={`group relative ${position === 'mobile' ? 'w-10 h-10' : 'w-14 h-14'} rounded-full border-2 transition-all duration-300 hover:scale-110 ${
              selectedColor === color.id
                ? 'border-white shadow-xl'
                : 'border-gray-500 hover:border-gray-300'
            }`}
            style={{ backgroundColor: color.primary }}
          >
            {selectedColor === color.id && (
              <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                <svg
                  className={`${position === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-white drop-shadow-md`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {position === 'desktop' && (
              <div className="font-sans absolute -right-20 top-1/2 transform -translate-y-1/2 bg-white text-gray-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-bold">
                {color.name}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function AngleSelector({
  position = 'desktop',
  angles,
  selectedAngle,
  changeAngle,
  isChanging,
}: {
  position?: 'desktop' | 'mobile';
  angles: typeof HERO_CONFIG.angles;
  selectedAngle: string;
  changeAngle: (id: string) => void;
  isChanging: boolean;
}) {
  return (
    <div
      className={
        position === 'mobile'
          ? 'bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl'
          : 'bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-700/50'
      }
    >
      {position === 'desktop' && (
        <div className="font-sans text-xs font-bold text-white/80 mb-4 text-center">VISTA</div>
      )}
      <div className={`flex ${position === 'mobile' ? 'flex-col space-y-2' : 'flex-col space-y-3'}`}>
        {angles.map((angle) => (
          <button
            key={angle.id}
            onClick={() => changeAngle(angle.id)}
            disabled={isChanging}
            className={`font-sans ${position === 'mobile' ? 'px-4 py-2 text-xs' : 'px-5 py-3 text-sm'} font-bold rounded-xl transition-all duration-300 ${
              selectedAngle === angle.id
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {position === 'mobile' ? (angle.id === 'main' ? '3D' : 'FRONT') : angle.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryComponent({
  galleryImages,
  currentColorName,
  galleryRef,
  openGallery,
}: {
  galleryImages: string[];
  currentColorName: string;
  galleryRef?: React.RefObject<HTMLDivElement | null>;
  openGallery: (index: number) => void;
}) {
  if (galleryImages.length === 0) return null;
  return (
    <div ref={galleryRef} className="flex gap-2 overflow-x-auto">
      {galleryImages.map((image, index) => (
        <button
          key={image}
          onClick={() => openGallery(index)}
          className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white/5 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-white/30"
        >
          <img
            src={image}
            alt={`${currentColorName} ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
        </button>
      ))}
    </div>
  );
}

function ActionButtons({
  currentColor,
  onQuote,
}: {
  currentColor: HeroColor;
  onQuote?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button
        onClick={onQuote}
        className="font-sans flex-1 bg-gray-900 text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
      >
        SABER MAS
      </button>
      <button
        className="font-sans flex-1 text-white px-8 py-4 text-lg font-bold hover:shadow-lg transition-all duration-300"
        style={{ backgroundColor: currentColor.primary }}
      >
        DONDE COMPRAR
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero (main export)
// ---------------------------------------------------------------------------

export function Hero() {
  const [selectedModel, setSelectedModel] = useState('adri-sport');
  const [selectedColor, setSelectedColor] = useState('azul');
  const [selectedAngle, setSelectedAngle] = useState('main');
  const [isChanging, setIsChanging] = useState(false);

  // Desktop-only refs (mobile works without GSAP refs)
  const bikeDesktopRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleDesktopRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const angleMenuRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentModel = HERO_CONFIG.models.find((m) => m.id === selectedModel) || HERO_CONFIG.models[0];
  const currentColor = currentModel.colors.find((c) => c.id === selectedColor) || currentModel.colors[0];
  const currentAngle = HERO_CONFIG.angles.find((a) => a.id === selectedAngle) || HERO_CONFIG.angles[0];
  const currentImagePath = imagePath(currentModel, currentColor, currentAngle.file);

  // Gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);

  // Model selector state
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Quote sheet state
  const [isQuoteSheetOpen, setIsQuoteSheetOpen] = useState(false);

  // Gallery images for the current color
  const galleryImages = currentColor.gallery.map((file) =>
    imagePath(currentModel, currentColor, file)
  );

  // ------- Animation helpers -------

  const changeModel = (modelId: string) => {
    if (modelId === selectedModel || isChanging) return;
    setIsChanging(true);

    const elementsToAnimate = [
      bikeDesktopRef.current,
      subtitleDesktopRef.current,
      descriptionRef.current,
      specsRef.current,
      galleryRef.current,
      colorMenuRef.current,
    ].filter(Boolean);

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

    const tl = gsap.timeline();

    tl.to(elementsToAnimate, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      stagger: 0.05,
    }, 0);

    tl.fromTo(
      logoElement,
      { opacity: 0, scale: 0.5, rotation: -180 },
      { opacity: 1, scale: 1.2, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' },
      0.2
    );

    tl.call(
      () => {
        setSelectedModel(modelId);
        const newModel = HERO_CONFIG.models.find((m) => m.id === modelId);
        if (newModel && newModel.colors.length > 0) {
          setSelectedColor(newModel.colors[0].id);
        }
        setSelectedAngle('main');
      },
      [],
      0.6
    );

    tl.to(logoElement, { opacity: 0, scale: 0.8, duration: 0.3 }, 0.8);

    tl.fromTo(
      elementsToAnimate,
      { opacity: 0, y: -20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.2)',
        stagger: 0.05,
        onComplete: () => {
          document.body.removeChild(logoElement);
          setIsChanging(false);
        },
      },
      1.1
    );
  };

  const changeColor = (colorId: string) => {
    if (colorId === selectedColor || isChanging) return;
    setIsChanging(true);

    if (bikeDesktopRef.current) {
      gsap.to(bikeDesktopRef.current, {
        scale: 0.8,
        opacity: 0,
        rotation: -10,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setSelectedColor(colorId);
          gsap.to(bikeDesktopRef.current, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
            onComplete: () => setIsChanging(false),
          });
        },
      });
    } else {
      setSelectedColor(colorId);
      setIsChanging(false);
    }
  };

  const changeAngle = (angleId: string) => {
    if (angleId === selectedAngle || isChanging) return;
    setIsChanging(true);

    if (bikeDesktopRef.current) {
      gsap.to(bikeDesktopRef.current, {
        rotationY: angleId === 'front' ? 25 : 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setSelectedAngle(angleId);
          gsap.to(bikeDesktopRef.current, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => setIsChanging(false),
          });
        },
      });
    } else {
      setSelectedAngle(angleId);
      setIsChanging(false);
    }
  };

  // ------- Initial GSAP animations (desktop only) -------

  useEffect(() => {
    if (bikeDesktopRef.current) {
      gsap.fromTo(
        bikeDesktopRef.current,
        { x: -200, opacity: 0, rotation: -5 },
        { x: 0, opacity: 1, rotation: 0, duration: 1.5, ease: 'power3.out' }
      );
      gsap.to(bikeDesktopRef.current, {
        y: -10,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(bikeDesktopRef.current, {
        rotation: 1,
        duration: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    if (titleRef.current && subtitleDesktopRef.current && buttonsRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo(subtitleDesktopRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .fromTo(buttonsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4');
    }

    if (colorMenuRef.current && angleMenuRef.current) {
      gsap.fromTo(
        [colorMenuRef.current, angleMenuRef.current],
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.5 }
      );
    }
  }, []);

  // ------- Gallery helpers -------

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

  // ------- Model selector helpers -------

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

  // ------- Render -------

  return (
    <section className="relative min-h-screen laptop-hero-height overflow-hidden">
      {/* Sky background */}
      <SkyBackground />

      {/* Bottom fade */}

      {/* Artistic filter */}
      <ArtisticFilter />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen laptop-hero-content flex items-center pt-8 lg:pt-4">
        <div className="max-w-7xl mx-auto px-6 w-full">

          {/* ================ Desktop Layout ================ */}
          <div className="hidden lg:grid lg:grid-cols-[auto_1fr_1fr] gap-0 items-center laptop-hero-grid">

            {/* Col 1: Controles laterales (solo color + vista) */}
            <div ref={colorMenuRef} className="flex flex-col items-center gap-6 pr-4 self-center">
              <ColorSelector
                position="desktop"
                currentModel={currentModel}
                selectedColor={selectedColor}
                changeColor={changeColor}
                isChanging={isChanging}
              />
              <div ref={angleMenuRef}>
                <AngleSelector
                  position="desktop"
                  angles={HERO_CONFIG.angles}
                  selectedAngle={selectedAngle}
                  changeAngle={changeAngle}
                  isChanging={isChanging}
                />
              </div>
            </div>

            {/* Col 2: Imagen de la moto con flechas prev/next a los lados */}
            <div className="relative flex items-center justify-center h-[480px] laptop:h-[520px] desktop:h-[560px] xl:h-[600px]">
              {/* Splash / halo */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[40%] w-[110%] aspect-[4/3] pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse 70% 55% at 50% 60%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, transparent 70%),
                    radial-gradient(ellipse 90% 40% at 50% 80%, rgba(255,255,255,0.05) 0%, transparent 60%)
                  `,
                }}
              />
              {/* Reflejo de piso */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)',
                }}
              />

              {/* Flecha izquierda */}
              <button
                onClick={() => {
                  const ci = HERO_CONFIG.models.findIndex((m) => m.id === selectedModel);
                  changeModel(HERO_CONFIG.models[ci > 0 ? ci - 1 : HERO_CONFIG.models.length - 1].id);
                }}
                disabled={isChanging}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 hover:border-white/30 transition-all duration-200 disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Imagen */}
              <img
                ref={bikeDesktopRef}
                src={currentImagePath}
                alt={`${currentModel.name} ${currentColor.name}`}
                className="relative z-10 max-w-[85%] max-h-full object-contain drop-shadow-2xl transition-all duration-300"
                style={{ filter: isChanging ? 'blur(2px)' : 'none' }}
              />

              {/* Flecha derecha */}
              <button
                onClick={() => {
                  const ci = HERO_CONFIG.models.findIndex((m) => m.id === selectedModel);
                  changeModel(HERO_CONFIG.models[ci < HERO_CONFIG.models.length - 1 ? ci + 1 : 0].id);
                }}
                disabled={isChanging}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 hover:border-white/30 transition-all duration-200 disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Col 3: Texto */}
            <div className="space-y-4 pl-8 self-center">
              <div>
                <h2
                  ref={subtitleDesktopRef}
                  className="font-display text-7xl lg:text-8xl desktop:text-9xl xl:text-[10rem] font-bold leading-[0.85] tracking-tight transition-colors duration-500 uppercase"
                  style={{ color: currentColor.primary }}
                >
                  {currentModel.name}
                </h2>
              </div>

              {/* Description */}
              <div ref={descriptionRef} className="space-y-4">
                <p className="font-sans text-gray-400 text-lg lg:text-xl leading-relaxed max-w-md font-medium">
                  {currentModel.description}
                </p>

                {/* Quick specs */}
                <div ref={specsRef} className="grid grid-cols-2 gap-3 max-w-md">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="font-accent text-2xl font-black" style={{ color: currentColor.primary }}>
                      {currentModel.specs.engine}
                    </div>
                    <div className="font-sans text-xs text-gray-500 font-bold tracking-wider">CILINDRAJE</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="font-accent text-2xl font-black" style={{ color: currentColor.primary }}>
                      {currentModel.specs.maxSpeed}
                    </div>
                    <div className="font-sans text-xs text-gray-500 font-bold tracking-wider">VEL. MAX</div>
                  </div>
                </div>
              </div>

              <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 pt-4 laptop-buttons">
                <button
                  onClick={() => setIsQuoteSheetOpen(true)}
                  className="font-sans bg-red-600 text-white px-8 py-3 text-base font-bold tracking-wider hover:bg-red-700 transition-all duration-300 uppercase"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}
                >
                  COTIZAR AHORA
                </button>
                <button
                  className="font-sans border border-white/20 text-white px-8 py-3 text-base font-bold tracking-wider hover:bg-white/10 transition-all duration-300 uppercase"
                  style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0% 100%)' }}
                >
                  DONDE COMPRAR
                </button>
              </div>

              {/* Gallery thumbnails */}
              {galleryImages.length > 0 && (
                <div className="pt-4">
                  <GalleryComponent
                    galleryImages={galleryImages}
                    currentColorName={currentColor.name}
                    galleryRef={galleryRef}
                    openGallery={openGallery}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ================ Mobile Layout ================ */}
          <div className="lg:hidden min-h-[100vh] pt-12 px-4 pb-8">
            <div className="h-full flex flex-col">

              {/* Main area with bike and overlaid text */}
              <div className="relative h-[400px] sm:h-[450px] flex items-center justify-center">

                {/* Color & angle controls - pinned to left edge */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-6 z-40">
                  <ColorSelector
                    position="mobile"
                    currentModel={currentModel}
                    selectedColor={selectedColor}
                    changeColor={changeColor}
                    isChanging={isChanging}
                  />
                  <AngleSelector
                    position="mobile"
                    angles={HERO_CONFIG.angles}
                    selectedAngle={selectedAngle}
                    changeAngle={changeAngle}
                    isChanging={isChanging}
                  />
                </div>

                {/* Mobile title overlay */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-20">
                  <h1
                    ref={titleRef}
                    className="font-accent text-xs sm:text-sm font-bold text-gray-500 mb-1 tracking-[0.3em] uppercase"
                  >
                    VELOCIDAD Y SEGURIDAD
                  </h1>
                  <h2
                    className="font-display text-4xl sm:text-5xl font-bold tracking-tight transition-colors duration-500 uppercase leading-[0.85]"
                    style={{ color: currentColor.primary }}
                  >
                    {currentModel.name}
                  </h2>
                </div>

                {/* Splash detrás de la moto (mobile) */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[35%] w-[100%] aspect-square pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 70%),
                      radial-gradient(ellipse 80% 35% at 50% 80%, rgba(255,255,255,0.04) 0%, transparent 60%)
                    `,
                  }}
                />

                {/* Bike image (mobile -- no GSAP ref, height constrained) */}
                <img
                  src={currentImagePath}
                  alt={`${currentModel.name} ${currentColor.name}`}
                  className="relative z-10 max-w-[85%] max-h-[300px] sm:max-h-[350px] object-contain drop-shadow-2xl transition-all duration-300 mt-16"
                  style={{ filter: isChanging ? 'blur(2px)' : 'none' }}
                />
              </div>

              {/* Bottom area: gallery + buttons */}
              <div className="space-y-4 pb-6">
                <div className="flex justify-center">
                  <GalleryComponent
                    galleryImages={galleryImages}
                    currentColorName={currentColor.name}
                    openGallery={openGallery}
                  />
                </div>

                <div>
                  <ActionButtons currentColor={currentColor} onQuote={() => setIsQuoteSheetOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows and cotizar now integrated in grid layout above */}

      {/* ================ Gallery Modal ================ */}
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
          <div className="flex items-center justify-center max-w-[90vw] max-h-[70vh]">
            <img
              src={galleryImages[selectedGalleryImage]}
              alt={`${currentColor.name} ${selectedGalleryImage + 1}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
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
                      className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                        selectedGalleryImage === index
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
              <span className="font-sans text-white font-bold">
                {selectedGalleryImage + 1} / {galleryImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================ Model Selector Offcanvas ================ */}
      {isModelSelectorOpen && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-lg">
          {/* Backdrop */}
          <div className="fixed inset-0" onClick={() => setIsModelSelectorOpen(false)} />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl transform transition-all duration-500 ease-out translate-x-0">

            {/* Header */}
            <div className="relative p-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-sans text-2xl font-black text-white">
                    EXPLORAR MODELOS
                  </h2>
                  <p className="font-sans text-white/60 text-sm mt-1">
                    {selectedCategory ? 'SELECCIONA UN MODELO' : 'SELECCIONA UNA CATEGORIA'}
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
                    className="font-sans text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    CATEGORIAS
                  </button>
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-sans">
                    {HERO_CONFIG.categories.find((c) => c.id === selectedCategory)?.name}
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
                          <div>
                            <h3 className="font-sans text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-white/60 text-sm mt-1">
                              {category.description}
                            </p>
                            <div className="font-sans text-xs text-white/40 mt-2">
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
                    .find((c) => c.id === selectedCategory)
                    ?.models.map((modelId, index) => {
                      const model = HERO_CONFIG.models.find((m) => m.id === modelId);
                      if (!model) return null;

                      return (
                        <button
                          key={model.id}
                          onClick={() => selectModelFromCategory(model.id)}
                          className={`group w-full text-left p-6 rounded-2xl border transition-all duration-300 transform hover:scale-102 ${
                            selectedModel === model.id
                              ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/30 border-blue-400/50'
                              : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50 hover:from-gray-700/70 hover:to-gray-600/70 hover:border-gray-500'
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                                <img
                                  src={`/bikes/${model.folder}/${model.colors[0].folder}/main.avif`}
                                  alt={model.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-sans text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                                  {model.name}
                                </h3>
                                <p className="text-white/60 text-sm mt-1 max-w-xs">
                                  {model.description}
                                </p>
                                <div className="font-sans flex items-center space-x-4 mt-2 text-xs text-white/40">
                                  <span>{model.specs.engine}</span>
                                  <span>&#8226;</span>
                                  <span>{model.specs.maxSpeed}</span>
                                  <span>&#8226;</span>
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

      {/* Quote Sheet for the current model */}
      <QuoteSheetHero
        isOpen={isQuoteSheetOpen}
        onClose={() => setIsQuoteSheetOpen(false)}
        preselectedModel={{
          category: currentModel.category,
          model: currentModel.name,
          color: currentColor.name,
        }}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// QuoteSheetHero
// ---------------------------------------------------------------------------

function QuoteSheetHero({
  isOpen,
  onClose,
  preselectedModel,
}: {
  isOpen: boolean;
  onClose: () => void;
  preselectedModel: {
    category: string;
    model: string;
    color: string;
  };
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
  });

  const { selectedCountry } = useCountryStore();

  const handleSubmit = () => {
    const whatsappNumber = '18091234567'; // Super Tucán main number
    const message = encodeURIComponent(
      `🏍️ *Cotización Super Tucán*\n\n` +
      `*Modelo:* ${preselectedModel.model}\n` +
      `*Color:* ${preselectedModel.color}\n` +
      `*Nombre:* ${formData.name}\n` +
      `*Teléfono:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Ciudad:* ${formData.city}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

    onClose();
    setFormData({ name: '', phone: '', email: '', city: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`relative w-full bg-white rounded-t-3xl shadow-2xl transform transition-all duration-500 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-sans text-2xl font-black text-gray-900">
                COTIZAR {preselectedModel.model}
              </h2>
              <p className="text-sm text-gray-600">
                {preselectedModel.color} &bull; {selectedCountry?.name || 'Republica Dominicana'}
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

        {/* Vehicle summary */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-sans text-lg font-black text-gray-900">
                {preselectedModel.model}
              </h3>
              <p className="text-sm text-gray-600">Color: {preselectedModel.color}</p>
              <p className="text-sm text-gray-600">
                Pais: {selectedCountry?.name || 'Republica Dominicana'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-80 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Informacion de contacto</h3>

            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors duration-300"
            />

            <input
              type="tel"
              placeholder={`Telefono (${selectedCountry?.phone || '+1'})`}
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
            ENVIAR COTIZACION
          </button>
        </div>
      </div>
    </div>
  );
}
