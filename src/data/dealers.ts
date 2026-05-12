export interface Dealer {
  id: number;
  name: string;
  address: string;
  phone: string;
  /** Phone in E.164-ish digits-only format for tel:/wa.me links (e.g. "18092468383") */
  whatsapp: string;
  email: string;
  coordinates: { lat: number; lng: number };
  services: string[];
  hours: string;
  featured?: boolean;
}

export const dealersData: Dealer[] = [
  {
    id: 1,
    name: 'Importadora Oriental Ramirez',
    address: 'Av. Francisco A. Caamaño, San Pedro de Macorís',
    phone: '(809) 526-1515',
    whatsapp: '18095261515',
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
    whatsapp: '18095261414',
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
    whatsapp: '18095541414',
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
    whatsapp: '18095231414',
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
    whatsapp: '18095251414',
    email: 'info@orientalramirez.com',
    coordinates: { lat: 18.939554, lng: -70.404884 },
    services: ['dealers.services.sales', 'dealers.services.service'],
    hours: 'Lun–Vie: 8:00–18:00 · Sáb: 9:00–14:00',
  },
];
