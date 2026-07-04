import { create } from 'zustand';
import { warehousesApi, productsApi, ordersApi, inventoryApi } from '@/lib/api';
import type { Warehouse, Product, Order, Inventory } from '@/lib/types';

interface WarehouseState {
  warehouse: Warehouse | null;
  warehouses: Warehouse[];
  products: Product[];
  orders: Order[];
  inventory: Inventory[];
  isLoading: boolean;
  error: string | null;

  fetchWarehouse: (id: string) => Promise<void>;
  updateWarehouse: (id: string, data: Partial<Warehouse>) => Promise<boolean>;
  fetchWarehouses: (params?: { status?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchWarehouseProducts: (warehouseId: string) => Promise<void>;
  fetchWarehouseOrders: (warehouseId: string) => Promise<void>;
  fetchWarehouseInventory: (warehouseId: string) => Promise<void>;
  clearError: () => void;
}

export const useWarehouseStore = create<WarehouseState>()((set) => ({
  warehouse: null,
  warehouses: [],
  products: [],
  orders: [],
  inventory: [],
  isLoading: false,
  error: null,

  fetchWarehouse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const warehouse = await warehousesApi.get(id);
      set({ warehouse, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch warehouse', isLoading: false });
    }
  },

  updateWarehouse: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const warehouse = await warehousesApi.update(id, data);
      set({ warehouse, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update warehouse', isLoading: false });
      return false;
    }
  },

  fetchWarehouses: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await warehousesApi.list(params);
      const warehouseList = Array.isArray(response) ? response : response.data || [];
      set({ warehouses: warehouseList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch warehouses', isLoading: false });
    }
  },

  fetchWarehouseProducts: async (warehouseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsApi.list({ warehouse_id: warehouseId });
      const productList = Array.isArray(response) ? response : response.data || [];
      set({ products: productList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch products', isLoading: false });
    }
  },

  fetchWarehouseOrders: async (warehouseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.list({ warehouse_id: warehouseId });
      const orderList = Array.isArray(response) ? response : response.data || [];
      set({ orders: orderList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch orders', isLoading: false });
    }
  },

  fetchWarehouseInventory: async (warehouseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.list({ warehouse_id: warehouseId });
      const inventoryList = Array.isArray(response) ? response : response.data || [];
      set({ inventory: inventoryList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch inventory', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
