module.exports = {
  presets: [
    ['@babel/preset-env'], // needed at least until https://github.com/jaredpalmer/tsdx/pull/473 is released
    ['@babel/preset-react']
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties'] // required for tsdx test, related to https://github.com/jaredpalmer/tsdx/issues/383#issuecomment-581637869
  ]
}
