
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var vpsPath = path.resolve(__dirname, '../');

// package.json
var pg = fs.readFileSync(vpsPath + '/package.json');
var pjInfo = JSON.parse(pg);

var paths = {
  src: vpsPath + '/src/',
  dist: vpsPath + '/dist/' + pjInfo.version + '/'
};

var publicPath = '/dist/' + pjInfo.version + '/';

module.exports = {
  entry: {
    'business/examine/index': paths.src + 'business/examine/app.js'
  },
  output: {
    path: paths.dist,
    publicPath: publicPath,
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.styl'],
    modules: [
      paths.src,
      'node_modules'
    ]
  },
   devServer: {
    port:'7788',
    historyApiFallback: true, // 不跳转
    noInfo: true,
    inline:true // 实时刷新
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
      options: {
        presets: [['es2015', {
          loose: true
        }]],
        plugins: ['transform-vue-jsx']
      }
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader',
      options: {
        limit: 1500,
        name: 'images/[name].[ext]?[hash]'
      }
    }, {
      test: /\.(woff|ttf)$/,
      loader: 'url-loader',
      options: {
        limit: 1500,
        name: 'fonts/[name].[ext]?[hash]'
      }
    }, {
      test: /\.css$/,
      loader: 'css-loader',
      options: {
        minimize: true
      }
    }, {
      test: /\.styl$/,
      use: ExtractTextPlugin.extract([{
        loader: 'css-loader',
        options: {
          minimize: true
        }
      }, 'stylus-loader'])
    }]
  },
  devtool: process.env.NODE_ENV === 'production' ? '#source-map' : '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: process.env.NODE_ENV === 'production' ? '"production"' : '"development"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].css')
  ]
}