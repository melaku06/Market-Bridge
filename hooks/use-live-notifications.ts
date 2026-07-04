'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase, isRealtimeEnabled } from '@/lib/supabase/client';
import { useNotificationsStore } from '@/stores/notifications-store';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
 * Subscribes to Supabase Realtime changes on the notifications table
 * for the current authenticated user. Automatically fetches initial
 * notifications on mount, then receives INSERT/UPDATE/DELETE events
 * via WebSocket for live updates.
 *
 * Shows a toast notification when a new notification arrives.
 *
 * Note: If using local PostgreSQL without Supabase, realtime is disabled
 * and notifications are fetched via polling instead.
 */
export function useLiveNotifications() {
  const { user, isAuthenticated } = useAuth();
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications);
  const addLiveNotification = useNotificationsStore((s) => s.addLiveNotification);
  const updateLiveNotification = useNotificationsStore((s) => s.updateLiveNotification);
  const removeLiveNotification = useNotificationsStore((s) => s.removeLiveNotification);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleNewNotification = useCallback(
    (notification: LiveNotification) => {
      addLiveNotification(notification);

      if (notification.priority === 'high') {
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
          action: notification.action_url
            ? {
                label: 'View',
                onClick: () => window.location.assign(notification.action_url!),
              }
            : undefined,
        });
      } else {
        toast(notification.title, {
          description: notification.message,
          duration: 4000,
        });
      }
    },
    [addLiveNotification]
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // Fetch initial notifications
    fetchNotifications({ user_id: user.id, limit: 20 });

    // If Supabase realtime is not configured, set up polling instead
    if (!isRealtimeEnabled || !supabase) {
      // Poll for notifications every 30 seconds as fallback
      const pollInterval = setInterval(() => {
        fetchNotifications({ user_id: user.id, limit: 20 });
      }, 30000);

      return () => {
        clearInterval(pollInterval);
      };
    }

    // Subscribe to realtime changes filtered by user_id
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          handleNewNotification(payload.new as LiveNotification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          updateLiveNotification(payload.new as LiveNotification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          removeLiveNotification(payload.old.id);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
      channelRef.current = null;
    };
  }, [isAuthenticated, user?.id, fetchNotifications, handleNewNotification, updateLiveNotification, removeLiveNotification]);

  return {
    isConnected: channelRef.current !== null,
    isRealtimeEnabled,
  };
}
