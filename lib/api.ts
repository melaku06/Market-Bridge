/**
 * API Client
 * Centralized API client for all data fetching.
 * All data is persisted in Supabase PostgreSQL via API routes.
 */

import type {
  Product,
  Category,
  Order,
  Warehouse,
  Inventory,
  User,
  Notification,
  Review,
  WishlistItem,
  Address,
  ProductRequest,
  MarginRule,
  Promotion,
  AuditLog,
  SystemSettings,
  TelegramBot,
  TelegramChannel,
  TelegramGroup,
  TelegramPostTemplate,
  TelegramPost,
  TelegramActivityLog,
} from '@/lib/types';

const API_BASE = '/api';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, searchParams } = options;

  let url = `${API_BASE}${endpoint}`;
  if (searchParams) {
    const params = new URLSearchParams(searchParams);
    url += `?${params.toString()}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data ?? data;
}

type SafeUser = Omit<User, 'password_hash'>;

// Products API
export const productsApi = {
  list: (params?: { category?: string; status?: string; warehouse_id?: string; search?: string; limit?: number; offset?: number }) =>
    request<{ data: Product[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/products', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<Product>(`/products/${id}`),

  create: (data: Partial<Product>) =>
    request<Product>('/products', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),
};

// Categories API
export const categoriesApi = {
  list: () =>
    request<Category[]>('/categories'),

  get: (id: string) =>
    request<Category>(`/categories/${id}`),

  create: (data: Partial<Category>) =>
    request<Category>('/categories', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Category>) =>
    request<Category>(`/categories/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  list: (params?: { customer_id?: string; warehouse_id?: string; status?: string; limit?: number; offset?: number }) =>
    request<{ data: Order[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/orders', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<Order>(`/orders/${id}`),

  create: (data: Partial<Order>) =>
    request<Order>('/orders', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Order>) =>
    request<Order>(`/orders/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),
};

// Warehouses API
export const warehousesApi = {
  list: (params?: { status?: string; limit?: number; offset?: number }) =>
    request<{ data: Warehouse[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/warehouses', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<Warehouse>(`/warehouses/${id}`),

  create: (data: Partial<Warehouse>) =>
    request<Warehouse>('/warehouses', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Warehouse>) =>
    request<Warehouse>(`/warehouses/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),
};

// Inventory API
export const inventoryApi = {
  list: (params?: { warehouse_id?: string; product_id?: string; status?: string; limit?: number; offset?: number }) =>
    request<{ data: Inventory[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/inventory', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<Inventory>(`/inventory/${id}`),

  create: (data: Partial<Inventory>) =>
    request<Inventory>('/inventory', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Inventory>) =>
    request<Inventory>(`/inventory/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),
};

// Users API
export const usersApi = {
  list: (params?: { role?: string; status?: string; search?: string; limit?: number; offset?: number }) =>
    request<{ data: SafeUser[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/users', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<SafeUser>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    request<SafeUser>(`/users/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: SafeUser; token: string }>('/auth', { method: 'POST', body: { email, password } }),

  getSession: () =>
    request<SafeUser>('/auth'),
};

// Notifications API
export const notificationsApi = {
  list: (params?: { user_id?: string; type?: string; read?: string; limit?: number; offset?: number }) =>
    request<{ data: Notification[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/notifications', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<Notification>(`/notifications/${id}`),

  create: (data: Partial<Notification>) =>
    request<Notification>('/notifications', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Notification>) =>
    request<Notification>(`/notifications/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  list: (params?: { product_id?: string; customer_id?: string; limit?: number; offset?: number }) =>
    request<{ data: Review[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/reviews', { searchParams: params as Record<string, string> }),

  create: (data: Partial<Review>) =>
    request<Review>('/reviews', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Review>) =>
    request<Review>(`/reviews/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/reviews/${id}`, { method: 'DELETE' }),
};

// Wishlist API
export const wishlistApi = {
  list: (customer_id: string) =>
    request<(WishlistItem & { product: Product | null })[]>(`/wishlist?customer_id=${customer_id}`),

  add: (customer_id: string, product_id: string) =>
    request<WishlistItem>('/wishlist', { method: 'POST', body: { customer_id, product_id } }),

  remove: (customer_id: string, product_id: string) =>
    request<{ success: boolean }>(`/wishlist?customer_id=${customer_id}&product_id=${product_id}`, { method: 'DELETE' }),
};

// Analytics API
export const analyticsApi = {
  get: (params?: { type?: string; warehouse_id?: string }) =>
    request<Record<string, unknown>>('/analytics', { searchParams: params as Record<string, string> }),
};

// Addresses API
export const addressesApi = {
  list: (customer_id: string) =>
    request<{ data: Address[] }>(`/addresses?customer_id=${customer_id}`),

  create: (data: Partial<Address>) =>
    request<Address>('/addresses', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<Address>) =>
    request<Address>(`/addresses/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/addresses/${id}`, { method: 'DELETE' }),

  setDefault: (id: string, customer_id: string) =>
    request<Address>(`/addresses/${id}`, { method: 'PUT', body: { is_default: true, customer_id } }),
};

// Product Requests API
export const productRequestsApi = {
  list: (params?: { customer_id?: string; status?: string }) =>
    request<{ data: ProductRequest[] }>('/product-requests', { searchParams: params as Record<string, string> }),

  create: (data: Partial<ProductRequest>) =>
    request<ProductRequest>('/product-requests', { method: 'POST', body: data as Record<string, unknown> }),

  update: (id: string, data: Partial<ProductRequest>) =>
    request<ProductRequest>(`/product-requests/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/product-requests/${id}`, { method: 'DELETE' }),
};

// Admin API
export const adminApi = {
  pendingProducts: () =>
    request<(Product & { warehouse_name: string; warehouse_owner: string })[]>('/admin/products/pending'),

  approveProduct: (id: string) =>
    request<Product>(`/admin/products/${id}/approve`, { method: 'POST' }),

  rejectProduct: (id: string) =>
    request<Product>(`/admin/products/${id}/reject`, { method: 'POST' }),

  margins: {
    list: () =>
      request<MarginRule[]>('/admin/margins'),

    create: (data: Partial<MarginRule>) =>
      request<MarginRule>('/admin/margins', { method: 'POST', body: data as Record<string, unknown> }),

    update: (id: string, data: Partial<MarginRule>) =>
      request<MarginRule>(`/admin/margins/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),
  },

  promotions: {
    list: (params?: { status?: string }) =>
      request<Promotion[]>('/admin/promotions', { searchParams: params as Record<string, string> }),

    get: (id: string) =>
      request<Promotion>(`/admin/promotions/${id}`),

    create: (data: Partial<Promotion>) =>
      request<Promotion>('/admin/promotions', { method: 'POST', body: data as Record<string, unknown> }),

    update: (id: string, data: Partial<Promotion>) =>
      request<Promotion>(`/admin/promotions/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/admin/promotions/${id}`, { method: 'DELETE' }),
  },

  auditLogs: {
    list: (params?: { actor_role?: string; action?: string; entity_type?: string; limit?: number; offset?: number }) =>
      request<{ data: AuditLog[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/admin/audit-logs', { searchParams: params as Record<string, string> }),
  },

  systemSettings: {
    get: () =>
      request<SystemSettings>('/admin/system-settings'),

    update: (data: Partial<SystemSettings>) =>
      request<SystemSettings>('/admin/system-settings', { method: 'PUT', body: data as Record<string, unknown> }),
  },

  telegramBot: {
    get: () =>
      request<{ data: TelegramBot | null }>('/telegram/bot'),

    save: (data: Partial<TelegramBot>) =>
      request<{ data: TelegramBot }>('/telegram/bot', { method: 'POST', body: data as Record<string, unknown> }),

    update: (data: Partial<TelegramBot>) =>
      request<{ data: TelegramBot }>('/telegram/bot', { method: 'PUT', body: data as Record<string, unknown> }),
  },

  telegramChannels: {
    list: (params?: { is_active?: boolean }) =>
      request<{ data: TelegramChannel[] }>('/telegram/channels', { searchParams: params as Record<string, string> }),

    create: (data: Partial<TelegramChannel>) =>
      request<{ data: TelegramChannel }>('/telegram/channels', { method: 'POST', body: data as Record<string, unknown> }),

    update: (id: string, data: Partial<TelegramChannel>) =>
      request<{ data: TelegramChannel }>(`/telegram/channels/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/telegram/channels/${id}`, { method: 'DELETE' }),
  },

  telegramGroups: {
    list: (params?: { is_active?: boolean }) =>
      request<{ data: TelegramGroup[] }>('/telegram/groups', { searchParams: params as Record<string, string> }),

    create: (data: Partial<TelegramGroup>) =>
      request<{ data: TelegramGroup }>('/telegram/groups', { method: 'POST', body: data as Record<string, unknown> }),

    update: (id: string, data: Partial<TelegramGroup>) =>
      request<{ data: TelegramGroup }>(`/telegram/groups/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/telegram/groups/${id}`, { method: 'DELETE' }),
  },

  telegramTemplates: {
    list: (params?: { is_active?: boolean }) =>
      request<{ data: TelegramPostTemplate[] }>('/telegram/templates', { searchParams: params as Record<string, string> }),

    create: (data: Partial<TelegramPostTemplate>) =>
      request<{ data: TelegramPostTemplate }>('/telegram/templates', { method: 'POST', body: data as Record<string, unknown> }),

    update: (id: string, data: Partial<TelegramPostTemplate>) =>
      request<{ data: TelegramPostTemplate }>(`/telegram/templates/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/telegram/templates/${id}`, { method: 'DELETE' }),
  },

  telegramPosts: {
    list: (params?: { status?: string; product_id?: string; limit?: number; offset?: number }) =>
      request<{ data: TelegramPost[] }>('/telegram/posts', { searchParams: params as Record<string, string> }),

    get: (id: string) =>
      request<{ data: TelegramPost }>(`/telegram/posts/${id}`),

    create: (data: Record<string, unknown>) =>
      request<{ data: TelegramPost }>('/telegram/posts', { method: 'POST', body: data }),

    update: (id: string, data: Partial<TelegramPost>) =>
      request<{ data: TelegramPost }>(`/telegram/posts/${id}`, { method: 'PUT', body: data as Record<string, unknown> }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/telegram/posts/${id}`, { method: 'DELETE' }),
  },

  telegramActivityLogs: {
    list: (params?: { bot_id?: string; post_id?: string; action?: string; status?: string; limit?: number; offset?: number }) =>
      request<{ data: TelegramActivityLog[] }>('/telegram/activity-logs', { searchParams: params as Record<string, string> }),
  },
};
