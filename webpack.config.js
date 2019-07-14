// transform query objects to query params when using multiple loaders
function query (loader, query) {
  return loader + '?' + JSON.stringify(query)
}

module.exports = {
  entry: './example/app.js',
  output: {
    path: './build',
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [
        'react-hot',
        query('babel-loader', { presets: ['es2015', 'react', 'stage-2'] })
      ]
    }, {
      test: /\.cssm$/, loader: 'style-loader!css-loader?modules'
    }]
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: './example',
    historyApiFallback: true,
    stats: {
      // do not show list of hundreds of files included in a bundle
      chunkModules: false
    }
  }
}
