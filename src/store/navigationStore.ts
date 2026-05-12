import { create } from 'zustand';

export type NavigationSection = 'hero' | 'modelos' | 'marca' | 'dealers' | 'partes' | 'noticias';

interface NavigationState {
  activeSection: NavigationSection;
  isTransitioning: boolean;
  selectedCategory: string;
  setActiveSection: (section: NavigationSection) => void;
  setIsTransitioning: (transitioning: boolean) => void;
  setSelectedCategory: (category: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'hero',
  isTransitioning: false,
  selectedCategory: 'motocicleta',
  setActiveSection: (section) => {
    set({ isTransitioning: true });
    // Delay ajustado para las nuevas transiciones más suaves
    setTimeout(() => {
      set({ activeSection: section, isTransitioning: false });
    }, 200);
  },
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));