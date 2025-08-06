import { useState, useEffect } from 'react';
import { bikesData } from '@/data/bikes';
import { LazyImage } from './ui/lazy-image';
import { SkyBackground } from './ui/sky-background';
import { useNavigationStore } from '@/store/navigationStore';

// Definición de categorías
const categories = [
  {
    id: 'motocicleta',
    name: 'MOTOCICLETA',
    icon: '🏍️',
    description: 'Potencia y versatilidad para todo terreno',
    models: ['adri-sport', 'cg200']
  },
  {
    id: 'passola',
    name: 'PASSOLA',
    icon: '🛵',
    description: 'Ideal para la ciudad y uso urbano',
    models: ['bws']
  },
  {
    id: 'atv',
    name: 'ATV',
    icon: '🏎️',
    description: 'Aventura y diversión off-road',
    models: [] // Sin modelos por ahora
  },
  {
    id: 'sport',
    name: 'SPORT',
    icon: '🏁',
    description: 'Velocidad y rendimiento deportivo',
    models: ['st-125']
  }
];

export function ModelosSection() {
  const { selectedCategory, setSelectedCategory } = useNavigationStore();
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  
  // Sincronizar con el store cuando cambie la categoría seleccionada
  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  const getModelsForCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return bikesData.filter(bike => category.models.includes(bike.id));
  };

  const currentModels = getModelsForCategory(activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-40">
      {/* Header de la sección */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 pt-16">
          <h1 
            className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight"
            style={{ 
              fontFamily: 'Bebas Neue',
              textShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
            }}
          >
            NUESTROS MODELOS
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Descubre la línea completa de vehículos Super Tucán
          </p>
        </div>
      </div>

      {/* Layout principal con sidebar */}
      <div className="flex">
        {/* Sidebar de categorías */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-md border-r border-gray-700/50 min-h-screen sticky top-0">
          <div className="p-6">
            <h2 
              className="text-2xl font-black text-white mb-6 tracking-wider"
              style={{ fontFamily: 'Bebas Neue' }}
            >
              CATEGORÍAS
            </h2>
            
            {/* Lista de categorías */}
            <div className="space-y-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group w-full text-center py-4 px-6 rounded-xl transition-all duration-300 border-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border-red-500'
                      : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 border-gray-600 hover:border-red-500/50'
                  }`}
                >
                  {/* Solo el nombre de la categoría */}
                  <div 
                    className="text-xl font-black tracking-wider"
                    style={{ fontFamily: 'Bebas Neue' }}
                  >
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal - Modelos */}
        <div className="flex-1">
          {/* Sección con fondo del Hero */}
          <div className="relative">
            <SkyBackground />
            
            <div className="relative z-10 p-6">
              {/* Header de categoría activa */}
              <div className="mb-8">
                <h2 
                  className="text-3xl font-black text-white mb-2"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  {categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <p className="text-gray-300">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>

              {/* Grid de modelos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
                {currentModels.length > 0 ? (
                  currentModels.map((bike) => (
                    <BikeImageCard key={bike.id} bike={bike} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-4xl mb-3">🚧</div>
                    <h3 
                      className="text-2xl font-black text-white mb-2"
                      style={{ fontFamily: 'Bebas Neue' }}
                    >
                      PRÓXIMAMENTE
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Nuevos modelos en desarrollo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card de catálogo funcional para cada modelo
function BikeImageCard({ bike }: { bike: any }) {
  const [selectedColor, setSelectedColor] = useState(bike.colors[0]?.value || 'azul');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentColor = bike.colors.find((c: any) => c.value === selectedColor) || bike.colors[0];
  const mainImage = currentColor?.images?.main || currentColor?.images?.front;

  return (
    <div className="group relative transition-all duration-500">
      
      {/* Imagen principal - SIN ENCASILLAR */}
      <div className="relative mb-4">
        {mainImage && (
          <LazyImage
            src={mainImage}
            alt={`${bike.name} ${currentColor.name}`}
            className="w-full h-auto object-contain transition-all duration-500 hover:scale-105"
            style={{
              filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(239, 68, 68, 0.1))'
            }}
          />
        )}
        
        {/* Badge flotante */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            NUEVO
          </span>
        </div>
        
        {/* Botón expandir flotante */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 shadow-lg"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Información del modelo - Con fondo glassmorphism */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 space-y-3 shadow-lg border border-white/50">
        
        {/* Nombre del modelo */}
        <h3 
          className="text-gray-900 text-xl font-black tracking-wide"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          {bike.name}
        </h3>

        {/* Selector de colores funcional */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Color:</span>
            <span className="text-sm text-gray-600 capitalize">{currentColor.name}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {bike.colors.map((color: any) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-8 h-8 rounded-full border-3 transition-all duration-300 hover:scale-110 ${
                  selectedColor === color.value 
                    ? 'border-red-500 ring-2 ring-red-500/30' 
                    : 'border-gray-300 hover:border-red-400'
                }`}
                style={{ backgroundColor: getColorCode(color.value) }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Información expandible */}
        {isExpanded && (
          <div className="space-y-3 animate-in slide-in-from-top duration-300">
            
            {/* Especificaciones */}
            <div className="bg-gray-100 rounded-lg p-3 space-y-2">
              <h4 className="font-bold text-gray-900 text-sm">Especificaciones:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Motor:</span>
                  <span className="ml-1 font-medium">125-200cc</span>
                </div>
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <span className="ml-1 font-medium">4 Tiempos</span>
                </div>
                <div>
                  <span className="text-gray-500">Arranque:</span>
                  <span className="ml-1 font-medium">Eléctrico</span>
                </div>
                <div>
                  <span className="text-gray-500">Tanque:</span>
                  <span className="ml-1 font-medium">13L</span>
                </div>
              </div>
            </div>

            {/* Características destacadas */}
            <div className="space-y-1">
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Garantía oficial
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Repuestos disponibles
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Servicio técnico
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105">
            COTIZAR
          </button>
          <button className="px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

// Función helper para obtener códigos de color
function getColorCode(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    'azul': '#3B82F6',
    'blanca': '#FFFFFF',
    'blanco': '#FFFFFF',
    'negra': '#1F2937',
    'negro': '#1F2937',
    'roja': '#EF4444',
    'rojo': '#EF4444'
  };
  
  return colorMap[colorName.toLowerCase()] || '#6B7280';
}