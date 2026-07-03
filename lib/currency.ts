/**
 * Currency Utility for Ethiopian Birr (ETB)
 * All prices in MarketBridge are in Ethiopian Birr only.
 */

export const CURRENCY_CODE = 'ETB';
export const CURRENCY_SYMBOL = 'Br';
export const CURRENCY_NAME = 'Ethiopian Birr';

/**
 * Format a number as Ethiopian Birr
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  options?: {
    showCode?: boolean;
    compact?: boolean;
  }
): string {
  const { showCode = false, compact = false } = options || {};

  // Format with thousand separators
  const formatted = compact
    ? formatCompact(amount)
    : amount.toLocaleString('en-ET', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });

  return showCode ? `${formatted} ${CURRENCY_CODE}` : `${formatted} ${CURRENCY_SYMBOL}`;
}

/**
 * Format large numbers in compact form (e.g., 1.2K, 1.5M)
 */
function formatCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toLocaleString('en-ET');
}

/**
 * Parse a currency string back to a number
 * @param value - The currency string to parse
 * @returns The numeric value
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols and whitespace
  const cleaned = value.replace(/[BrETB\s,]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Calculate percentage of amount
 */
export function calculatePercent(amount: number, percent: number): number {
  return (amount * percent) / 100;
}

/**
 * Apply discount to amount
 */
export function applyDiscount(amount: number, discountPercent: number): number {
  return amount - calculatePercent(amount, discountPercent);
}

/**
 * Convert USD to ETB (approximate rate for demo)
 * In production, this should use real-time exchange rates
 */
export function usdToEtb(usd: number): number {
  const ETB_PER_USD = 58; // Approximate exchange rate
  return usd * ETB_PER_USD;
}

/**
 * Currency display component helper - returns symbol
 */
export function getCurrencySymbol(): string {
  return CURRENCY_SYMBOL;
}

/**
 * Currency display component helper - returns code
 */
export function getCurrencyCode(): string {
  return CURRENCY_CODE;
}
