import { create } from 'zustand';
import { fetchAllBikes, fetchCategories } from '@/services/bikeService';
import { bikesData } from '@/data/bikes';
import { CATEGORIES } from '@/types/bikes';
import type { BikeModel, CategoryInfo } from '@/types/bikes';

interface BikeStore {
  bikes: BikeModel[];
  categories: CategoryInfo[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  init: () => Promise<void>;
}

export const useBikeStore = create<BikeStore>((set, get) => ({
  bikes: [],
  categories: [],
  isLoading: false,
  error: null,
  initialized: false,

  init: async () => {
    if (get().initialized) return;

    set({ isLoading: true, error: null });

    try {
      const [bikes, categories] = await Promise.all([
        fetchAllBikes(),
        fetchCategories(),
      ]);

      set({
        bikes,
        categories,
        isLoading: false,
        initialized: true,
      });
    } catch (err) {
      // Firebase unavailable or misconfigured — fall back to static data
      console.warn(
        'Firebase fetch failed, falling back to static data:',
        err instanceof Error ? err.message : err
      );

      set({
        bikes: bikesData,
        categories: [...CATEGORIES],
        isLoading: false,
        error: null,
        initialized: true,
      });
    }
  },
}));
