// Sistema dinámico para detectar categorías, modelos y colores de las motos
// basado en la estructura de carpetas

export interface BikeCategory {
  id: string;
  name: string;
  folder: string;
  models: BikeModel[];
}

export interface BikeModel {
  id: string;
  name: string;
  folder: string;
  category: string;
  colors: BikeColor[];
  mainImage?: string;
}

export interface BikeColor {
  name: string;
  value: string;
  code: string;
  mainImage: string;
  frontImage: string;
}

// Mapeo de colores
const COLOR_MAP: { [key: string]: { name: string; code: string } } = {
  'azul': { name: 'Azul', code: '#3B82F6' },
  'blanco': { name: 'Blanco', code: '#FFFFFF' },
  'blanca': { name: 'Blanca', code: '#FFFFFF' },
  'negro': { name: 'Negro', code: '#1F2937' },
  'negra': { name: 'Negra', code: '#1F2937' },
  'rojo': { name: 'Rojo', code: '#EF4444' },
  'roja': { name: 'Roja', code: '#EF4444' }
};

// Mapeo de categorías basado en los modelos actuales
const CATEGORY_MAPPING: { [key: string]: string } = {
  'ADRI SPORT': 'motocicletas',
  'CG200': 'motocicletas',
  'BWS': 'scooters',
  'ST 125': 'sport'
};

// Configuración de categorías
export const CATEGORIES: BikeCategory[] = [
  {
    id: 'motocicletas',
    name: 'MOTOCICLETAS',
    folder: 'motocicletas',
    models: []
  },
  {
    id: 'scooters',
    name: 'SCOOTERS',
    folder: 'scooters',
    models: []
  },
  {
    id: 'sport',
    name: 'SPORT',
    folder: 'sport',
    models: []
  }
];

// Función para obtener la ruta de imagen
const getImagePath = (model: string, color: string, image: string) => 
  `/src/assets/bikes/${model}/${color}/${image}`;

// Función para detectar colores disponibles de un modelo
export const getAvailableColors = (modelName: string): BikeColor[] => {
  // Lista hardcodeada basada en la estructura actual de carpetas
  const modelColors: { [key: string]: string[] } = {
    'ADRI SPORT': ['azul', 'blanca', 'negra', 'roja'],
    'BWS': ['azul', 'blanco'],
    'CG200': ['rojo'],
    'ST 125': ['azul', 'negro', 'rojo']
  };

  const colors = modelColors[modelName] || [];
  
  return colors.map(colorValue => {
    const colorInfo = COLOR_MAP[colorValue] || { name: colorValue, code: '#6B7280' };
    
    return {
      name: colorInfo.name,
      value: colorValue,
      code: colorInfo.code,
      mainImage: getImagePath(modelName, colorValue, 'main.avif'),
      frontImage: getImagePath(modelName, colorValue, 'front.avif')
    };
  });
};

// Función para obtener todos los modelos organizados por categoría
export const getModelsByCategory = (): BikeCategory[] => {
  const models: BikeModel[] = [
    {
      id: 'adri-sport',
      name: 'ADRI SPORT',
      folder: 'ADRI SPORT',
      category: 'motocicletas',
      colors: getAvailableColors('ADRI SPORT'),
      mainImage: '/src/assets/bikes/ADRI SPORT/azul/main.avif'
    },
    {
      id: 'cg200',
      name: 'CG200',
      folder: 'CG200',
      category: 'motocicletas',
      colors: getAvailableColors('CG200'),
      mainImage: '/src/assets/bikes/CG200/rojo/main.avif'
    },
    {
      id: 'bws',
      name: 'BWS',
      folder: 'BWS',
      category: 'scooters',
      colors: getAvailableColors('BWS'),
      mainImage: '/src/assets/bikes/BWS/azul/main.avif'
    },
    {
      id: 'st-125',
      name: 'ST 125',
      folder: 'ST 125',
      category: 'sport',
      colors: getAvailableColors('ST 125'),
      mainImage: '/src/assets/bikes/ST 125/azul/main.avif'
    }
  ];

  // Organizar modelos por categoría
  const categoriesWithModels = CATEGORIES.map(category => ({
    ...category,
    models: models.filter(model => model.category === category.id)
  }));

  return categoriesWithModels;
};

// Función para obtener un modelo específico
export const getModelById = (modelId: string): BikeModel | undefined => {
  const categories = getModelsByCategory();
  
  for (const category of categories) {
    const model = category.models.find(m => m.id === modelId);
    if (model) return model;
  }
  
  return undefined;
};

// Función para obtener la imagen principal de un modelo en un color específico
export const getModelImage = (modelName: string, colorValue: string): string => {
  return getImagePath(modelName, colorValue, 'main.avif');
};