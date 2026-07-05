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
  basePrice: number | { toNumber(): number } | string,
  marginPercent: number | { toNumber(): number } | string = 15,
  discountPercent: number | { toNumber(): number } | string = 0,
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
  basePrice: number | { toNumber(): number } | string,
  marginPercent: number | { toNumber(): number } | string = 15,
): number {
  const base = toNumber(basePrice);
  const margin = toNumber(marginPercent);
  return base * (1 + margin / 100);
}

/**
 * Format a price in Ethiopian Birr.
 */
export function formatPrice(price: number): string {
  return Math.round(price).toLocaleString() + ' Br';
}
