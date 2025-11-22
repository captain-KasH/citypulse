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

/**
 * Gets the appropriate locale string based on language
 * @param language - The language code ('en' or 'ar')
 * @returns Locale string for date formatting
 */
export const getLocaleFromLanguage = (language: string): string => {
  return language === 'ar' ? 'ar-SA' : 'en-US';
};

/**
 * Formats a date string with locale support and optional time
 * @param dateString - The date string to format
 * @param locale - The locale to use (e.g., 'en-US', 'ar-SA')
 * @param timeString - Optional time string to append
 * @param language - Language for time connector ('en' or 'ar')
 * @returns Formatted date string with locale support
 */
export const formatDateWithLocale = (
  dateString: string,
  locale: string = 'en-US',
  timeString?: string,
  language: string = 'en'
): string => {
  const date = new Date(dateString);
  const dateFormatted = date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  if (timeString) {
    const connector = language === 'ar' ? 'في' : 'at';
    return `${dateFormatted} ${connector} ${timeString}`;
  }
  return dateFormatted;
};