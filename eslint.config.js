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
    files: ['src/**/*.{js,jsx,ts,tsx}'],
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
];