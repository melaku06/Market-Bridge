import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import type { AuthUser, UserRole } from '@/lib/auth/types';
import { getCurrentUser, getDashboardPath, hasRole } from '@/lib/auth/types';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (updates: { name?: string; phone?: string; avatar_url?: string }) => Promise<boolean>;
  clearError: () => void;

  // Role checks
  isCustomer: () => boolean;
  isWarehouse: () => boolean;
  isAdmin: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;

  // Navigation
  getDashboardPath: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({
              error: error.message === 'Invalid login credentials'
                ? 'Invalid email or password'
                : error.message,
              isLoading: false,
            });
            return false;
          }

          if (data.user) {
            const user = await getCurrentUser();
            if (user) {
              if (!user.is_active) {
                set({
                  error: 'Your account has been deactivated. Please contact support.',
                  isLoading: false,
                });
                await supabase.auth.signOut();
                return false;
              }
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            }
          }

          set({ isLoading: false });
          return false;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (email: string, password: string, name: string, role: UserRole = 'customer') => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role,
              },
            },
          });

          if (error) {
            if (error.message.includes('already registered')) {
              set({
                error: 'An account with this email already exists',
                isLoading: false,
              });
              return false;
            }
            set({ error: error.message, isLoading: false });
            return false;
          }

          if (data.user) {
            // Wait for profile to be created by trigger
            let attempts = 0;
            let user: AuthUser | null = null;
            while (attempts < 10 && !user) {
              await new Promise(resolve => setTimeout(resolve, 100));
              user = await getCurrentUser();
              attempts++;
            }

            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            }
          }

          set({ isLoading: false });
          return false;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchUser: async () => {
        try {
          const user = await getCurrentUser();
          set({
            user,
            isAuthenticated: !!user,
            isInitialized: true,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },

      updateProfile: async (updates: { name?: string; phone?: string; avatar_url?: string }) => {
        const { user } = get();
        if (!user) return false;

        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) {
            set({ error: error.message, isLoading: false });
            return false;
          }

          const updatedUser = await getCurrentUser();
          set({ user: updatedUser, isLoading: false });
          return true;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Update failed',
            isLoading: false,
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),

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
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
