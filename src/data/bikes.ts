import type { BikeModel } from '@/types/bikes';

const COLOR_HEX: Record<string, string> = {
  azul: '#3B82F6',
  blanca: '#FFFFFF',
  blanco: '#FFFFFF',
  negra: '#1F2937',
  negro: '#1F2937',
  roja: '#EF4444',
  rojo: '#EF4444',
};

function buildColor(
  model: string,
  colorName: string,
  colorValue: string,
  additionalCount: number,
  usesFrontAsMain = false
) {
  const base = `/bikes/${model}/${colorValue}`;
  return {
    name: colorName,
    value: colorValue,
    hex: COLOR_HEX[colorValue] || '#6B7280',
    images: {
      main: usesFrontAsMain ? `${base}/front.avif` : `${base}/main.avif`,
      front: `${base}/front.avif`,
      additional: Array.from({ length: additionalCount }, (_, i) => `${base}/${i + 1}.avif`),
    },
  };
}

export const bikesData: BikeModel[] = [
  {
    id: 'adri-sport',
    name: 'ADRI SPORT',
    slug: 'adri-sport',
    category: 'motocicleta',
    featured: true,
    description: 'Experimenta la potencia y agilidad de nuestra motocicleta deportiva más avanzada',
    specs: {
      engine: '125CC',
      maxSpeed: '85KM/H',
      power: '11.5 HP',
      fuelTank: '5.5L',
      weight: '115 KG',
      brakeType: 'Disco / Tambor',
      transmission: '4 velocidades',
      startType: 'Eléctrico / Pedal',
      wheelSize: '17"',
      seatHeight: '780mm',
    },
    colors: [
      buildColor('ADRI SPORT', 'Azul', 'azul', 3),
      buildColor('ADRI SPORT', 'Blanca', 'blanca', 3, true),
      buildColor('ADRI SPORT', 'Negra', 'negra', 2),
      buildColor('ADRI SPORT', 'Roja', 'roja', 1),
    ],
  },
  {
    id: 'bws',
    name: 'BWS',
    slug: 'bws',
    category: 'passola',
    description: 'Diseño urbano y versatilidad para la ciudad moderna',
    specs: {
      engine: '125CC',
      maxSpeed: '80KM/H',
      power: '9.5 HP',
      fuelTank: '6.5L',
      weight: '108 KG',
      brakeType: 'Disco / Tambor',
      transmission: 'CVT Automática',
      startType: 'Eléctrico',
      wheelSize: '13"',
      seatHeight: '720mm',
    },
    colors: [
      buildColor('BWS', 'Azul', 'azul', 3),
      buildColor('BWS', 'Blanco', 'blanco', 6),
    ],
  },
  {
    id: 'cg200',
    name: 'CG200',
    slug: 'cg200',
    category: 'motocicleta',
    description: 'Potencia y resistencia para todas tus aventuras',
    specs: {
      engine: '200CC',
      maxSpeed: '95KM/H',
      power: '15.5 HP',
      fuelTank: '12L',
      weight: '135 KG',
      brakeType: 'Disco / Tambor',
      transmission: '5 velocidades',
      startType: 'Eléctrico / Pedal',
      wheelSize: '18"',
      seatHeight: '800mm',
    },
    colors: [
      buildColor('CG200', 'Rojo', 'rojo', 9),
    ],
  },
  {
    id: 'st-125',
    name: 'ST 125',
    slug: 'st-125',
    category: 'sport',
    description: 'Rendimiento deportivo con estilo moderno',
    specs: {
      engine: '125CC',
      maxSpeed: '90KM/H',
      power: '12 HP',
      fuelTank: '6L',
      weight: '120 KG',
      brakeType: 'Disco / Disco',
      transmission: 'Manual 5 velocidades',
      startType: 'Eléctrico',
      wheelSize: '17"',
      seatHeight: '790mm',
    },
    colors: [
      buildColor('ST 125', 'Azul', 'azul', 1),
      buildColor('ST 125', 'Negro', 'negro', 0),
      buildColor('ST 125', 'Rojo', 'rojo', 6),
    ],
  },
];

export const getFeaturedBikes = () => bikesData.filter((bike) => bike.featured);
export const getBikeBySlug = (slug: string) => bikesData.find((bike) => bike.slug === slug);
export const getBikeById = (id: string) => bikesData.find((bike) => bike.id === id);
export const getBikesByCategory = (category: string) => bikesData.filter((bike) => bike.category === category);
