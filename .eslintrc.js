module.exports = {
  ignorePatterns: ['dist/'],
  extends: [
    'react-app',
    'standard', // for any JS
    'standard-with-typescript' // for all TS
  ],
  parserOptions: {
    // same as ./tsconfig.json, but adds test dir to be linted
    project: './tsconfig.eslint.json',
  },
  rules: {
    'prettier/prettier': 'off' // override tsdx lint
  }
}
