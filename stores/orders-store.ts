import { create } from 'zustand';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/types';

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

  // Actions
  fetchOrders: (params?: { customer_id?: string; warehouse_id?: string; status?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (data: Partial<Order>) => Promise<Order | null>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<boolean>;
  cancelOrder: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    has_more: false,
  },

  fetchOrders: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.list(params);
      const orderList = Array.isArray(response) ? response : response.data || [];
      const pagination = Array.isArray(response)
        ? { total: orderList.length, limit: params?.limit || 20, offset: params?.offset || 0, has_more: false }
        : response.pagination;

      set({
        orders: orderList,
        pagination: pagination || get().pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false,
      });
    }
  },

  fetchOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.get(id);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch order',
        isLoading: false,
      });
    }
  },

  createOrder: async (data: Partial<Order>) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.create(data);
      set((state) => ({
        orders: [order, ...state.orders],
        isLoading: false,
      }));
      return order;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create order',
        isLoading: false,
      });
      return null;
    }
  },

  updateOrder: async (id: string, data: Partial<Order>) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.update(id, data);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? order : o)),
        currentOrder: state.currentOrder?.id === id ? order : state.currentOrder,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update order',
        isLoading: false,
      });
      return false;
    }
  },

  cancelOrder: async (id: string) => {
    return get().updateOrder(id, { status: 'cancelled' });
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),
}));
