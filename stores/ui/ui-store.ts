import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ViewMode = 'grid' | 'list';

interface UIState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  cartDrawerOpen: boolean;
  theme: Theme;
  viewMode: ViewMode;
  activeTab: string | null;
  loadingOverlay: boolean;
  tableDensity: 'compact' | 'standard' | 'comfortable';

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveTab: (tab: string | null) => void;
  setLoadingOverlay: (loading: boolean) => void;
  setTableDensity: (density: 'compact' | 'standard' | 'comfortable') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileNavOpen: false,
      cartDrawerOpen: false,
      theme: 'system',
      viewMode: 'grid',
      activeTab: null,
      loadingOverlay: false,
      tableDensity: 'standard',

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      toggleCartDrawer: () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),
      setCartDrawerOpen: (cartDrawerOpen) => set({ cartDrawerOpen }),
      setTheme: (theme) => set({ theme }),
      setViewMode: (viewMode) => set({ viewMode }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setLoadingOverlay: (loadingOverlay) => set({ loadingOverlay }),
      setTableDensity: (tableDensity) => set({ tableDensity }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        viewMode: state.viewMode,
        tableDensity: state.tableDensity,
      }),
    }
  )
);
