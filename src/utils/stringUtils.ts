/**
 * Strips HTML tags and decodes HTML entities from a string
 * @param html - The HTML string to clean
 * @returns Clean text without HTML tags or entities
 */
export const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace ampersand entities
    .replace(/&lt;/g, '<') // Replace less-than entities
    .replace(/&gt;/g, '>') // Replace greater-than entities
    .replace(/&quot;/g, '"') // Replace quote entities
    .replace(/&#39;/g, "'") // Replace apostrophe entities
    .trim(); // Remove leading/trailing whitespace
};

/**
 * Validates email format using regex
 * @param email - The email string to validate
 * @returns True if email format is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncates text to specified length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};