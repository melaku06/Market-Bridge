import { create } from 'zustand';
import { productsApi, categoriesApi, reviewsApi } from '@/lib/api';
import type { Product, Category, Review } from '@/lib/types';

interface ProductsState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  productReviews: Review[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };

  // Actions
  fetchProducts: (params?: { category?: string; status?: string; warehouse_id?: string; search?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;
  fetchProductReviews: (productId: string) => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentProduct: () => void;
}

export const useProductsStore = create<ProductsState>()((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  currentProduct: null,
  productReviews: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    has_more: false,
  },

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsApi.list(params);
      const productList = Array.isArray(response) ? response : response.data || [];
      const pagination = Array.isArray(response)
        ? { total: productList.length, limit: params?.limit || 20, offset: params?.offset || 0, has_more: false }
        : response.pagination;

      set({
        products: productList,
        pagination: pagination || get().pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.get(id);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoriesApi.list();
      set({ categories: Array.isArray(categories) ? categories : [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  fetchFeaturedProducts: async (limit = 8) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsApi.list({ limit, status: 'active' });
      const productList = Array.isArray(response) ? response : response.data || [];
      set({ featuredProducts: productList, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch featured products',
        isLoading: false,
      });
    }
  },

  fetchProductReviews: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewsApi.list({ product_id: productId });
      const reviews = Array.isArray(response) ? response : response.data || [];
      set({ productReviews: reviews, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
        isLoading: false,
      });
    }
  },

  createProduct: async (data: Partial<Product>) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.create(data);
      set((state) => ({
        products: [...state.products, product],
        isLoading: false,
      }));
      return product;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create product',
        isLoading: false,
      });
      return null;
    }
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.update(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? product : p)),
        currentProduct: state.currentProduct?.id === id ? product : state.currentProduct,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update product',
        isLoading: false,
      });
      return false;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await productsApi.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete product',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentProduct: () => set({ currentProduct: null }),
}));
