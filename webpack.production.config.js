const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'index.js',
    library: 'SignatureCanvas',
    libraryTarget: 'umd'
  },
  // don't bundle non-relative packages
  externals: /^[^.]/,
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: { presets: ['es2015', 'react', 'stage-2'] }
    }]
  }
}
