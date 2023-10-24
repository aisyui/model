const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'source-map',

  //https://webpack.js.org/configuration/dev-server/
  devServer: {
			//useLocalIp: true,
			host: "0.0.0.0",
			contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
			proxy: {
				'/api/users/': {
					target: 'https://api.syui.ai/users/',
					secure: false,
					changeOrigin: true,
					pathRewrite: {
						'^/api/users' : ''
					}
				}
			}
		},
	module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader',
    }],
  },
});
