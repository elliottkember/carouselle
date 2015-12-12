var webpack = require('webpack');
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
var pathToReactDomMin = path.resolve(node_modules, 'react/lib/ReactDOM');
var pathToReactCSSTransitionGroup = path.resolve(node_modules, 'react/lib/ReactCSSTransitionGroup');

module.exports = {
  devtool: 'eval',
  entry: ['./index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    alias: {
      'react': pathToReact,
      'react-dom': pathToReactDomMin,
      'react-addons-css-transition-group': pathToReactCSSTransitionGroup,
      'redux': path.join(__dirname, 'node_modules/redux')
    },
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin()
  ],
  module: {
    noParse: [pathToReact],
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/,
      include: __dirname
    }, {
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '..', '..', 'src')
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    }, {
      test: /\.scss?$/,
      loaders: ["style", "css", "sass"],
      include: __dirname
    }]
  }
};
