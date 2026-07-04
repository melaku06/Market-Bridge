import { create } from 'zustand';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  newestProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };

  fetchProducts: (params?: {
    category?: string;
    status?: string;
    warehouse_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;
  fetchNewestProducts: (limit?: number) => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentProduct: () => void;
}

export const useProductsStore = create<ProductsState>()((set, get) => ({
  products: [],
  featuredProducts: [],
  newestProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: { total: 0, limit: 20, offset: 0, has_more: false },

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsApi.list(params);
      const productList = Array.isArray(response) ? response : response.data || [];
      const pagination = Array.isArray(response)
        ? { total: productList.length, limit: params?.limit || 20, offset: params?.offset || 0, has_more: false }
        : response.pagination;

      set({ products: productList, pagination: pagination || get().pagination, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch products', isLoading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.get(id);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch product', isLoading: false });
    }
  },

  fetchFeaturedProducts: async (limit = 8) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsApi.list({ limit, status: 'active' });
      const productList = Array.isArray(response) ? response : response.data || [];
      set({ featuredProducts: productList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch featured products', isLoading: false });
    }
  },

  fetchNewestProducts: async (limit = 8) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsApi.list({ limit, status: 'active' });
      const productList = Array.isArray(response) ? response : response.data || [];
      set({ newestProducts: productList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch newest products', isLoading: false });
    }
  },

  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.create(data);
      set((s) => ({ products: [...s.products, product], isLoading: false }));
      return product;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create product', isLoading: false });
      return null;
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.update(id, data);
      set((s) => ({
        products: s.products.map((p) => (p.id === id ? product : p)),
        currentProduct: s.currentProduct?.id === id ? product : s.currentProduct,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update product', isLoading: false });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productsApi.delete(id);
      set((s) => ({ products: s.products.filter((p) => p.id !== id), isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete product', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentProduct: () => set({ currentProduct: null }),
}));
