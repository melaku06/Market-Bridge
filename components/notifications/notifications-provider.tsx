'use client';

import { ReactNode } from 'react';
import { useLiveNotifications } from '@/hooks/use-live-notifications';
import { useAuth } from '@/components/auth/auth-provider';

/**
 * Wraps the app to activate notification polling
 * for the authenticated user. Must be placed
 * inside AuthProvider but outside the main layout content.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  useLiveNotifications();
  return <>{children}</>;
}
