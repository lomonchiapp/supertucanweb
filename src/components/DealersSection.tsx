import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


// Fix Leaflet default marker icon issue in bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Dealer {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: { lat: number; lng: number };
  services: string[];
  hours: string;
  featured?: boolean;
}

const dealersData: Dealer[] = [
  {
    id: 1,
    name: 'Super Tucan Central',
    address: 'Av. Principal 123, Santo Domingo',
    phone: '+1 809-123-4567',
    email: 'central@supertucan.com',
    coordinates: { lat: 18.4861, lng: -69.9312 },
    services: ['Ventas', 'Servicio Tecnico', 'Repuestos'],
    hours: 'Lun-Vie: 8:00-18:00, Sab: 8:00-16:00',
    featured: true,
  },
  {
    id: 2,
    name: 'Moto Center Norte',
    address: 'Calle Comercial 456, Santiago',
    phone: '+1 809-234-5678',
    email: 'norte@supertucan.com',
    coordinates: { lat: 19.4517, lng: -70.697 },
    services: ['Ventas', 'Repuestos'],
    hours: 'Lun-Sab: 9:00-17:00',
  },
  {
    id: 3,
    name: 'Dealer Este',
    address: 'Zona Oriental 789, La Romana',
    phone: '+1 809-345-6789',
    email: 'este@supertucan.com',
    coordinates: { lat: 18.4273, lng: -68.9728 },
    services: ['Ventas', 'Servicio Tecnico'],
    hours: 'Lun-Vie: 8:30-17:30',
  },
  {
    id: 4,
    name: 'Moto Sur',
    address: 'Av. Sur 321, Barahona',
    phone: '+1 809-456-7890',
    email: 'sur@supertucan.com',
    coordinates: { lat: 18.2085, lng: -71.1011 },
    services: ['Ventas'],
    hours: 'Lun-Vie: 9:00-17:00',
  },
];

const DR_CENTER: L.LatLngTuple = [18.7, -70.0];
const DR_ZOOM = 8;

// Component that handles flying to a dealer when selected
function FlyToDealer({ dealer }: { dealer: Dealer | null }) {
  const map = useMap();

  useEffect(() => {
    if (dealer) {
      map.flyTo([dealer.coordinates.lat, dealer.coordinates.lng], 12, {
        duration: 1.2,
      });
    }
  }, [dealer, map]);

  return null;
}

// Custom red marker icon for brand consistency
const redMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'hue-rotate-[140deg] saturate-200 brightness-90',
});

export function DealersSection() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );
    }

    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.5,
          ease: 'power3.out',
        }
      );
    }

    if (mapContainerRef.current) {
      gsap.fromTo(
        mapContainerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
      );
    }
  }, []);

  const filteredDealers = useMemo(
    () =>
      dealersData.filter(
        (dealer) =>
          dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dealer.address.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const handleSelectDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-8">
      {/* Header */}
      <div
        ref={headerRef}
        className="bg-gradient-to-r from-red-700 to-red-900 text-white py-16"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight uppercase">
            ENCUENTRA TU DEALER
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto font-body">
            Localiza el dealer Super Tucan mas cercano a ti. Nuestros socios
            autorizados te brindaran el mejor servicio y asesoramiento
            especializado.
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder="Buscar por ciudad o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-white placeholder-white/40 bg-white/10 border border-white/20 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500/30 text-lg font-body"
            />
            <svg
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Dealer List */}
          <div ref={listRef} className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
              {/* List header */}
              <div className="bg-gray-900 border-b border-white/10 p-6">
                <h2 className="font-display text-2xl font-bold text-white tracking-tight uppercase">
                  NUESTROS DEALERS
                </h2>
                <p className="text-white/40 text-sm font-accent tracking-[0.1em] mt-1">
                  {filteredDealers.length} ubicaciones encontradas
                </p>
              </div>

              {/* List */}
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {filteredDealers.map((dealer) => (
                  <DealerCard
                    key={dealer.id}
                    dealer={dealer}
                    isSelected={selectedDealer?.id === dealer.id}
                    onClick={() => handleSelectDealer(dealer)}
                  />
                ))}
                {filteredDealers.length === 0 && (
                  <div className="p-8 text-center text-white/30 font-body">
                    No se encontraron dealers.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div
              ref={mapContainerRef}
              className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden h-96 lg:h-[600px]"
            >
              <MapContainer
                center={DR_CENTER}
                zoom={DR_ZOOM}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ background: '#1a1a2e' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <FlyToDealer dealer={selectedDealer} />

                {filteredDealers.map((dealer) => (
                  <Marker
                    key={dealer.id}
                    position={[dealer.coordinates.lat, dealer.coordinates.lng]}
                    icon={redMarkerIcon}
                    eventHandlers={{
                      click: () => handleSelectDealer(dealer),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <h3 className="font-bold text-gray-900 text-base mb-1">
                          {dealer.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          {dealer.address}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          {dealer.phone}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {dealer.services.map((service) => (
                            <span
                              key={service}
                              className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-900 border-t border-white/5 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-tight uppercase">
              ¿POR QUE ELEGIR UN DEALER AUTORIZADO?
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto font-body">
              Nuestros dealers autorizados cumplen con los mas altos estandares
              de calidad y servicio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">
                Garantia Oficial
              </h3>
              <p className="text-white/50 font-body">
                Todos los vehiculos incluyen garantia oficial Super Tucan.
              </p>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">
                Tecnicos Certificados
              </h3>
              <p className="text-white/50 font-body">
                Personal especializado y certificado por la fabrica.
              </p>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">
                Repuestos Originales
              </h3>
              <p className="text-white/50 font-body">
                Acceso garantizado a repuestos y accesorios originales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dealer card component
function DealerCard({
  dealer,
  isSelected,
  onClick,
}: {
  dealer: Dealer;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-5 border-b border-white/5 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
        isSelected ? 'bg-red-600/10 border-l-4 border-l-red-600' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">
          {dealer.name}
        </h3>
        {dealer.featured && (
          <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 font-bold tracking-[0.15em] font-accent">
            PRINCIPAL
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-white/50 font-body">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-red-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {dealer.address}
        </div>

        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-red-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {dealer.phone}
        </div>

        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-red-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {dealer.hours}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        {dealer.services.map((service) => (
          <span
            key={service}
            className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full font-accent tracking-wider"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}
