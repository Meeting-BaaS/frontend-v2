/**
 * Formats an amount in cents to a currency string
 * @param amount - Amount in cents (e.g., 2999 for $29.99)
 * @param currency - Currency code (e.g., "usd", "eur")
 * @returns Formatted currency string (e.g., "$29.99")
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
