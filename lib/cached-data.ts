import 'server-only';

import {
  cacheTTL,
  cacheAside,
  cacheKeys,
  memoryCache,
} from './cache';
import {
  getProductsAdapter,
  getProductByIdAdapter,
  getCategoriesAdapter,
  getWarehousesAdapter,
  getOrdersAdapter,
  getReviewsAdapter,
} from './data-adapter';

// ============================================================================
// CACHED READ OPERATIONS
// ============================================================================
// These wrappers use the cache-aside pattern with in-memory LRU caching.
// The data adapter uses Supabase PostgreSQL (via Prisma) for all data.

export async function getCachedProducts(params?: Parameters<typeof getProductsAdapter>[0]) {
  const key = cacheKeys.products.list(params || {});
  return cacheAside(
    key,
    () => getProductsAdapter(params),
    cacheTTL.productList,
  );
}

export async function getCachedProductById(id: string) {
  const key = cacheKeys.products.detail(id);
  return cacheAside(
    key,
    () => getProductByIdAdapter(id),
    cacheTTL.productDetail,
  );
}

export async function getCachedFeaturedProducts(limit: number = 10) {
  const key = cacheKeys.products.featured() + `:${limit}`;
  return cacheAside(
    key,
    () =>
      getProductsAdapter({
        status: 'published',
        sort_by: 'sold_count',
        sort_order: 'desc',
        limit,
      }),
    cacheTTL.featured,
  );
}

export async function getCachedTrendingProducts(limit: number = 10) {
  const key = cacheKeys.products.trending() + `:${limit}`;
  return cacheAside(
    key,
    () =>
      getProductsAdapter({
        status: 'published',
        sort_by: 'created_at',
        sort_order: 'desc',
        limit,
      }),
    cacheTTL.trending,
  );
}

export async function getCachedProductsByCategory(categoryId: string, limit: number = 20) {
  const key = cacheKeys.products.byCategory(categoryId) + `:${limit}`;
  return cacheAside(
    key,
    () =>
      getProductsAdapter({
        category_id: categoryId,
        status: 'published',
        limit,
      }),
    cacheTTL.productList,
  );
}

export async function getCachedCategories(params?: { is_active?: boolean }) {
  const key = params?.is_active ? cacheKeys.categories.active() : cacheKeys.categories.all();
  return cacheAside(
    key,
    () => getCategoriesAdapter(params),
    cacheTTL.categories,
  );
}

export async function getCachedWarehouses() {
  const key = cacheKeys.warehouses.list({});
  return cacheAside(
    key,
    () => getWarehousesAdapter(),
    cacheTTL.warehouse,
  );
}

export async function getCachedReviews(productId: string) {
  const key = cacheKeys.reviews.byProduct(productId);
  return cacheAside(
    key,
    () => getReviewsAdapter({ product_id: productId }),
    cacheTTL.reviews,
  );
}

export async function getCachedOrders(params?: { customer_id?: string; warehouse_id?: string; limit?: number }) {
  const key = cacheKeys.orders.list(params || {});
  return cacheAside(
    key,
    () => getOrdersAdapter(params),
    cacheTTL.analytics,
  );
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

export async function getCachedCategoryBySlug(slug: string) {
  const categories = await getCachedCategories({ is_active: true });
  return categories.find((c: any) => c.slug === slug) || null;
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

export function invalidateProducts() {
  memoryCache.deletePattern('mb:products:');
}

export function invalidateProduct(id: string) {
  memoryCache.deletePattern(`mb:products:detail:${id}`);
  memoryCache.deletePattern('mb:products:list:');
  memoryCache.deletePattern('mb:products:featured');
  memoryCache.deletePattern('mb:products:trending');
}

export function invalidateCategories() {
  memoryCache.deletePattern('mb:categories:');
}

export function invalidateOrders() {
  memoryCache.deletePattern('mb:orders:');
}

export function invalidateReviews(productId?: string) {
  if (productId) {
    memoryCache.deletePattern(`mb:reviews:product:${productId}`);
  } else {
    memoryCache.deletePattern('mb:reviews:');
  }
}

export { revalidateTag } from 'next/cache';
