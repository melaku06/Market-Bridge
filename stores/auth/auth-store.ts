import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, UserRole } from '@/lib/auth/types';
import { getDashboardPath, hasRole } from '@/lib/auth/types';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;

  isAuthenticated: () => boolean;
  isCustomer: () => boolean;
  isWarehouse: () => boolean;
  isAdmin: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  getDashboardPath: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isInitialized: false,
      error: null,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      reset: () => set({ user: null, isLoading: false, isInitialized: true, error: null }),

      isAuthenticated: () => get().user !== null,
      isCustomer: () => hasRole(get().user, 'customer'),
      isWarehouse: () => hasRole(get().user, 'warehouse'),
      isAdmin: () => hasRole(get().user, 'admin'),
      hasRole: (role) => hasRole(get().user, role),
      getDashboardPath: () => {
        const { user } = get();
        if (!user) return '/login';
        return getDashboardPath(user.role);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
