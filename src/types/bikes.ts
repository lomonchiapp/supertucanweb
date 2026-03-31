export interface BikeImage {
  main: string;
  front: string;
  additional: string[];
}

export interface BikeColor {
  name: string;
  value: string;
  hex: string;
  images: BikeImage;
}

export interface BikeModel {
  id: string;
  name: string;
  slug: string;
  category: BikeCategory;
  colors: BikeColor[];
  featured?: boolean;
  specs: {
    engine: string;
    maxSpeed: string;
    power?: string;
    fuelTank?: string;
    weight?: string;
    brakeType?: string;
    transmission?: string;
    startType?: string;
    wheelSize?: string;
    seatHeight?: string;
  };
  description: string;
}

export type BikeCategory = 'motocicleta' | 'passola' | 'atv' | 'sport';

export interface CategoryInfo {
  id: BikeCategory;
  name: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'motocicleta',
    name: 'MOTOCICLETA',
    description: 'Potencia y versatilidad para todo terreno',
  },
  {
    id: 'passola',
    name: 'PASSOLA',
    description: 'Ideal para la ciudad y uso urbano',
  },
  {
    id: 'atv',
    name: 'ATV',
    description: 'Aventura y diversión off-road',
  },
  {
    id: 'sport',
    name: 'SPORT',
    description: 'Velocidad y rendimiento deportivo',
  },
];
