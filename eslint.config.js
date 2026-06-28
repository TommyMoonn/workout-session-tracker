import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            regex: '^@features/[^/]+/.+',
            message: 'Import from the feature public entry point instead.',
          },
          {
            regex: '^@domain/[^/]+/.+',
            message: 'Import from the domain public entry point instead.',
          },
          {
            regex: '^@shared/(hooks|lib|styles|ui)/.+',
            message: 'Import from the shared module entry point instead.',
          },
        ],
      }],
    },
  },
])
