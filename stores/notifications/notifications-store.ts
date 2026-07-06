import { create } from 'zustand';
import { notificationsApi } from '@/lib/api';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory' | 'telegram';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  data?: string | null;
  action_url?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

interface NotificationsState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchNotifications: (params?: {
    user_id?: string;
    type?: string;
    is_read?: boolean;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: (userId: string) => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  addLiveNotification: (notification: NotificationItem) => void;
  updateLiveNotification: (notification: NotificationItem) => void;
  removeLiveNotification: (id: string) => void;
  clearError: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationsApi.list(params as Record<string, string>);
      const notificationList = (Array.isArray(response) ? response : response.data || []) as unknown as NotificationItem[];

      const unreadCount = notificationList.filter((n) => !n.is_read).length;

      set({
        notifications: notificationList,
        unreadCount,
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
    try {
      await notificationsApi.update(id, { is_read: true } as unknown as Record<string, unknown>);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark as read' });
      return false;
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      const { notifications } = get();
      const unreadNotifications = notifications.filter((n) => !n.is_read && n.user_id === userId);

      await Promise.all(
        unreadNotifications.map((n) => notificationsApi.update(n.id, { is_read: true } as unknown as Record<string, unknown>))
      );

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.user_id === userId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ),
        unreadCount: 0,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark all as read' });
      return false;
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationsApi.delete(id);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: notification && !notification.is_read ? state.unreadCount - 1 : state.unreadCount,
        };
      });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete notification' });
      return false;
    }
  },

  addLiveNotification: (notification: NotificationItem) => {
    set((state) => {
      if (state.notifications.some((n) => n.id === notification.id)) return state;
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: notification.is_read ? state.unreadCount : state.unreadCount + 1,
      };
    });
  },

  updateLiveNotification: (notification: NotificationItem) => {
    set((state) => {
      const existing = state.notifications.find((n) => n.id === notification.id);
      if (!existing) return state;

      const wasUnread = !existing.is_read;
      const isUnread = !notification.is_read;

      return {
        notifications: state.notifications.map((n) =>
          n.id === notification.id ? notification : n
        ),
        unreadCount: wasUnread && !isUnread
          ? Math.max(0, state.unreadCount - 1)
          : !wasUnread && isUnread
            ? state.unreadCount + 1
            : state.unreadCount,
      };
    });
  },

  removeLiveNotification: (id: string) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.is_read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  clearError: () => set({ error: null }),
}));
