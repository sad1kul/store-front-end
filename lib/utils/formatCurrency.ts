/**
 * Format a number as ZAR (South African Rand) currency.
 * Output: R 1,234.00
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("ZAR", "R");
}

/**
 * Format number with thousands separator (no currency symbol).
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-ZA").format(num);
}
