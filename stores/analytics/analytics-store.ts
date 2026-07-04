import { create } from 'zustand';
import { analyticsApi } from '@/lib/api';

type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface AnalyticsState {
  data: Record<string, unknown>;
  warehouseData: Record<string, unknown>;
  isLoading: boolean;
  error: string | null;
  dateRange: DateRange;
  customDateRange: { start: string | null; end: string | null };

  fetchAnalytics: (params?: { type?: string; warehouse_id?: string }) => Promise<void>;
  fetchWarehouseAnalytics: (warehouseId: string) => Promise<void>;
  setDateRange: (range: DateRange) => void;
  setCustomDateRange: (start: string | null, end: string | null) => void;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  data: {},
  warehouseData: {},
  isLoading: false,
  error: null,
  dateRange: 'month',
  customDateRange: { start: null, end: null },

  fetchAnalytics: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsApi.get(params);
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch analytics', isLoading: false });
    }
  },

  fetchWarehouseAnalytics: async (warehouseId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsApi.get({ warehouse_id: warehouseId });
      set({ warehouseData: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch warehouse analytics', isLoading: false });
    }
  },

  setDateRange: (dateRange) => set({ dateRange }),
  setCustomDateRange: (start, end) => set({ customDateRange: { start, end } }),
  clearError: () => set({ error: null }),
}));
