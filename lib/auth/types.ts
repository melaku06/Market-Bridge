export type UserRole = 'customer' | 'warehouse' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  warehouse_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  telegram_username?: string | null;
}

export interface AuthUser extends User {
  warehouse?: {
    id: string;
    name: string;
    email: string;
    status: string;
  } | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  phone?: string;
  telegram_username?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'warehouse':
      return '/warehouse';
    default:
      return '/dashboard';
  }
}

export function hasRole(user: AuthUser | null, allowedRoles: UserRole | UserRole[]): boolean {
  if (!user) return false;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
}

export function isCustomer(user: AuthUser | null): boolean {
  return hasRole(user, 'customer');
}

export function isWarehouse(user: AuthUser | null): boolean {
  return hasRole(user, 'warehouse');
}

export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin');
}
