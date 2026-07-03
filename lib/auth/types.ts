import { supabase } from '@/lib/supabase/client';
import type { Profile, Warehouse } from '@/lib/supabase/client';

export type UserRole = 'customer' | 'warehouse' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  warehouse_id?: string;
  warehouse?: Warehouse;
  is_active: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Sign up a new user
export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'customer'
): Promise<{ user: AuthUser | null; error: string | null }> {
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
      return { user: null, error: error.message };
    }

    // The profile is created automatically via trigger
    // But we need to fetch it
    if (data.user) {
      const profile = await getProfile(data.user.id);
      return { user: profile, error: null };
    }

    return { user: null, error: 'Failed to create account' };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'Sign up failed' };
  }
}

// Sign in with email/password
export async function signIn(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        return { user: null, error: 'Invalid email or password' };
      }
      return { user: null, error: error.message };
    }

    if (data.user) {
      const profile = await getProfile(data.user.id);
      return { user: profile, error: null };
    }

    return { user: null, error: 'Failed to sign in' };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'Sign in failed' };
  }
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Sign out failed' };
  }
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return { session: null, error: error.message };
  }
  return { session: data.session, error: null };
}

// Get current user with profile
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return await getProfile(user.id);
  } catch {
    return null;
  }
}

// Get profile by user ID
async function getProfile(userId: string): Promise<AuthUser | null> {
  try {
    // Get profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !profile) {
      return null;
    }

    // If warehouse user, get warehouse details
    let warehouse: Warehouse | undefined;
    if (profile.warehouse_id) {
      const { data: wh } = await supabase
        .from('warehouses')
        .select('*')
        .eq('id', profile.warehouse_id)
        .maybeSingle();
      warehouse = wh || undefined;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone || undefined,
      avatar_url: profile.avatar_url || undefined,
      role: profile.role,
      warehouse_id: profile.warehouse_id || undefined,
      warehouse,
      is_active: profile.is_active,
    };
  } catch {
    return null;
  }
}

// Update profile
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'name' | 'phone' | 'avatar_url'>>
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return { user: null, error: error.message };
    }

    const user = await getProfile(userId);
    return { user, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'Update failed' };
  }
}

// Check if user has specific role
export function hasRole(user: AuthUser | null, role: UserRole | UserRole[]): boolean {
  if (!user) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
}

// Check if user can access customer area
export function isCustomer(user: AuthUser | null): boolean {
  return hasRole(user, 'customer');
}

// Check if user can access warehouse area
export function isWarehouse(user: AuthUser | null): boolean {
  return hasRole(user, 'warehouse');
}

// Check if user can access admin area
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin');
}

// Redirect paths based on role
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'warehouse':
      return '/warehouse';
    case 'customer':
    default:
      return '/dashboard';
  }
}

// Auth state change listener
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      const user = await getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}
