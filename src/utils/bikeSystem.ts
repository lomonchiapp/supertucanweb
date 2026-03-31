import { bikesData } from '@/data/bikes';
import { CATEGORIES, type BikeModel, type CategoryInfo } from '@/types/bikes';

export type { BikeModel, CategoryInfo };

export interface CategoryWithModels extends CategoryInfo {
  models: BikeModel[];
}

export const getModelsByCategory = (): CategoryWithModels[] => {
  return CATEGORIES.map((cat) => ({
    ...cat,
    models: bikesData.filter((bike) => bike.category === cat.id),
  }));
};

export const getModelById = (modelId: string): BikeModel | undefined => {
  return bikesData.find((m) => m.id === modelId);
};

export const getModelImage = (modelName: string, colorValue: string): string => {
  return `/bikes/${modelName}/${colorValue}/main.avif`;
};
