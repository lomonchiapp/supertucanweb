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
    name: 'categories.motocicleta.name',
    description: 'categories.motocicleta.description',
  },
  {
    id: 'passola',
    name: 'categories.passola.name',
    description: 'categories.passola.description',
  },
  {
    id: 'atv',
    name: 'categories.atv.name',
    description: 'categories.atv.description',
  },
  {
    id: 'sport',
    name: 'categories.sport.name',
    description: 'categories.sport.description',
  },
];
