import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Flat ESLint config. `next lint` is deprecated in Next 15 and removed in 16, so the project
 * calls ESLint directly and owns its rule set.
 */
export default tseslint.config(
  { ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'next-env.d.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Build scripts run in Node, not the browser. They are the one place `console` is the
    // intended output channel rather than a leftover debug statement.
    files: ['scripts/**/*.mjs'],
    // `document` and `window` appear inside functions serialized into the browser by the
    // screenshot driver — they run there, not in Node.
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        document: 'readonly',
        window: 'readonly',
        setTimeout: 'readonly',
        Buffer: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // TypeScript resolves every identifier itself; ESLint's version only produces
      // false positives on DOM and Node globals.
      'no-undef': 'off',
    },
  },
);
