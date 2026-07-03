import 'server-only';

import { unstable_cache } from 'next/cache';

// ============================================================================
// Cache Key Management
// ============================================================================

const KEY_PREFIX = 'mb';

function buildKey(parts: (string | number)[]): string {
  return [KEY_PREFIX, ...parts].join(':');
}

export const cacheKeys = {
  products: {
    list: (params: Record<string, unknown>) => buildKey(['products', 'list', JSON.stringify(params)]),
    detail: (id: string) => buildKey(['products', 'detail', id]),
    bySlug: (slug: string) => buildKey(['products', 'slug', slug]),
    featured: () => buildKey(['products', 'featured']),
    trending: () => buildKey(['products', 'trending']),
    byCategory: (categoryId: string) => buildKey(['products', 'category', categoryId]),
  },
  categories: {
    all: () => buildKey(['categories', 'all']),
    active: () => buildKey(['categories', 'active']),
    bySlug: (slug: string) => buildKey(['categories', 'slug', slug]),
  },
  warehouses: {
    list: (params: Record<string, unknown>) => buildKey(['warehouses', 'list', JSON.stringify(params)]),
    detail: (id: string) => buildKey(['warehouses', 'detail', id]),
  },
  orders: {
    list: (params: Record<string, unknown>) => buildKey(['orders', 'list', JSON.stringify(params)]),
    detail: (id: string) => buildKey(['orders', 'detail', id]),
  },
  reviews: {
    byProduct: (productId: string) => buildKey(['reviews', 'product', productId]),
  },
  settings: {
    system: () => buildKey(['settings', 'system']),
  },
  analytics: {
    overview: (warehouseId?: string) => buildKey(['analytics', warehouseId || 'global']),
  },
};

// ============================================================================
// Cache TTLs (in seconds)
// ============================================================================

export const cacheTTL = {
  categories: 3600,        // 1 hour - categories change rarely
  productList: 300,        // 5 min - product listings
  productDetail: 600,      // 10 min - individual products
  featured: 300,           // 5 min
  trending: 600,           // 10 min
  warehouse: 600,           // 10 min
  reviews: 300,             // 5 min
  settings: 1800,           // 30 min
  analytics: 120,           // 2 min - dashboards need fresher data
} as const;

// ============================================================================
// Cached Function Wrapper
// ============================================================================

/**
 * Wraps a function with Next.js unstable_cache for persistent, tag-based caching.
 * Tag-based revalidation allows surgical cache invalidation.
 */
export function cached<TResult>(
  fn: () => Promise<TResult>,
  keyParts: string[],
  tags: string[],
  ttl: number = 300,
) {
  return unstable_cache(fn, keyParts, {
    revalidate: ttl,
    tags,
  }) as () => Promise<TResult>;
}

// ============================================================================
// Cache Invalidation Tags
// ============================================================================

export const cacheTags = {
  products: 'products',
  productDetail: (id: string) => `product:${id}`,
  categories: 'categories',
  categoryBySlug: (slug: string) => `category:${slug}`,
  warehouses: 'warehouses',
  orders: 'orders',
  reviews: 'reviews',
  settings: 'settings',
  analytics: 'analytics',
};

// ============================================================================
// In-Memory LRU Cache (request-level deduplication + fallback)
// ============================================================================

interface CacheEntry<T> {
  value: T;
  expires: number;
}

const MAX_ENTRIES = 500;
const memCache = new Map<string, CacheEntry<unknown>>();

/**
 * In-memory cache for request-level deduplication and as a fallback
 * when Next.js data cache is not available (e.g. in route handlers
 * called outside of render). Uses a simple Map with TTL eviction.
 */
export const memoryCache = {
  get<T>(key: string): T | undefined {
    const entry = memCache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
      memCache.delete(key);
      return undefined;
    }
    // Move to end (LRU refresh)
    memCache.delete(key);
    memCache.set(key, entry);
    return entry.value as T;
  },

  set<T>(key: string, value: T, ttlSeconds: number): void {
    if (memCache.size >= MAX_ENTRIES) {
      const firstKey = memCache.keys().next().value;
      if (firstKey) memCache.delete(firstKey);
    }
    memCache.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
  },

  delete(key: string): void {
    memCache.delete(key);
  },

  deletePattern(prefix: string): void {
    const keys = Array.from(memCache.keys());
    for (const key of keys) {
      if (key.startsWith(prefix)) memCache.delete(key);
    }
  },

  clear(): void {
    memCache.clear();
  },
};

// ============================================================================
// Cache-Aside Helper
// ============================================================================

/**
 * Cache-aside pattern: check memory cache, fall back to fetcher, store result.
 * Use in route handlers where unstable_cache is less ergonomic.
 */
export async function cacheAside<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300,
): Promise<T> {
  const cached = memoryCache.get<T>(key);
  if (cached !== undefined) return cached;

  const result = await fetcher();
  memoryCache.set(key, result, ttl);
  return result;
}
