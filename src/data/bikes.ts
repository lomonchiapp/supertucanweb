import type { BikeModel } from '@/types/bikes';

const getImagePath = (model: string, color: string, image: string) => 
  `/src/assets/bikes/${model}/${color}/${image}`;

const getMainImage = (model: string, color: string) => {
  // Para ADRI SPORT blanca, usar front.avif en lugar de main.avif
  if (model === 'ADRI SPORT' && color === 'blanca') {
    return getImagePath(model, color, 'front.avif');
  }
  return getImagePath(model, color, 'main.avif');
};

const getAdditionalImages = (model: string, color: string) => {
  const images = [];
  
  // Agregar imágenes numeradas que existen
  for (let i = 1; i <= 10; i++) {
    images.push(getImagePath(model, color, `${i}.avif`));
  }
  
  return images;
};

export const bikesData: BikeModel[] = [
  {
    id: 'adri-sport',
    name: 'ADRI SPORT',
    slug: 'adri-sport',
    featured: true,
    colors: [
      {
        name: 'Azul',
        value: 'azul',
        images: {
          main: getMainImage('ADRI SPORT', 'azul'),
          front: getImagePath('ADRI SPORT', 'azul', 'front.avif'),
          additional: getAdditionalImages('ADRI SPORT', 'azul')
        }
      },
      {
        name: 'Blanca',
        value: 'blanca',
        images: {
          main: getMainImage('ADRI SPORT', 'blanca'),
          front: getImagePath('ADRI SPORT', 'blanca', 'front.avif'),
          additional: getAdditionalImages('ADRI SPORT', 'blanca')
        }
      },
      {
        name: 'Negra',
        value: 'negra',
        images: {
          main: getMainImage('ADRI SPORT', 'negra'),
          front: getImagePath('ADRI SPORT', 'negra', 'front.avif'),
          additional: getAdditionalImages('ADRI SPORT', 'negra')
        }
      },
      {
        name: 'Roja',
        value: 'roja',
        images: {
          main: getMainImage('ADRI SPORT', 'roja'),
          front: getImagePath('ADRI SPORT', 'roja', 'front.avif'),
          additional: getAdditionalImages('ADRI SPORT', 'roja')
        }
      }
    ]
  },
  {
    id: 'bws',
    name: 'BWS',
    slug: 'bws',
    colors: [
      {
        name: 'Azul',
        value: 'azul',
        images: {
          main: getMainImage('BWS', 'azul'),
          front: getImagePath('BWS', 'azul', 'front.avif'),
          additional: getAdditionalImages('BWS', 'azul')
        }
      },
      {
        name: 'Blanco',
        value: 'blanco',
        images: {
          main: getMainImage('BWS', 'blanco'),
          front: getImagePath('BWS', 'blanco', 'front.avif'),
          additional: getAdditionalImages('BWS', 'blanco')
        }
      }
    ]
  },
  {
    id: 'cg200',
    name: 'CG200',
    slug: 'cg200',
    colors: [
      {
        name: 'Rojo',
        value: 'rojo',
        images: {
          main: getMainImage('CG200', 'rojo'),
          front: getImagePath('CG200', 'rojo', 'front.avif'),
          additional: getAdditionalImages('CG200', 'rojo')
        }
      }
    ]
  },
  {
    id: 'st-125',
    name: 'ST 125',
    slug: 'st-125',
    colors: [
      {
        name: 'Azul',
        value: 'azul',
        images: {
          main: getMainImage('ST 125', 'azul'),
          front: getImagePath('ST 125', 'azul', 'front.avif'),
          additional: getAdditionalImages('ST 125', 'azul')
        }
      },
      {
        name: 'Negro',
        value: 'negro',
        images: {
          main: getMainImage('ST 125', 'negro'),
          front: getImagePath('ST 125', 'negro', 'front.avif'),
          additional: getAdditionalImages('ST 125', 'negro')
        }
      },
      {
        name: 'Rojo',
        value: 'rojo',
        images: {
          main: getMainImage('ST 125', 'rojo'),
          front: getImagePath('ST 125', 'rojo', 'front.avif'),
          additional: getAdditionalImages('ST 125', 'rojo')
        }
      }
    ]
  }
];

export const getFeaturedBikes = () => bikesData.filter(bike => bike.featured);

export const getBikeBySlug = (slug: string) => bikesData.find(bike => bike.slug === slug);

export const getAllBikes = () => bikesData;