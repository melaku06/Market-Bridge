'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AuthUser, UserRole } from '@/lib/auth/types';
import { getDashboardPath, hasRole } from '@/lib/auth/types';
import { useAuthStore } from '@/stores/auth/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user as AuthUser;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      return null;
    }
  }, [setUser]);

  useEffect(() => {
    if (isInitialized) return;
    refreshUser().finally(() => {
      setLoading(false);
      setInitialized(true);
    });
  }, [refreshUser, isInitialized, setLoading, setInitialized]);

  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/products', '/search', '/categories'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path)) || pathname === '/';

    if (isPublicPath) return;

    if (pathname?.startsWith('/admin') && !hasRole(user, 'admin')) {
      router.push('/login');
      return;
    }

    if (pathname?.startsWith('/warehouse') && !hasRole(user, 'warehouse')) {
      router.push('/login');
      return;
    }

    if (pathname?.startsWith('/dashboard') && !hasRole(user, 'customer')) {
      router.push('/login');
      return;
    }

    if (user && (pathname === '/login' || pathname === '/register')) {
      const dashboardPath = getDashboardPath(user.role);
      router.push(dashboardPath);
    }
  }, [user, isLoading, pathname, router]);

  return <>{children}</>;
}

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user as AuthUser;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      return null;
    }
  }, [setUser]);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isCustomer: () => hasRole(user, 'customer'),
    isWarehouse: () => hasRole(user, 'warehouse'),
    isAdmin: () => hasRole(user, 'admin'),
    hasRole: (role: UserRole | UserRole[]) => hasRole(user, role),
    refreshUser,
  };
}
