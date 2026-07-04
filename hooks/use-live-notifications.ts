'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useNotificationsStore } from '@/stores/notifications/notifications-store';

export interface LiveNotification {
  id: string;
  user_id: string;
  type: 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  data: string | null;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Hook for fetching notifications with polling.
 * Uses PostgreSQL via Prisma for all data persistence.
 * Polls every 30 seconds to fetch new notifications.
 */
export function useLiveNotifications() {
  const { user, isAuthenticated } = useAuth();
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // Fetch initial notifications
    fetchNotifications({ user_id: user.id, limit: 20 });

    // Set up polling interval (every 30 seconds)
    pollingRef.current = setInterval(() => {
      fetchNotifications({ user_id: user.id, limit: 20 });
    }, 30000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isAuthenticated, user?.id, fetchNotifications]);

  return {
    isConnected: pollingRef.current !== null,
    isRealtimeEnabled: false,
  };
}
