import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useCountryStore } from '@/store/countryStore';

// Datos de ejemplo para repuestos
const PARTS_CATEGORIES = [
  {
    id: 'motor',
    name: 'Motor',
    icon: '⚙️',
    description: 'Repuestos para motor y transmisión',
    count: 45
  },
  {
    id: 'carroceria',
    name: 'Carrocería',
    icon: '🛡️',
    description: 'Plasticos, carenados y accesorios externos',
    count: 32
  },
  {
    id: 'electrico',
    name: 'Sistema Eléctrico',
    icon: '🔌',
    description: 'Componentes eléctricos y electrónicos',
    count: 28
  },
  {
    id: 'frenos',
    name: 'Frenos',
    icon: '🛑',
    description: 'Pastillas, discos y componentes de freno',
    count: 19
  },
  {
    id: 'suspension',
    name: 'Suspensión',
    icon: '🔧',
    description: 'Amortiguadores y componentes de suspensión',
    count: 15
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    icon: '✨',
    description: 'Accesorios y personalización',
    count: 67
  }
];

const SAMPLE_PARTS = [
  {
    id: 1,
    name: 'Filtro de Aceite Original',
    category: 'motor',
    model: 'ADRI SPORT / BWS / CG200',
    price: 25.99,
    originalPrice: 32.99,
    image: '/api/placeholder/300/200',
    inStock: true,
    discount: 20,
    featured: true
  },
  {
    id: 2,
    name: 'Pastillas de Freno Delanteras',
    category: 'frenos',
    model: 'ADRI SPORT',
    price: 45.99,
    originalPrice: null,
    image: '/api/placeholder/300/200',
    inStock: true,
    discount: 0,
    featured: true
  },
  {
    id: 3,
    name: 'Carenado Lateral Izquierdo',
    category: 'carroceria',
    model: 'BWS',
    price: 89.99,
    originalPrice: 109.99,
    image: '/api/placeholder/300/200',
    inStock: false,
    discount: 18,
    featured: false
  },
  {
    id: 4,
    name: 'Bombillo LED H4',
    category: 'electrico',
    model: 'Universal',
    price: 15.99,
    originalPrice: null,
    image: '/api/placeholder/300/200',
    inStock: true,
    discount: 0,
    featured: true
  }
];

export function PartesSection() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [cartItems, setCartItems] = useState<number[]>([]);
  const { selectedCountry } = useCountryStore();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animaciones de entrada
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }

    if (categoriesRef.current) {
      gsap.fromTo(categoriesRef.current.children,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "back.out(1.7)" }
      );
    }

    if (productsRef.current) {
      gsap.fromTo(productsRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 1, ease: "power3.out" }
      );
    }
  }, []);

  const addToCart = (partId: number) => {
    setCartItems(prev => [...prev, partId]);
  };

  const filteredParts = selectedCategory === 'todos' 
    ? SAMPLE_PARTS 
    : SAMPLE_PARTS.filter(part => part.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-40">
      
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[url('/bg.avif')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto Principal */}
            <div>
              <h1 
                className="text-5xl lg:text-7xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"
                style={{ fontFamily: 'Bebas Neue' }}
              >
                REPUESTOS ORIGINALES
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Encuentra repuestos originales y accesorios para tu Super Tucán. 
                <span className="text-red-400 font-bold"> Calidad garantizada</span> y 
                <span className="text-red-400 font-bold"> entrega rápida</span> en toda Latinoamérica.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold">Repuestos Originales</span>
                </div>
                <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold">Envío a {selectedCountry?.name || 'tu país'}</span>
                </div>
                <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold">Garantía de 6 meses</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105" style={{ fontFamily: 'Bebas Neue' }}>
                  EXPLORAR CATÁLOGO
                </button>
                <button className="border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300">
                  CONTACTAR DEALER
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                <div className="text-3xl font-black text-red-400 mb-2" style={{ fontFamily: 'Bebas Neue' }}>
                  200+
                </div>
                <div className="text-sm text-gray-300">Repuestos Disponibles</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                <div className="text-3xl font-black text-red-400 mb-2" style={{ fontFamily: 'Bebas Neue' }}>
                  12
                </div>
                <div className="text-sm text-gray-300">Países con Envío</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                <div className="text-3xl font-black text-red-400 mb-2" style={{ fontFamily: 'Bebas Neue' }}>
                  24h
                </div>
                <div className="text-sm text-gray-300">Tiempo de Procesamiento</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                <div className="text-3xl font-black text-red-400 mb-2" style={{ fontFamily: 'Bebas Neue' }}>
                  95%
                </div>
                <div className="text-sm text-gray-300">Satisfacción del Cliente</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div ref={categoriesRef} className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 
            className="text-4xl lg:text-5xl font-black text-center text-white mb-12"
            style={{ fontFamily: 'Bebas Neue' }}
          >
            CATEGORÍAS DE REPUESTOS
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'todos'
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-red-500'
              }`}
            >
              <div className="text-3xl mb-3">📦</div>
              <div className="text-lg font-black mb-1" style={{ fontFamily: 'Bebas Neue' }}>
                TODOS
              </div>
              <div className="text-sm opacity-75">Ver todo</div>
            </button>

            {PARTS_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-red-500'
                }`}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <div className="text-lg font-black mb-1" style={{ fontFamily: 'Bebas Neue' }}>
                  {category.name}
                </div>
                <div className="text-sm opacity-75">{category.count} productos</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos */}
      <div ref={productsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h3 
              className="text-3xl font-black text-white"
              style={{ fontFamily: 'Bebas Neue' }}
            >
              {selectedCategory === 'todos' ? 'PRODUCTOS DESTACADOS' : `REPUESTOS DE ${PARTS_CATEGORIES.find(c => c.id === selectedCategory)?.name.toUpperCase()}`}
            </h3>
            <div className="text-gray-400">
              {filteredParts.length} productos encontrados
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredParts.map((part) => (
              <div key={part.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2">
                {/* Imagen del producto */}
                <div className="relative h-48 bg-gray-700 overflow-hidden">
                  {part.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      -{part.discount}%
                    </div>
                  )}
                  {!part.inStock && (
                    <div className="absolute top-3 right-3 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      Agotado
                    </div>
                  )}
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-6">
                  <h4 className="text-lg font-black text-white mb-2" style={{ fontFamily: 'Bebas Neue' }}>
                    {part.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Compatible: {part.model}
                  </p>

                  {/* Precio */}
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-black text-red-400" style={{ fontFamily: 'Bebas Neue' }}>
                      ${part.price}
                    </span>
                    {part.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${part.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(part.id)}
                      disabled={!part.inStock}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                        part.inStock
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {part.inStock ? 'AGREGAR' : 'AGOTADO'}
                    </button>
                    <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carrito flotante */}
          {cartItems.length > 0 && (
            <div className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-2xl shadow-2xl z-50">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="font-bold">{cartItems.length} item(s)</span>
                <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300">
                  VER CARRITO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-4xl lg:text-5xl font-black text-white mb-6"
            style={{ fontFamily: 'Bebas Neue' }}
          >
            ¿NO ENCUENTRAS LO QUE BUSCAS?
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Nuestro equipo de soporte puede ayudarte a encontrar el repuesto exacto que necesitas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105">
              CONTACTAR SOPORTE
            </button>
            <button className="border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300">
              VER DEALERS
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}