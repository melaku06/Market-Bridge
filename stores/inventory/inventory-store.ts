import { create } from 'zustand';
import { inventoryApi } from '@/lib/api';
import type { Inventory } from '@/lib/types';

interface InventoryState {
  inventory: Inventory[];
  currentInventory: Inventory | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
  statistics: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };

  fetchInventory: (params?: {
    warehouse_id?: string;
    product_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
  fetchInventoryItem: (id: string) => Promise<void>;
  createInventory: (data: Partial<Inventory>) => Promise<Inventory | null>;
  updateInventory: (id: string, data: Partial<Inventory>) => Promise<boolean>;
  computeStatistics: () => void;
  clearError: () => void;
}

export const useInventoryStore = create<InventoryState>()((set, get) => ({
  inventory: [],
  currentInventory: null,
  isLoading: false,
  error: null,
  pagination: { total: 0, limit: 20, offset: 0, has_more: false },
  statistics: { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 },

  fetchInventory: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.list(params);
      const inventoryList = Array.isArray(response) ? response : response.data || [];
      const pagination = Array.isArray(response)
        ? { total: inventoryList.length, limit: params?.limit || 20, offset: params?.offset || 0, has_more: false }
        : response.pagination;

      set({ inventory: inventoryList, pagination: pagination || get().pagination, isLoading: false });
      get().computeStatistics();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch inventory', isLoading: false });
    }
  },

  fetchInventoryItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const item = await inventoryApi.get(id);
      set({ currentInventory: item, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch inventory item', isLoading: false });
    }
  },

  createInventory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const item = await inventoryApi.create(data);
      set((s) => ({ inventory: [...s.inventory, item], isLoading: false }));
      get().computeStatistics();
      return item;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create inventory', isLoading: false });
      return null;
    }
  },

  updateInventory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const item = await inventoryApi.update(id, data);
      set((s) => ({
        inventory: s.inventory.map((i) => (i.id === id ? item : i)),
        isLoading: false,
      }));
      get().computeStatistics();
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update inventory', isLoading: false });
      return false;
    }
  },

  computeStatistics: () => {
    const { inventory } = get();
    set({
      statistics: {
        total: inventory.length,
        inStock: inventory.filter((i) => i.status === 'in_stock').length,
        lowStock: inventory.filter((i) => i.status === 'low_stock').length,
        outOfStock: inventory.filter((i) => i.status === 'out_of_stock').length,
      },
    });
  },

  clearError: () => set({ error: null }),
}));
