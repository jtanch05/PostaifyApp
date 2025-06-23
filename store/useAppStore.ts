import { create } from 'zustand';

// Types for the data models
interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  favoritePoseIds: string[];
  createdAt: Date;
}

interface Location {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  poseIds: string[];
  isPopular: boolean;
}

interface Pose {
  id: string;
  name: string;
  description: string;
  category: string;
  templateImageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  locationId?: string; // Optional, for location-specific poses
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // App data
  locations: Location[];
  poses: Pose[];
  popularLocations: Location[];
  
  // UI state
  isLoading: boolean;
  activeTab: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLocations: (locations: Location[]) => void;
  setPoses: (poses: Pose[]) => void;
  setPopularLocations: (locations: Location[]) => void;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  
  // User actions
  toggleFavoritePose: (poseId: string) => void;
  updateUserPremiumStatus: (isPremium: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  locations: [],
  poses: [],
  popularLocations: [],
  isLoading: false,
  activeTab: 'Home',
  
  // Basic setters
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLocations: (locations) => set({ locations }),
  setPoses: (poses) => set({ poses }),
  setPopularLocations: (popularLocations) => set({ popularLocations }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveTab: (activeTab) => set({ activeTab }),
  
  // User actions
  toggleFavoritePose: (poseId) => {
    const { user } = get();
    if (!user) return;
    
    const updatedFavorites = user.favoritePoseIds.includes(poseId)
      ? user.favoritePoseIds.filter(id => id !== poseId)
      : [...user.favoritePoseIds, poseId];
    
    set({
      user: {
        ...user,
        favoritePoseIds: updatedFavorites,
      },
    });
  },
  
  updateUserPremiumStatus: (isPremium) => {
    const { user } = get();
    if (!user) return;
    
    set({
      user: {
        ...user,
        isPremium,
      },
    });
  },
}));

// Selectors for commonly used derived state
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const usePopularLocations = () => useAppStore((state) => state.popularLocations);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useIsLoading = () => useAppStore((state) => state.isLoading); 