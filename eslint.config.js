import js from '@eslint/js';
import globals from 'globals';
import pluginN from 'eslint-plugin-n';

import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'eslint.config.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      js,
      n: pluginN,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginN.configs['recommended'].rules,
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'semi': ['error', 'never']
    },
  },
]);