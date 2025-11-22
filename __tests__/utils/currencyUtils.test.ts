import { formatCurrency } from '../../src/utils/currencyUtils';

describe('currencyUtils', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(123.45)).toBe('$123.45');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-50.25)).toBe('-$50.25');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('should round to two decimal places', () => {
      expect(formatCurrency(123.456)).toBe('$123.46');
      expect(formatCurrency(123.454)).toBe('$123.45');
    });
  });
});