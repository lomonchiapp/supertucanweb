import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Datos de ejemplo de dealers
const dealersData = [
  {
    id: 1,
    name: "Super Tucán Central",
    address: "Av. Principal 123, Santo Domingo",
    phone: "+1 809-123-4567",
    email: "central@supertucan.com",
    coordinates: { lat: 18.4861, lng: -69.9312 },
    services: ["Ventas", "Servicio Técnico", "Repuestos"],
    hours: "Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00",
    featured: true
  },
  {
    id: 2,
    name: "Moto Center Norte",
    address: "Calle Comercial 456, Santiago",
    phone: "+1 809-234-5678",
    email: "norte@supertucan.com",
    coordinates: { lat: 19.4517, lng: -70.6970 },
    services: ["Ventas", "Repuestos"],
    hours: "Lun-Sáb: 9:00-17:00"
  },
  {
    id: 3,
    name: "Dealer Este",
    address: "Zona Oriental 789, La Romana",
    phone: "+1 809-345-6789",
    email: "este@supertucan.com",
    coordinates: { lat: 18.4273, lng: -68.9728 },
    services: ["Ventas", "Servicio Técnico"],
    hours: "Lun-Vie: 8:30-17:30"
  },
  {
    id: 4,
    name: "Moto Sur",
    address: "Av. Sur 321, Barahona",
    phone: "+1 809-456-7890",
    email: "sur@supertucan.com",
    coordinates: { lat: 18.2085, lng: -71.1011 },
    services: ["Ventas"],
    hours: "Lun-Vie: 9:00-17:00"
  }
];

export function DealersSection() {
  const [selectedDealer, setSelectedDealer] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animaciones de entrada
    if (headerRef.current) {
      gsap.fromTo(headerRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }

    if (listRef.current) {
      gsap.fromTo(listRef.current.children,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "power3.out" }
      );
    }

    if (mapRef.current) {
      gsap.fromTo(mapRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
      );
    }
  }, []);

  const filteredDealers = dealersData.filter(dealer =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-40">
      
      {/* Header */}
      <div ref={headerRef} className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            style={{ fontFamily: 'Bebas Neue' }}
          >
            ENCUENTRA TU DEALER
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Localiza el dealer Super Tucán más cercano a ti. Nuestros socios autorizados 
            te brindarán el mejor servicio y asesoramiento especializado.
          </p>
          
          {/* Buscador */}
          <div className="max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder="Buscar por ciudad o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 bg-white shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
            />
            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Lista de Dealers */}
          <div ref={listRef} className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              
              {/* Header de la lista */}
              <div className="bg-gray-900 text-white p-6">
                <h2 
                  className="text-2xl font-black mb-2"
                  style={{ fontFamily: 'Bebas Neue' }}
                >
                  NUESTROS DEALERS
                </h2>
                <p className="text-gray-300 text-sm">
                  {filteredDealers.length} ubicaciones encontradas
                </p>
              </div>

              {/* Lista */}
              <div className="max-h-96 overflow-y-auto">
                {filteredDealers.map((dealer) => (
                  <DealerCard
                    key={dealer.id}
                    dealer={dealer}
                    isSelected={selectedDealer === dealer.id}
                    onClick={() => setSelectedDealer(dealer.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <div ref={mapRef} className="bg-white rounded-3xl shadow-xl overflow-hidden h-96 lg:h-[600px]">
              <InteractiveMap 
                dealers={filteredDealers}
                selectedDealer={selectedDealer}
                onSelectDealer={setSelectedDealer}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-black text-gray-900 mb-4"
              style={{ fontFamily: 'Bebas Neue' }}
            >
              ¿POR QUÉ ELEGIR UN DEALER AUTORIZADO?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestros dealers autorizados cumplen con los más altos estándares de calidad y servicio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Garantía Oficial</h3>
              <p className="text-gray-600">Todos los vehículos incluyen garantía oficial Super Tucán.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Técnicos Certificados</h3>
              <p className="text-gray-600">Personal especializado y certificado por la fábrica.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Repuestos Originales</h3>
              <p className="text-gray-600">Acceso garantizado a repuestos y accesorios originales.</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

// Componente para cada card de dealer
function DealerCard({ dealer, isSelected, onClick }: {
  dealer: any;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-6 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-gray-50 ${
        isSelected ? 'bg-red-50 border-l-4 border-l-red-600' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-lg">{dealer.name}</h3>
        {dealer.featured && (
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
            PRINCIPAL
          </span>
        )}
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {dealer.address}
        </div>
        
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {dealer.phone}
        </div>
        
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {dealer.hours}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-3">
        {dealer.services.map((service: string) => (
          <span
            key={service}
            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}

// Componente de mapa simplificado (versión sin API real)
function InteractiveMap({ dealers, selectedDealer, onSelectDealer }: {
  dealers: any[];
  selectedDealer: number | null;
  onSelectDealer: (id: number) => void;
}) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
      
      {/* Fondo del mapa estilizado */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* República Dominicana simplificada */}
          <path
            d="M50 100 L350 100 L350 200 L50 200 Z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="2"
          />
          {/* Líneas de grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10B981" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Marcadores de dealers */}
      <div className="absolute inset-0">
        {dealers.map((dealer, index) => (
          <div
            key={dealer.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 ${
              selectedDealer === dealer.id ? 'scale-125 z-10' : 'z-0'
            }`}
            style={{
              left: `${20 + (index * 20)}%`,
              top: `${30 + (index * 15)}%`
            }}
            onClick={() => onSelectDealer(dealer.id)}
          >
            <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
              selectedDealer === dealer.id ? 'bg-red-600' : 'bg-red-500'
            }`}>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            
            {/* Tooltip */}
            {selectedDealer === dealer.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl p-3 min-w-48">
                <div className="font-bold text-gray-900 text-sm">{dealer.name}</div>
                <div className="text-gray-600 text-xs">{dealer.address}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mensaje central */}
      <div className="text-center text-gray-600">
        <div className="text-4xl mb-2">🗺️</div>
        <div 
          className="text-xl font-black mb-2"
          style={{ fontFamily: 'Bebas Neue' }}
        >
          MAPA INTERACTIVO
        </div>
        <div className="text-sm">
          Haz clic en los marcadores para ver detalles
        </div>
      </div>

    </div>
  );
}