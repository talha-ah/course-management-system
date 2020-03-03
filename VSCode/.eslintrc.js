module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      arrowFunctions: true,
      binaryLiterals: true,
      blockBindings: true,
      classes: true
    },
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'no-const-assign': 'warn',
    'no-this-before-super': 'warn',
    'no-undef': 'warn',
    'no-unreachable': 'warn',
    'no-unused-vars': 'off',
    'constructor-super': 'warn',
    'valid-typeof': 'warn',
    'no-extra-semi': 'error'
  },

  extends: [
    'eslint:recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/babel',
    'prettier/react'
  ]
};
