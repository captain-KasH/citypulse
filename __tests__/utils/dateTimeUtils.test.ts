import { formatDate, getLocaleFromLanguage, formatDateWithLocale } from '../../src/utils/dateTimeUtils';

describe('dateTimeUtils', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024');
      expect(formatDate('2023-12-25')).toBe('December 25, 2023');
    });

    it('should handle ISO date strings', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('January 15, 2024');
    });
  });

  describe('getLocaleFromLanguage', () => {
    it('should return Arabic locale for ar language', () => {
      expect(getLocaleFromLanguage('ar')).toBe('ar-SA');
    });

    it('should return English locale for en language', () => {
      expect(getLocaleFromLanguage('en')).toBe('en-US');
    });

    it('should return English locale for unknown language', () => {
      expect(getLocaleFromLanguage('fr')).toBe('en-US');
      expect(getLocaleFromLanguage('')).toBe('en-US');
    });
  });

  describe('formatDateWithLocale', () => {
    const testDate = '2024-01-15';

    it('should format date with default locale', () => {
      const result = formatDateWithLocale(testDate);
      expect(result).toContain('Monday');
      expect(result).toContain('January 15, 2024');
    });

    it('should format date with time in English', () => {
      const result = formatDateWithLocale(testDate, 'en-US', '10:30 AM', 'en');
      expect(result).toContain('at 10:30 AM');
    });

    it('should format date with time in Arabic', () => {
      const result = formatDateWithLocale(testDate, 'ar-SA', '10:30 AM', 'ar');
      expect(result).toContain('في 10:30 AM');
    });

    it('should format date without time', () => {
      const result = formatDateWithLocale(testDate, 'en-US');
      expect(result).not.toContain('at');
      expect(result).not.toContain('في');
    });
  });
});