import { create } from 'zustand';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/lib/types';

interface ReviewsState {
  reviews: Review[];
  productReviews: Review[];
  currentReview: Review | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };

  fetchReviews: (params?: { product_id?: string; customer_id?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchProductReviews: (productId: string) => Promise<void>;
  fetchCustomerReviews: (customerId: string) => Promise<void>;
  createReview: (data: Partial<Review>) => Promise<Review | null>;
  updateReview: (id: string, data: Partial<Review>) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useReviewsStore = create<ReviewsState>()((set, get) => ({
  reviews: [],
  productReviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  pagination: { total: 0, limit: 20, offset: 0, has_more: false },

  fetchReviews: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewsApi.list(params);
      const reviewList = Array.isArray(response) ? response : response.data || [];
      const pagination = Array.isArray(response)
        ? { total: reviewList.length, limit: params?.limit || 20, offset: params?.offset || 0, has_more: false }
        : response.pagination;

      set({ reviews: reviewList, pagination: pagination || get().pagination, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch reviews', isLoading: false });
    }
  },

  fetchProductReviews: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewsApi.list({ product_id: productId });
      const reviewList = Array.isArray(response) ? response : response.data || [];
      set({ productReviews: reviewList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch product reviews', isLoading: false });
    }
  },

  fetchCustomerReviews: async (customerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewsApi.list({ customer_id: customerId });
      const reviewList = Array.isArray(response) ? response : response.data || [];
      set({ reviews: reviewList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch customer reviews', isLoading: false });
    }
  },

  createReview: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const review = await reviewsApi.create(data);
      set((s) => ({ reviews: [review, ...s.reviews], isLoading: false }));
      return review;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create review', isLoading: false });
      return null;
    }
  },

  updateReview: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await reviewsApi.update(id, data);
      set((s) => ({
        reviews: s.reviews.map((r) => (r.id === id ? updated : r)),
        productReviews: s.productReviews.map((r) => (r.id === id ? updated : r)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update review', isLoading: false });
      return false;
    }
  },

  deleteReview: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await reviewsApi.delete(id);
      set((s) => ({
        reviews: s.reviews.filter((r) => r.id !== id),
        productReviews: s.productReviews.filter((r) => r.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete review', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
