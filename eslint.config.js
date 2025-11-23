const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: [
      '.eslintrc.js',
      'node_modules/**',
      'android/**',
      'ios/**',
      'vendor/**',
      '**/*.d.ts'
    ],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'warn',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'warn',
    },
  },
];