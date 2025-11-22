/**
 * Formats a number as USD currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$123.45")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};