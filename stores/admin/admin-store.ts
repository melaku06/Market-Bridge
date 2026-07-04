import { create } from 'zustand';
import { adminApi, usersApi } from '@/lib/api';
import type { Product, MarginRule, Promotion, AuditLog, SystemSettings, User } from '@/lib/types';

type SafeUser = Omit<User, 'password_hash'>;

interface AdminState {
  pendingProducts: (Product & { warehouse_name: string; warehouse_owner: string })[];
  marginRules: MarginRule[];
  promotions: Promotion[];
  auditLogs: AuditLog[];
  customers: SafeUser[];
  systemSettings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;

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
  fetchAuditLogs: (params?: {
    actor_role?: string;
    action?: string;
    entity_type?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
  fetchCustomers: (params?: { role?: string; status?: string; search?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (data: Partial<SystemSettings>) => Promise<boolean>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  pendingProducts: [],
  marginRules: [],
  promotions: [],
  auditLogs: [],
  customers: [],
  systemSettings: null,
  isLoading: false,
  error: null,

  fetchPendingProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const pendingProducts = await adminApi.pendingProducts();
      set({ pendingProducts, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch pending products', isLoading: false });
    }
  },

  approveProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.approveProduct(id);
      set((s) => ({
        pendingProducts: s.pendingProducts.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to approve product', isLoading: false });
      return false;
    }
  },

  rejectProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.rejectProduct(id);
      set((s) => ({
        pendingProducts: s.pendingProducts.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to reject product', isLoading: false });
      return false;
    }
  },

  fetchMarginRules: async () => {
    set({ isLoading: true, error: null });
    try {
      const marginRules = await adminApi.margins.list();
      set({ marginRules, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch margin rules', isLoading: false });
    }
  },

  createMarginRule: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await adminApi.margins.create(data);
      set((s) => ({ marginRules: [...s.marginRules, rule], isLoading: false }));
      return rule;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create margin rule', isLoading: false });
      return null;
    }
  },

  updateMarginRule: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await adminApi.margins.update(id, data);
      set((s) => ({
        marginRules: s.marginRules.map((r) => (r.id === id ? rule : r)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update margin rule', isLoading: false });
      return false;
    }
  },

  fetchPromotions: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const promotions = await adminApi.promotions.list(status ? { status } : undefined);
      set({ promotions, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch promotions', isLoading: false });
    }
  },

  createPromotion: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const promotion = await adminApi.promotions.create(data);
      set((s) => ({ promotions: [...s.promotions, promotion], isLoading: false }));
      return promotion;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create promotion', isLoading: false });
      return null;
    }
  },

  updatePromotion: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const promotion = await adminApi.promotions.update(id, data);
      set((s) => ({
        promotions: s.promotions.map((p) => (p.id === id ? promotion : p)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update promotion', isLoading: false });
      return false;
    }
  },

  deletePromotion: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.promotions.delete(id);
      set((s) => ({
        promotions: s.promotions.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete promotion', isLoading: false });
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
      set({ error: error instanceof Error ? error.message : 'Failed to fetch audit logs', isLoading: false });
    }
  },

  fetchCustomers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersApi.list(params);
      const customerList = Array.isArray(response) ? response : response.data || [];
      set({ customers: customerList, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch customers', isLoading: false });
    }
  },

  fetchSystemSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await adminApi.systemSettings.get();
      set({ systemSettings: settings, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch system settings', isLoading: false });
    }
  },

  updateSystemSettings: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const settings = await adminApi.systemSettings.update(data);
      set({ systemSettings: settings, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update system settings', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
