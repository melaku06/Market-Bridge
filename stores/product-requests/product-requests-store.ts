import { create } from 'zustand';
import { productRequestsApi } from '@/lib/api';
import type { ProductRequest } from '@/lib/types';

interface ProductRequestsState {
  requests: ProductRequest[];
  currentRequest: ProductRequest | null;
  isLoading: boolean;
  error: string | null;

  fetchRequests: (params?: { customer_id?: string; status?: string }) => Promise<void>;
  createRequest: (data: Partial<ProductRequest>) => Promise<ProductRequest | null>;
  updateRequest: (id: string, data: Partial<ProductRequest>) => Promise<boolean>;
  deleteRequest: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useProductRequestsStore = create<ProductRequestsState>()((set) => ({
  requests: [],
  currentRequest: null,
  isLoading: false,
  error: null,

  fetchRequests: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productRequestsApi.list(params);
      const requestList = Array.isArray(response) ? response : response.data || [];
      set({ requests: requestList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch requests', isLoading: false });
    }
  },

  createRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const request = await productRequestsApi.create(data);
      set((s) => ({ requests: [request, ...s.requests], isLoading: false }));
      return request;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create request', isLoading: false });
      return null;
    }
  },

  updateRequest: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const request = await productRequestsApi.update(id, data);
      set((s) => ({
        requests: s.requests.map((r) => (r.id === id ? request : r)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update request', isLoading: false });
      return false;
    }
  },

  deleteRequest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productRequestsApi.delete(id);
      set((s) => ({ requests: s.requests.filter((r) => r.id !== id), isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete request', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
