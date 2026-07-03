import 'server-only';

/**
 * Data Adapter
 * Unified data access layer that uses Supabase PostgreSQL (via Prisma)
 * for all database operations.
 *
 * All data is persisted in Supabase. Pages use this adapter through
 * the cached-data layer for server-side rendering with ISR.
 */

import type { ProductCardData } from '@/components/product/product-card-server';

export async function getProductsAdapter(params?: {
  category_id?: string;
  warehouse_id?: string;
  status?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}): Promise<{ products: ProductCardData[]; total: number }> {
  const { getProducts } = await import('@/lib/db-service');
  const result = await getProducts(params);
  return {
    products: result.products as unknown as ProductCardData[],
    total: result.total,
  };
}

export async function getProductByIdAdapter(id: string) {
  const { getProductById } = await import('@/lib/db-service');
  return await getProductById(id);
}

export async function getCategoriesAdapter(params?: { is_active?: boolean }) {
  const { getCategories } = await import('@/lib/db-service');
  return await getCategories(params);
}

export async function getWarehousesAdapter() {
  const { getWarehouses } = await import('@/lib/db-service');
  const result = await getWarehouses();
  return result.warehouses;
}

export async function getOrdersAdapter(params?: { customer_id?: string; warehouse_id?: string; limit?: number }) {
  const { getOrders } = await import('@/lib/db-service');
  const result = await getOrders(params);
  return result.orders;
}

export async function getNotificationsAdapter(params: { user_id: string; is_read?: boolean; type?: string; limit?: number }) {
  const { getNotifications } = await import('@/lib/db-service');
  return await getNotifications(params);
}

export async function getReviewsAdapter(params?: { product_id?: string; customer_id?: string; limit?: number }) {
  const { getReviews } = await import('@/lib/db-service');
  return await getReviews(params);
}
