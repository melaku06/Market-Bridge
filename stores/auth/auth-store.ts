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

  login: (email: string, password: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;

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

      login: async (email, password) => {
        set({ error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const data = await res.json();
            set({ error: data.error || 'Login failed' });
            return { success: false, error: data.error };
          }

          const data = await res.json();
          set({ user: data.user, error: null });
          return { success: true, user: data.user };
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Login failed';
          set({ error: msg });
          return { success: false, error: msg };
        }
      },

      register: async (data) => {
        set({ error: null });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const resData = await res.json();
            set({ error: resData.error || 'Registration failed' });
            return { success: false, error: resData.error };
          }

          const resData = await res.json();
          set({ user: resData.user, error: null });
          return { success: true, user: resData.user };
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Registration failed';
          set({ error: msg });
          return { success: false, error: msg };
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch {
          // Even if the API call fails, clear local state
        }
        set({ user: null, error: null });
      },

      refreshUser: async () => {
        try {
          const res = await fetch('/api/auth/me', {
            credentials: 'include',
          });

          if (res.ok) {
            const data = await res.json();
            set({ user: data.user });
            return data.user as AuthUser;
          } else {
            set({ user: null });
            return null;
          }
        } catch {
          set({ user: null });
          return null;
        }
      },

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
