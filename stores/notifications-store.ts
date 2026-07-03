import { create } from 'zustand';
import { notificationsApi } from '@/lib/api';
import type { Notification } from '@/lib/mock-db';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };

  // Actions
  fetchNotifications: (params?: { user_id?: string; type?: string; read?: string; limit?: number; offset?: number }) => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: (userId: string) => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    has_more: false,
  },

  fetchNotifications: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationsApi.list(params);
      const notificationList = Array.isArray(response) ? response : response.data || [];
      const pagination = Array.isArray(response)
        ? { total: notificationList.length, limit: params?.limit || 20, offset: params?.offset || 0, has_more: false }
        : response.pagination;

      const unreadCount = notificationList.filter((n) => !n.read).length;

      set({
        notifications: notificationList,
        unreadCount,
        pagination: pagination || get().pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  markAsRead: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const notification = await notificationsApi.update(id, { read: true });
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? notification : n)),
        unreadCount: Math.max(0, state.unreadCount - 1),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark as read',
        isLoading: false,
      });
      return false;
    }
  },

  markAllAsRead: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { notifications } = get();
      const unreadNotifications = notifications.filter((n) => !n.read && n.user_id === userId);

      await Promise.all(
        unreadNotifications.map((n) => notificationsApi.update(n.id, { read: true }))
      );

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.user_id === userId ? { ...n, read: true } : n
        ),
        unreadCount: 0,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark all as read',
        isLoading: false,
      });
      return false;
    }
  },

  deleteNotification: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await notificationsApi.delete(id);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
          isLoading: false,
        };
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete notification',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
