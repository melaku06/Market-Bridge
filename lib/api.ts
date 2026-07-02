/**
 * API Client
 * Centralized API client for all data fetching
 */

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

// Products API
export const productsApi = {
  list: (params?: { category?: string; status?: string; warehouse_id?: string; search?: string; limit?: number; offset?: number }) =>
    request<{ data: import('@/lib/mock-db').Product[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/products', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<import('@/lib/mock-db').Product>(`/products/${id}`),

  create: (data: Partial<import('@/lib/mock-db').Product>) =>
    request<import('@/lib/mock-db').Product>('/products', { method: 'POST', body: data }),

  update: (id: string, data: Partial<import('@/lib/mock-db').Product>) =>
    request<import('@/lib/mock-db').Product>(`/products/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),
};

// Categories API
export const categoriesApi = {
  list: () =>
    request<import('@/lib/mock-db').Category[]>('/categories'),

  get: (id: string) =>
    request<import('@/lib/mock-db').Category>(`/categories/${id}`),

  create: (data: Partial<import('@/lib/mock-db').Category>) =>
    request<import('@/lib/mock-db').Category>('/categories', { method: 'POST', body: data }),

  update: (id: string, data: Partial<import('@/lib/mock-db').Category>) =>
    request<import('@/lib/mock-db').Category>(`/categories/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  list: (params?: { customer_id?: string; warehouse_id?: string; status?: string; limit?: number; offset?: number }) =>
    request<{ data: import('@/lib/mock-db').Order[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/orders', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<import('@/lib/mock-db').Order>(`/orders/${id}`),

  create: (data: Partial<import('@/lib/mock-db').Order>) =>
    request<import('@/lib/mock-db').Order>('/orders', { method: 'POST', body: data }),

  update: (id: string, data: Partial<import('@/lib/mock-db').Order>) =>
    request<import('@/lib/mock-db').Order>(`/orders/${id}`, { method: 'PUT', body: data }),
};

// Warehouses API
export const warehousesApi = {
  list: (params?: { status?: string; limit?: number; offset?: number }) =>
    request<{ data: import('@/lib/mock-db').Warehouse[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/warehouses', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<import('@/lib/mock-db').Warehouse>(`/warehouses/${id}`),

  create: (data: Partial<import('@/lib/mock-db').Warehouse>) =>
    request<import('@/lib/mock-db').Warehouse>('/warehouses', { method: 'POST', body: data }),

  update: (id: string, data: Partial<import('@/lib/mock-db').Warehouse>) =>
    request<import('@/lib/mock-db').Warehouse>(`/warehouses/${id}`, { method: 'PUT', body: data }),
};

// Inventory API
export const inventoryApi = {
  list: (params?: { warehouse_id?: string; product_id?: string; status?: string; limit?: number; offset?: number }) =>
    request<{ data: import('@/lib/mock-db').Inventory[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/inventory', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<import('@/lib/mock-db').Inventory>(`/inventory/${id}`),

  create: (data: Partial<import('@/lib/mock-db').Inventory>) =>
    request<import('@/lib/mock-db').Inventory>('/inventory', { method: 'POST', body: data }),

  update: (id: string, data: Partial<import('@/lib/mock-db').Inventory>) =>
    request<import('@/lib/mock-db').Inventory>(`/inventory/${id}`, { method: 'PUT', body: data }),
};

// Users API
export const usersApi = {
  list: (params?: { role?: string; status?: string; search?: string; limit?: number; offset?: number }) =>
    request<{ data: Omit<import('@/lib/mock-db').User, 'password_hash'>[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/users', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<Omit<import('@/lib/mock-db').User, 'password_hash'>>(`/users/${id}`),

  update: (id: string, data: Partial<import('@/lib/mock-db').User>) =>
    request<Omit<import('@/lib/mock-db').User, 'password_hash'>>(`/users/${id}`, { method: 'PUT', body: data }),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: Omit<import('@/lib/mock-db').User, 'password_hash'>; token: string }>('/auth', { method: 'POST', body: { email, password } }),

  getSession: () =>
    request<Omit<import('@/lib/mock-db').User, 'password_hash'>>('/auth'),
};

// Notifications API
export const notificationsApi = {
  list: (params?: { user_id?: string; type?: string; read?: string; limit?: number; offset?: number }) =>
    request<{ data: import('@/lib/mock-db').Notification[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/notifications', { searchParams: params as Record<string, string> }),

  get: (id: string) =>
    request<import('@/lib/mock-db').Notification>(`/notifications/${id}`),

  create: (data: Partial<import('@/lib/mock-db').Notification>) =>
    request<import('@/lib/mock-db').Notification>('/notifications', { method: 'POST', body: data }),

  update: (id: string, data: Partial<import('@/lib/mock-db').Notification>) =>
    request<import('@/lib/mock-db').Notification>(`/notifications/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  list: (params?: { product_id?: string; customer_id?: string; limit?: number; offset?: number }) =>
    request<{ data: import('@/lib/mock-db').Review[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/reviews', { searchParams: params as Record<string, string> }),

  create: (data: Partial<import('@/lib/mock-db').Review>) =>
    request<import('@/lib/mock-db').Review>('/reviews', { method: 'POST', body: data }),
};

// Wishlist API
export const wishlistApi = {
  list: (customer_id: string) =>
    request<(import('@/lib/mock-db').WishlistItem & { product: import('@/lib/mock-db').Product | null })[]>(`/wishlist?customer_id=${customer_id}`),

  add: (customer_id: string, product_id: string) =>
    request<import('@/lib/mock-db').WishlistItem>('/wishlist', { method: 'POST', body: { customer_id, product_id } }),

  remove: (customer_id: string, product_id: string) =>
    request<{ success: boolean }>(`/wishlist?customer_id=${customer_id}&product_id=${product_id}`, { method: 'DELETE' }),
};

// Analytics API
export const analyticsApi = {
  get: (params?: { type?: string; warehouse_id?: string }) =>
    request<typeof import('@/lib/mock-db').db.analytics>('/analytics', { searchParams: params as Record<string, string> }),
};

// Admin API
export const adminApi = {
  pendingProducts: () =>
    request<(import('@/lib/mock-db').Product & { warehouse_name: string; warehouse_owner: string })[]>('/admin/products/pending'),

  approveProduct: (id: string) =>
    request<import('@/lib/mock-db').Product>(`/admin/products/${id}/approve`, { method: 'POST' }),

  rejectProduct: (id: string) =>
    request<import('@/lib/mock-db').Product>(`/admin/products/${id}/reject`, { method: 'POST' }),

  margins: {
    list: () =>
      request<import('@/lib/mock-db').MarginRule[]>('/admin/margins'),

    create: (data: Partial<import('@/lib/mock-db').MarginRule>) =>
      request<import('@/lib/mock-db').MarginRule>('/admin/margins', { method: 'POST', body: data }),

    update: (id: string, data: Partial<import('@/lib/mock-db').MarginRule>) =>
      request<import('@/lib/mock-db').MarginRule>(`/admin/margins/${id}`, { method: 'PUT', body: data }),
  },

  promotions: {
    list: (params?: { status?: string }) =>
      request<import('@/lib/mock-db').Promotion[]>('/admin/promotions', { searchParams: params as Record<string, string> }),

    get: (id: string) =>
      request<import('@/lib/mock-db').Promotion>(`/admin/promotions/${id}`),

    create: (data: Partial<import('@/lib/mock-db').Promotion>) =>
      request<import('@/lib/mock-db').Promotion>('/admin/promotions', { method: 'POST', body: data }),

    update: (id: string, data: Partial<import('@/lib/mock-db').Promotion>) =>
      request<import('@/lib/mock-db').Promotion>(`/admin/promotions/${id}`, { method: 'PUT', body: data }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/admin/promotions/${id}`, { method: 'DELETE' }),
  },

  auditLogs: {
    list: (params?: { actor_role?: string; action?: string; entity_type?: string; limit?: number; offset?: number }) =>
      request<{ data: import('@/lib/mock-db').AuditLog[]; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>('/admin/audit-logs', { searchParams: params as Record<string, string> }),
  },
};
