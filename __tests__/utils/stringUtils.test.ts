import { stripHtml, validateEmail, truncateText } from '../../src/utils/stringUtils';

describe('stringUtils', () => {
  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello World</p>')).toBe('Hello World');
      expect(stripHtml('<div><span>Test</span></div>')).toBe('Test');
    });

    it('should decode HTML entities', () => {
      expect(stripHtml('Hello&nbsp;World')).toBe('Hello World');
      expect(stripHtml('Tom &amp; Jerry')).toBe('Tom & Jerry');
      expect(stripHtml('&lt;script&gt;')).toBe('<script>');
      expect(stripHtml('&quot;Hello&quot;')).toBe('"Hello"');
      expect(stripHtml('Don&#39;t')).toBe("Don't");
    });

    it('should handle complex HTML with entities', () => {
      expect(stripHtml('<p>Hello&nbsp;<strong>World</strong>&amp;more</p>')).toBe('Hello World&more');
    });

    it('should trim whitespace', () => {
      expect(stripHtml('  <p>Hello</p>  ')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(stripHtml('')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
    });

    it('should not truncate text shorter than maxLength', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('Short', 5)).toBe('Short');
    });

    it('should handle exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 5)).toBe('');
    });

    it('should handle zero maxLength', () => {
      expect(truncateText('Hello', 0)).toBe('...');
    });
  });
});