import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface SearchFilterState {
  keyword: string;
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  selectedBrands: string[];
  priceRange: { min: number; max: number };
  selectedRating: number | null;
  availability: 'all' | 'in_stock' | 'out_of_stock';
  sortBy: SortOption;
  currentPage: number;
  viewMode: 'grid' | 'list';

  setKeyword: (keyword: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubCategory: (subCategory: string | null) => void;
  toggleBrand: (brand: string) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  setSelectedRating: (rating: number | null) => void;
  setAvailability: (availability: 'all' | 'in_stock' | 'out_of_stock') => void;
  setSortBy: (sort: SortOption) => void;
  setCurrentPage: (page: number) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
}

const defaultFilters = {
  keyword: '',
  selectedCategory: null as string | null,
  selectedSubCategory: null as string | null,
  selectedBrands: [] as string[],
  priceRange: { min: 0, max: 10000 },
  selectedRating: null as number | null,
  availability: 'all' as const,
  sortBy: 'newest' as SortOption,
  currentPage: 1,
  viewMode: 'grid' as const,
};

export const useSearchFilterStore = create<SearchFilterState>()(
  persist(
    (set) => ({
      ...defaultFilters,

      setKeyword: (keyword) => set({ keyword, currentPage: 1 }),
      setSelectedCategory: (selectedCategory) =>
        set({ selectedCategory, currentPage: 1, selectedSubCategory: null }),
      setSelectedSubCategory: (selectedSubCategory) => set({ selectedSubCategory, currentPage: 1 }),
      toggleBrand: (brand) =>
        set((s) => ({
          selectedBrands: s.selectedBrands.includes(brand)
            ? s.selectedBrands.filter((b) => b !== brand)
            : [...s.selectedBrands, brand],
          currentPage: 1,
        })),
      setPriceRange: (priceRange) => set({ priceRange, currentPage: 1 }),
      setSelectedRating: (selectedRating) => set({ selectedRating, currentPage: 1 }),
      setAvailability: (availability) => set({ availability, currentPage: 1 }),
      setSortBy: (sortBy) => set({ sortBy }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setViewMode: (viewMode) => set({ viewMode }),
      resetFilters: () => set({ ...defaultFilters }),
    }),
    {
      name: 'search-filter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
      }),
    }
  )
);
