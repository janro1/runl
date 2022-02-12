/**
 * @type {import('eslint').Linter.Config}
 */
const eslintOptions = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json']
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', 'd.ts']
      }
    }
  },
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended'
  ],
  plugins: ['@typescript-eslint', 'prefer-arrow', 'import'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': 'off',
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
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

    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterOverload: true }
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true }
    ],

    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-implied-eval': 0,
    '@typescript-eslint/no-throw-literal': 0,

    'import/order': 'error',
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false
      }
    ]
  }
};

module.exports = eslintOptions;
