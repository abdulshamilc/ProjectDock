import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

const crossModulePatterns = [
  {
    group: [
      '../*/domain/**',
      '../*/*.service.js',
      '../*/*.repository.js',
      '../*/*.model.js',
      '../*/*.controller.js',
      '../*/*.routes.js',
      '../*/*.validation.js',
    ],
    message: 'Cross-module imports must go through the module index.js, not internal files.',
  },
];

export default [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },

  // --- Base config for all JS files ---
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },

  // --- ARCHITECTURE RULE 4: Cross-module imports must use index.js ---
  {
    files: ['**/modules/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: crossModulePatterns,
        },
      ],
    },
  },

  // --- ARCHITECTURE RULE 1: Domain files may NOT import mongoose, express, or parent files ---
  {
    files: ['**/domain/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'mongoose',
              message: 'Domain must not import mongoose.',
            },
            {
              name: 'express',
              message: 'Domain must not import express.',
            },
          ],
          patterns: [
            {
              group: ['../*', '../**/*'],
              message: 'Domain files may only import from the same domain folder.',
            },
          ],
        },
      ],
    },
  },

  // --- ARCHITECTURE RULE 2: Service files may NOT import mongoose, express, models, or repos ---
  {
    files: ['**/*.service.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'mongoose',
              message: 'Services must not import mongoose directly.',
            },
            {
              name: 'express',
              message: 'Services must not import express.',
            },
          ],
          patterns: [
            {
              group: ['*model*', '**/*model*'],
              message: 'Services must not import models directly — use injected repo.',
            },
            {
              group: ['*repository*', '**/*repository*'],
              message: 'Services must not import repositories directly — use injection.',
            },
            ...crossModulePatterns,
          ],
        },
      ],
    },
  },

  // --- ARCHITECTURE RULE 3: Controller files may NOT import models or repositories ---
  {
    files: ['**/*.controller.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['*model*', '**/*model*'],
              message: 'Controllers must not import models — call the service.',
            },
            {
              group: ['*repository*', '**/*repository*'],
              message: 'Controllers must not import repositories — call the service.',
            },
            ...crossModulePatterns,
          ],
        },
      ],
    },
  },

  // Prettier must be last to override formatting rules
  eslintConfigPrettier,
];
