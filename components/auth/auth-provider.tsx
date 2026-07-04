'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AuthUser, UserRole } from '@/lib/auth/types';
import { getDashboardPath, hasRole } from '@/lib/auth/types';
import { useAuthStore } from '@/stores/auth/auth-store';

const PUBLIC_EXACT = new Set(['/', '/login', '/register', '/forgot-password', '/product-request']);
const PUBLIC_PREFIXES = ['/products', '/search', '/categories'];

function isPublicPath(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'));
}

function getRoleForPath(pathname: string): UserRole | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/warehouse')) return 'warehouse';
  if (pathname.startsWith('/dashboard')) return 'customer';
  return null;
}

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
    if (isLoading || !isInitialized) return;
    if (!pathname) return;

    if (isPublicPath(pathname)) {
      if (user && (pathname === '/login' || pathname === '/register')) {
        router.push(getDashboardPath(user.role));
      }
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const requiredRole = getRoleForPath(pathname);
    if (requiredRole && !hasRole(user, requiredRole)) {
      router.push('/forbidden');
      return;
    }
  }, [user, isLoading, isInitialized, pathname, router]);

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
