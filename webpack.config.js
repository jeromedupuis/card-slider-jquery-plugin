const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    publicPath: 'dist',
    filename: 'cardslider.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', { modules: false }],
          ],
        },
      }],
    }],
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
  ],
  devtool: 'source-map',
};
