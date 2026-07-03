import { create } from 'zustand';
import { warehousesApi, inventoryApi, adminApi } from '@/lib/api';
import type { Warehouse, Inventory, Product, MarginRule, Promotion, AuditLog } from '@/lib/types';

interface WarehouseState {
  warehouse: Warehouse | null;
  products: Product[];
  inventory: Inventory[];
  orders: any[];
  marginRules: MarginRule[];
  promotions: Promotion[];
  auditLogs: AuditLog[];
  pendingProducts: (Product & { warehouse_name: string; warehouse_owner: string })[];
  isLoading: boolean;
  error: string | null;

  // Warehouse actions
  fetchWarehouse: (id: string) => Promise<void>;
  updateWarehouse: (id: string, data: Partial<Warehouse>) => Promise<boolean>;

  // Product actions
  fetchWarehouseProducts: (warehouseId: string) => Promise<void>;

  // Inventory actions
  fetchInventory: (warehouseId: string) => Promise<void>;
  updateInventory: (id: string, data: Partial<Inventory>) => Promise<boolean>;

  // Orders actions
  fetchWarehouseOrders: (warehouseId: string) => Promise<void>;

  // Admin actions
  fetchPendingProducts: () => Promise<void>;
  approveProduct: (id: string) => Promise<boolean>;
  rejectProduct: (id: string) => Promise<boolean>;
  fetchMarginRules: () => Promise<void>;
  createMarginRule: (data: Partial<MarginRule>) => Promise<MarginRule | null>;
  updateMarginRule: (id: string, data: Partial<MarginRule>) => Promise<boolean>;
  fetchPromotions: (status?: string) => Promise<void>;
  createPromotion: (data: Partial<Promotion>) => Promise<Promotion | null>;
  updatePromotion: (id: string, data: Partial<Promotion>) => Promise<boolean>;
  deletePromotion: (id: string) => Promise<boolean>;
  fetchAuditLogs: (params?: { actor_role?: string; action?: string; entity_type?: string; limit?: number; offset?: number }) => Promise<void>;

  clearError: () => void;
}

export const useWarehouseStore = create<WarehouseState>()((set, get) => ({
  warehouse: null,
  products: [],
  inventory: [],
  orders: [],
  marginRules: [],
  promotions: [],
  auditLogs: [],
  pendingProducts: [],
  isLoading: false,
  error: null,

  fetchWarehouse: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const warehouse = await warehousesApi.get(id);
      set({ warehouse, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch warehouse',
        isLoading: false,
      });
    }
  },

  updateWarehouse: async (id: string, data: Partial<Warehouse>) => {
    set({ isLoading: true, error: null });
    try {
      const warehouse = await warehousesApi.update(id, data);
      set({ warehouse, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update warehouse',
        isLoading: false,
      });
      return false;
    }
  },

  fetchWarehouseProducts: async (warehouseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { productsApi } = await import('@/lib/api');
      const productResponse = await productsApi.list({ warehouse_id: warehouseId });
      const productList = Array.isArray(productResponse) ? productResponse : productResponse.data || [];
      set({ products: productList, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchInventory: async (warehouseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.list({ warehouse_id: warehouseId });
      const inventoryList = Array.isArray(response) ? response : response.data || [];
      set({ inventory: inventoryList, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch inventory',
        isLoading: false,
      });
    }
  },

  updateInventory: async (id: string, data: Partial<Inventory>) => {
    set({ isLoading: true, error: null });
    try {
      const inventory = await inventoryApi.update(id, data);
      set((state) => ({
        inventory: state.inventory.map((i) => (i.id === id ? inventory : i)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update inventory',
        isLoading: false,
      });
      return false;
    }
  },

  fetchWarehouseOrders: async (warehouseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { ordersApi } = await import('@/lib/api');
      const response = await ordersApi.list({ warehouse_id: warehouseId });
      const orderList = Array.isArray(response) ? response : response.data || [];
      set({ orders: orderList, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false,
      });
    }
  },

  fetchPendingProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const pendingProducts = await adminApi.pendingProducts();
      set({ pendingProducts, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch pending products',
        isLoading: false,
      });
    }
  },

  approveProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.approveProduct(id);
      set((state) => ({
        pendingProducts: state.pendingProducts.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to approve product',
        isLoading: false,
      });
      return false;
    }
  },

  rejectProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.rejectProduct(id);
      set((state) => ({
        pendingProducts: state.pendingProducts.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reject product',
        isLoading: false,
      });
      return false;
    }
  },

  fetchMarginRules: async () => {
    set({ isLoading: true, error: null });
    try {
      const marginRules = await adminApi.margins.list();
      set({ marginRules, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch margin rules',
        isLoading: false,
      });
    }
  },

  createMarginRule: async (data: Partial<MarginRule>) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await adminApi.margins.create(data);
      set((state) => ({
        marginRules: [...state.marginRules, rule],
        isLoading: false,
      }));
      return rule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create margin rule',
        isLoading: false,
      });
      return null;
    }
  },

  updateMarginRule: async (id: string, data: Partial<MarginRule>) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await adminApi.margins.update(id, data);
      set((state) => ({
        marginRules: state.marginRules.map((r) => (r.id === id ? rule : r)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update margin rule',
        isLoading: false,
      });
      return false;
    }
  },

  fetchPromotions: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const promotions = await adminApi.promotions.list(status ? { status } : undefined);
      set({ promotions, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch promotions',
        isLoading: false,
      });
    }
  },

  createPromotion: async (data: Partial<Promotion>) => {
    set({ isLoading: true, error: null });
    try {
      const promotion = await adminApi.promotions.create(data);
      set((state) => ({
        promotions: [...state.promotions, promotion],
        isLoading: false,
      }));
      return promotion;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create promotion',
        isLoading: false,
      });
      return null;
    }
  },

  updatePromotion: async (id: string, data: Partial<Promotion>) => {
    set({ isLoading: true, error: null });
    try {
      const promotion = await adminApi.promotions.update(id, data);
      set((state) => ({
        promotions: state.promotions.map((p) => (p.id === id ? promotion : p)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update promotion',
        isLoading: false,
      });
      return false;
    }
  },

  deletePromotion: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.promotions.delete(id);
      set((state) => ({
        promotions: state.promotions.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete promotion',
        isLoading: false,
      });
      return false;
    }
  },

  fetchAuditLogs: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApi.auditLogs.list(params);
      const logs = Array.isArray(response) ? response : response.data || [];
      set({ auditLogs: logs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch audit logs',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
