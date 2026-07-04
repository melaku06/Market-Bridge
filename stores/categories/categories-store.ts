import { create } from 'zustand';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/lib/types';

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  createCategory: (data: Partial<Category>) => Promise<Category | null>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useCategoriesStore = create<CategoriesState>()((set) => ({
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoriesApi.list();
      set({ categories: Array.isArray(categories) ? categories : [], isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch categories', isLoading: false });
    }
  },

  fetchCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoriesApi.get(id);
      set({ currentCategory: category, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch category', isLoading: false });
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoriesApi.create(data);
      set((s) => ({ categories: [...s.categories, category], isLoading: false }));
      return category;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create category', isLoading: false });
      return null;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoriesApi.update(id, data);
      set((s) => ({
        categories: s.categories.map((c) => (c.id === id ? category : c)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update category', isLoading: false });
      return false;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesApi.delete(id);
      set((s) => ({ categories: s.categories.filter((c) => c.id !== id), isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete category', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
