/**
 * Calculate the final display price for a product.
 * final = base * (1 + margin/100) * (1 - discount/100)
 */
export function calculateFinalPrice(
  basePrice: number | { toNumber(): number },
  marginPercent: number | { toNumber(): number } = 15,
  discountPercent: number | { toNumber(): number } = 0,
): number {
  const base = typeof basePrice === 'number' ? basePrice : basePrice.toNumber();
  const margin = typeof marginPercent === 'number' ? marginPercent : marginPercent.toNumber();
  const discount = typeof discountPercent === 'number' ? discountPercent : discountPercent.toNumber();
  return base * (1 + margin / 100) * (1 - discount / 100);
}

/**
 * Calculate the original price (before discount) for display.
 * original = base * (1 + margin/100)
 */
export function calculateOriginalPrice(
  basePrice: number | { toNumber(): number },
  marginPercent: number | { toNumber(): number } = 15,
): number {
  const base = typeof basePrice === 'number' ? basePrice : basePrice.toNumber();
  const margin = typeof marginPercent === 'number' ? marginPercent : marginPercent.toNumber();
  return base * (1 + margin / 100);
}

/**
 * Format a price in Ethiopian Birr.
 */
export function formatPrice(price: number): string {
  return Math.round(price).toLocaleString() + ' Br';
}
