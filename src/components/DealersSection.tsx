import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
    name: 'Importadora Oriental Ramirez',
    address: 'Av. Francisco A. Caamaño, San Pedro de Macorís',
    phone: '(809) 526-1515',
    email: 'info@orientalramirez.com',
    coordinates: { lat: 18.4614093, lng: -69.3142985 },
    services: ['dealers.services.sales', 'dealers.services.service', 'dealers.services.parts'],
    hours: 'Lun–Vie: 8:00–18:00 · Sáb: 9:00–14:00',
    featured: true,
  },
  {
    id: 2,
    name: 'Auto Motoprestamos Oriental',
    address: 'Calle José Martí #45, San Pedro de Macorís',
    phone: '(809) 526-1414',
    email: 'info@orientalramirez.com',
    coordinates: { lat: 18.4566342, lng: -69.296238 },
    services: ['dealers.services.sales', 'dealers.services.service'],
    hours: 'Lun–Vie: 8:00–18:00 · Sáb: 9:00–14:00',
  },
  {
    id: 3,
    name: 'Motoprestamos Oriental Higüey',
    address: 'Carretera Mella, La Altagracia, Higüey',
    phone: '(809) 554-1414',
    email: 'info@orientalramirez.com',
    coordinates: { lat: 18.616932, lng: -68.706924 },
    services: ['dealers.services.sales', 'dealers.services.service'],
    hours: 'Lun–Vie: 8:00–18:00 · Sáb: 9:00–14:00',
  },
  {
    id: 4,
    name: 'Oriental Ramirez André',
    address: 'Av. Duarte, Boca Chica',
    phone: '(809) 523-1414',
    email: 'info@orientalramirez.com',
    coordinates: { lat: 18.444086, lng: -69.632469 },
    services: ['dealers.services.sales', 'dealers.services.service'],
    hours: 'Lun–Vie: 8:00–18:00 · Sáb: 9:00–14:00',
  },
  {
    id: 5,
    name: 'Oriental Ramirez Bonao',
    address: 'Av. Aniana Vargas, Bonao',
    phone: '(809) 525-1414',
    email: 'info@orientalramirez.com',
    coordinates: { lat: 18.939554, lng: -70.404884 },
    services: ['dealers.services.sales', 'dealers.services.service'],
    hours: 'Lun–Vie: 8:00–18:00 · Sáb: 9:00–14:00',
  },
];

const DR_CENTER: L.LatLngTuple = [18.7, -70.0];
const DR_ZOOM = 8;

