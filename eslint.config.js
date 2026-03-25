import eslintConfig from "eslint/config";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import preferArrow from 'eslint-plugin-prefer-arrow';


export default eslintConfig.defineConfig([
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/*.d.ts',
      'test/**',
      '*.config.{mjs,cjs,js}']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.eslint.json'],
        ecmaVersion: 2020
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'prefer-arrow': preferArrow,
      prettier: prettierPlugin
    },
    rules: {
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': 'off',
      'class-methods-use-this': 'off',
      'comma-dangle': 'off',
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'import/prefer-default-export': 'off',
      'lines-between-class-members': ['error', 'always'],
      'max-classes-per-file': 'off',
      'no-confusing-arrow': 'off',
      'no-console': 'error',
      'no-nested-ternary': 'off',
      'no-plusplus': 'off',
      'no-undef': 'off',
      'no-underscore-dangle': 'off',
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'no-duplicate-imports': 'error',

      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true }
      ],

      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-implied-eval': 0,
      '@typescript-eslint/no-throw-literal': 0,

      '@typescript-eslint/explicit-function-return-type': 2,

      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: true
        }
      ],

      // Prettier integration
      'prettier/prettier': 'error'
    }
  },
  prettierConfig
]);