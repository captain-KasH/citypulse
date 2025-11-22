/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};