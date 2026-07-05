/**
 * Safely convert a value to a number.
 * Handles: number, string, null/undefined, Prisma Decimal objects, and objects with toNumber method.
 */
export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value === null || value === undefined) return 0;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (typeof value === 'object' && 'toNumber' in value && typeof (value as { toNumber: unknown }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

/**
 * Calculate the final display price for a product.
 * final = base * (1 + margin/100) * (1 - discount/100)
 */
export function calculateFinalPrice(
  basePrice: unknown,
  marginPercent: unknown = 15,
  discountPercent: unknown = 0,
): number {
  const base = toNumber(basePrice);
  const margin = toNumber(marginPercent);
  const discount = toNumber(discountPercent);
  return base * (1 + margin / 100) * (1 - discount / 100);
}

/**
 * Calculate the original price (before discount) for display.
 * original = base * (1 + margin/100)
 */
export function calculateOriginalPrice(
  basePrice: unknown,
  marginPercent: unknown = 15,
): number {
  const base = toNumber(basePrice);
  const margin = toNumber(marginPercent);
  return base * (1 + margin / 100);
}

/**
 * Get the final price from a product object (handles both Prisma and API response formats).
 */
export function getFinalPrice(product: { base_price?: unknown; margin_percent?: unknown; discount_percent?: unknown }): number {
  return calculateFinalPrice(product.base_price, product.margin_percent, product.discount_percent);
}

/**
 * Format a price in Ethiopian Birr.
 */
export function formatPrice(price: number): string {
  return Math.round(price).toLocaleString() + ' Br';
}
