export interface BikeImage {
  main: string;
  front: string;
  additional: string[];
}

export interface BikeColor {
  name: string;
  value: string;
  images: BikeImage;
}

export interface BikeModel {
  id: string;
  name: string;
  slug: string;
  colors: BikeColor[];
  featured?: boolean;
}

export type BikeModels = 'ADRI SPORT' | 'BWS' | 'CG200' | 'ST 125';

export type BikeColors = {
  'ADRI SPORT': 'azul' | 'blanca' | 'negra' | 'roja';
  'BWS': 'azul' | 'blanco';
  'CG200': 'rojo';
  'ST 125': 'azul' | 'negro' | 'rojo';
};