function FlyToDealer({ dealer }: { dealer: Dealer | null }) {
  const map = useMap();
  useEffect(() => {
    if (dealer) {
      map.flyTo([dealer.coordinates.lat, dealer.coordinates.lng], 12, { duration: 1.2 });
    }
  }, [dealer, map]);
  return null;
}

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
  const { t } = useTranslation();
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.3, ease: 'power3.out' }
      );
    }
    if (mapContainerRef.current) {
      gsap.fromTo(
        mapContainerRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out' }
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
    <div className="min-h-screen bg-white">
      {/* ══════════ Hero ══════════ */}
      <div
        ref={headerRef}
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-neutral-900 text-white py-20"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(255,255,255,0.6) 14px, rgba(255,255,255,0.6) 15px)',
          }}
        />
        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[2px] w-10 bg-white/70" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-white/90 font-accent">
              {t('dealers.hero.eyebrow')}
            </span>
            <div className="h-[2px] w-10 bg-white/70" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight uppercase mb-5 leading-[0.95]">
            {t('dealers.hero.title')}
          </h1>
          <p className="text-lg text-white/80 mb-10 max-w-3xl mx-auto font-sans leading-relaxed">
            {t('dealers.hero.description')}
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder={t('dealers.hero.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 text-neutral-900 placeholder-neutral-400 bg-white border-2 border-transparent shadow-xl focus:outline-none focus:border-white/50 text-base font-sans"
              style={{ clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0% 100%)' }}
            />
            <svg
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ══════════ Main Content ══════════ */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Dealer List */}
          <div ref={listRef} className="lg:col-span-1">
            <div className="bg-white border border-neutral-100 overflow-hidden">
              {/* List header */}
              <div className="bg-neutral-50 border-b border-neutral-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-[2px] w-6 bg-[var(--color-primary)]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                    {t('dealers.list.eyebrow')}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-neutral-900 tracking-tight uppercase">
                  {t('dealers.list.title')}
                </h2>
                <p className="text-neutral-500 text-xs font-accent tracking-[0.1em] mt-1 font-bold">
                  {filteredDealers.length} {filteredDealers.length !== 1 ? t('dealers.list.resultsPlural') : t('dealers.list.resultsSingular')}
                </p>
              </div>

              {/* List */}
              <div className="max-h-[560px] overflow-y-auto">
                {filteredDealers.map((dealer) => (
                  <DealerCard
                    key={dealer.id}
                    dealer={dealer}
                    isSelected={selectedDealer?.id === dealer.id}
                    onClick={() => handleSelectDealer(dealer)}
                  />
                ))}
                {filteredDealers.length === 0 && (
                  <div className="p-10 text-center text-neutral-400 font-sans text-sm">
                    {t('dealers.list.noResults')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div
              ref={mapContainerRef}
              className="bg-white border border-neutral-100 overflow-hidden h-96 lg:h-[640px]"
            >
              <MapContainer
                center={DR_CENTER}
                zoom={DR_ZOOM}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ background: '#f5f5f5' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <FlyToDealer dealer={selectedDealer} />

                {filteredDealers.map((dealer) => (
                  <Marker
                    key={dealer.id}
                    position={[dealer.coordinates.lat, dealer.coordinates.lng]}
                    icon={redMarkerIcon}
                    eventHandlers={{ click: () => handleSelectDealer(dealer) }}
                  >
                    <Popup>
                      <div className="min-w-[220px]">
                        <h3 className="font-bold text-neutral-900 text-base mb-1">{dealer.name}</h3>
                        <p className="text-neutral-600 text-sm mb-1">{dealer.address}</p>
                        <p className="text-neutral-600 text-sm mb-2">{dealer.phone}</p>
                        <div className="flex flex-wrap gap-1">
                          {dealer.services.map((service) => (
                            <span
                              key={service}
                              className="bg-red-50 text-[var(--color-primary)] text-xs px-2 py-0.5 rounded-full font-bold"
                            >
                              {t(service)}
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

      {/* ══════════ Why authorized dealer ══════════ */}
      <div className="bg-neutral-50 border-t border-neutral-100 py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                {t('dealers.why.eyebrow')}
              </span>
              <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight uppercase leading-[0.95]">
              {t('dealers.why.title')}
            </h2>
            <p className="text-neutral-600 font-sans">
              {t('dealers.why.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: t('dealers.why.warranty.title'),
                description: t('dealers.why.warranty.description'),
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
              },
              {
                title: t('dealers.why.technicians.title'),
                description: t('dealers.why.technicians.description'),
                icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
              },
              {
                title: t('dealers.why.originalParts.title'),
                description: t('dealers.why.originalParts.description'),
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative bg-white border border-neutral-100 hover:border-[var(--color-primary)] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/10"
              >
                <div
                  className="absolute top-0 right-0 w-12 h-12 bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
                />
                <div className="w-16 h-16 bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900 mb-2 uppercase">{item.title}</h3>
                <p className="text-neutral-600 font-sans text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ Distribuidor autorizado banner ══════════ */}
      <div className="bg-neutral-900 text-white py-14 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                {t('dealers.authorized.eyebrow')}
              </span>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1]">
              {t('dealers.authorized.title')}
            </h3>
            <p className="text-neutral-300 mt-3 max-w-xl">
              {t('dealers.authorized.description')}
            </p>
          </div>
          <a
            href="https://orientalramirez.com/sucursales"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-4 text-xs font-bold tracking-[0.18em] font-accent transition-colors"
            style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
          >
            {t('dealers.authorized.cta')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function DealerCard({
  dealer,
  isSelected,
  onClick,
}: {
  dealer: Dealer;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className={`p-5 border-b border-neutral-100 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-red-50/60 border-l-4 border-l-[var(--color-primary)]'
          : 'hover:bg-neutral-50 border-l-4 border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-lg font-bold text-neutral-900 uppercase tracking-tight">
          {dealer.name}
        </h3>
        {dealer.featured && (
          <span
            className="bg-[var(--color-primary)] text-white text-[9px] px-2 py-0.5 font-bold tracking-[0.15em] font-accent"
            style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)' }}
          >
            {t('dealers.list.featuredBadge')}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-neutral-600 font-sans">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{dealer.address}</span>
        </div>

        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{dealer.phone}</span>
        </div>

        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{dealer.hours}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {dealer.services.map((service) => (
          <span
            key={service}
            className="bg-neutral-100 text-neutral-700 text-[10px] px-2 py-1 rounded-full font-accent tracking-wider font-bold"
          >
            {t(service)}
          </span>
        ))}
      </div>
    </div>
  );
}
