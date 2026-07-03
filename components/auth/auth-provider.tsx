'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthUser, UserRole } from '@/lib/auth/types';
import { getCurrentUser, getDashboardPath, hasRole } from '@/lib/auth/types';

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
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const isCustomer = () => hasRole(user, 'customer');
  const isWarehouse = () => hasRole(user, 'warehouse');
  const isAdmin = () => hasRole(user, 'admin');

  useEffect(() => {
    // Initial session check
    refreshUser().finally(() => setIsLoading(false));

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUser]);

  // Route protection
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/products', '/search', '/categories'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path)) || pathname === '/';

    // Allow public paths
    if (isPublicPath) return;

    // Check protected routes
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

    // Redirect authenticated users from auth pages
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
