module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    '@next/next/no-img-element': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
