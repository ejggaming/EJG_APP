/**
 * Format a date to a localized string
 */
export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency = "PHP",
  locale = "en-PH",
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount,
  );
}
