import { create } from 'zustand';
import { ordersApi } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
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
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };

  fetchOrders: (params?: {
    customer_id?: string;
    warehouse_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (data: Partial<Order>) => Promise<Order | null>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<boolean>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (id: string) => Promise<boolean>;
  computeStatistics: () => void;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: { total: 0, limit: 20, offset: 0, has_more: false },
  statistics: { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },

  fetchOrders: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.list(params);
      const orderList = Array.isArray(response) ? response : response.data || [];
      const pagination = Array.isArray(response)
        ? { total: orderList.length, limit: params?.limit || 20, offset: params?.offset || 0, has_more: false }
        : response.pagination;

      set({ orders: orderList, pagination: pagination || get().pagination, isLoading: false });
      get().computeStatistics();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch orders', isLoading: false });
    }
  },

  fetchOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.get(id);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch order', isLoading: false });
    }
  },

  createOrder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.create(data);
      set((s) => ({ orders: [order, ...s.orders], isLoading: false }));
      get().computeStatistics();
      return order;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create order', isLoading: false });
      return null;
    }
  },

  updateOrder: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.update(id, data);
      set((s) => ({
        orders: s.orders.map((o) => (o.id === id ? order : o)),
        currentOrder: s.currentOrder?.id === id ? order : s.currentOrder,
        isLoading: false,
      }));
      get().computeStatistics();
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update order', isLoading: false });
      return false;
    }
  },

  updateOrderStatus: async (id, status) => {
    return get().updateOrder(id, { status });
  },

  cancelOrder: async (id) => {
    return get().updateOrder(id, { status: 'cancelled' });
  },

  computeStatistics: () => {
    const { orders } = get();
    set({
      statistics: {
        total: orders.length,
        pending: orders.filter((o) => o.status === 'pending').length,
        processing: orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length,
        shipped: orders.filter((o) => o.status === 'shipped').length,
        delivered: orders.filter((o) => o.status === 'delivered').length,
        cancelled: orders.filter((o) => o.status === 'cancelled').length,
      },
    });
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),
}));
