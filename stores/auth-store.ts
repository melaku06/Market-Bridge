import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import type { AuthUser, UserRole } from '@/lib/auth/types';
import { getDashboardPath, hasRole } from '@/lib/auth/types';
import { toast } from '@/hooks/use-toast';

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
            const message = error.message === 'Invalid login credentials'
              ? 'Invalid email or password'
              : error.message;
            set({ error: message, isLoading: false });
            toast({
              title: 'Login Failed',
              description: message,
              variant: 'destructive',
            });
            return false;
          }

          if (data.user) {
            // Get profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profile) {
              if (!profile.is_active) {
                await supabase.auth.signOut();
                set({
                  error: 'Your account has been deactivated',
                  isLoading: false,
                });
                toast({
                  title: 'Account Deactivated',
                  description: 'Please contact support.',
                  variant: 'destructive',
                });
                return false;
              }

              let warehouse = null;
              if (profile.warehouse_id) {
                const { data: wh } = await supabase
                  .from('warehouses')
                  .select('*')
                  .eq('id', profile.warehouse_id)
                  .maybeSingle();
                warehouse = wh;
              }

              const user: AuthUser = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                phone: profile.phone || undefined,
                avatar_url: profile.avatar_url || undefined,
                role: profile.role,
                warehouse_id: profile.warehouse_id || undefined,
                warehouse: warehouse || undefined,
                is_active: profile.is_active,
              };

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });

              toast({
                title: 'Welcome back!',
                description: `Logged in as ${user.name}`,
              });
              return true;
            }
          }

          set({ isLoading: false });
          return false;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login failed';
          set({ error: message, isLoading: false });
          toast({
            title: 'Login Failed',
            description: message,
            variant: 'destructive',
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
            let message = error.message;
            if (message.includes('already registered')) {
              message = 'An account with this email already exists';
            }
            set({ error: message, isLoading: false });
            toast({
              title: 'Registration Failed',
              description: message,
              variant: 'destructive',
            });
            return false;
          }

          if (data.user) {
            // Wait for profile creation
            let attempts = 0;
            let profile = null;
            while (attempts < 10 && !profile) {
              await new Promise(resolve => setTimeout(resolve, 200));
              const { data: p } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .maybeSingle();
              profile = p;
              attempts++;
            }

            if (profile) {
              const user: AuthUser = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                phone: profile.phone || undefined,
                avatar_url: profile.avatar_url || undefined,
                role: profile.role,
                warehouse_id: profile.warehouse_id || undefined,
                is_active: profile.is_active,
              };

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });

              toast({
                title: 'Account Created!',
                description: `Welcome to MarketBridge, ${user.name}!`,
              });
              return true;
            }
          }

          set({ isLoading: false });
          return false;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Registration failed';
          set({ error: message, isLoading: false });
          toast({
            title: 'Registration Failed',
            description: message,
            variant: 'destructive',
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          toast({
            title: 'Logged out',
            description: 'See you again soon!',
          });
        } catch {
          toast({
            title: 'Error',
            description: 'Failed to logout',
            variant: 'destructive',
          });
        }
      },

      fetchUser: async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();

          if (!authUser) {
            set({
              user: null,
              isAuthenticated: false,
              isInitialized: true,
            });
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();

          if (profile) {
            let warehouse = null;
            if (profile.warehouse_id) {
              const { data: wh } = await supabase
                .from('warehouses')
                .select('*')
                .eq('id', profile.warehouse_id)
                .maybeSingle();
              warehouse = wh;
            }

            const user: AuthUser = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              phone: profile.phone || undefined,
              avatar_url: profile.avatar_url || undefined,
              role: profile.role,
              warehouse_id: profile.warehouse_id || undefined,
              warehouse: warehouse || undefined,
              is_active: profile.is_active,
            };

            set({
              user,
              isAuthenticated: true,
              isInitialized: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isInitialized: true,
            });
          }
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
            toast({
              title: 'Update Failed',
              description: error.message,
              variant: 'destructive',
            });
            return false;
          }

          // Refresh user
          await get().fetchUser();
          set({ isLoading: false });
          toast({
            title: 'Profile Updated',
            description: 'Your profile has been updated successfully.',
          });
          return true;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Update failed';
          set({ error: message, isLoading: false });
          toast({
            title: 'Update Failed',
            description: message,
            variant: 'destructive',
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