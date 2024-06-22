/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['jest', '@typescript-eslint', 'import'],
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['**/.eslintrc.cjs', 'dist'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-restricted-properties': [
      'error',
      {
        object: 'Promise',
        property: 'all',
        message:
          'Use `Promise.allSettled()` and handle the results accordingly',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],
    '@typescript-eslint/no-misused-promises': [
      'warn',
      { checksVoidReturn: { attributes: false } },
    ],
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  env: {
    node: true,
    jest: true,
    'jest/globals': true,
  },
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'warn',
      },
    },
  ],
};

module.exports = config;
