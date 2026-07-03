'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AuthUser, UserRole } from '@/lib/auth/types';
import { getDashboardPath, hasRole } from '@/lib/auth/types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCustomer: () => boolean;
  isWarehouse: () => boolean;
  isAdmin: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      return null;
    }
  }, []);

  const isCustomer = () => hasRole(user, 'customer');
  const isWarehouse = () => hasRole(user, 'warehouse');
  const isAdmin = () => hasRole(user, 'admin');

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/products', '/search', '/categories'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path)) || pathname === '/';

    if (isPublicPath) return;

    if (pathname?.startsWith('/admin') && !isAdmin()) {
      router.push('/login');
      return;
    }

    if (pathname?.startsWith('/warehouse') && !isWarehouse()) {
      router.push('/login');
      return;
    }

    if (pathname?.startsWith('/dashboard') && !isCustomer()) {
      router.push('/login');
      return;
    }

    if (user && (pathname === '/login' || pathname === '/register')) {
      const dashboardPath = getDashboardPath(user.role);
      router.push(dashboardPath);
    }
  }, [user, isLoading, pathname, router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isCustomer,
    isWarehouse,
    isAdmin,
    hasRole: (role) => hasRole(user, role),
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
