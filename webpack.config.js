const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		'lib/consat': path.join(__dirname, 'src', 'index.js'),
		'bin/perftest': path.join(__dirname, 'performance', 'perftest.js'),
	},
	devtool: 'source-map',
	output: {
		path: path.join(__dirname, 'dist'),
		library: 'consat',
		libraryTarget: 'umd',
		filename: '[name].js',
		sourceMapFilename: '[name].js.map'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
		          presets: ['@babel/preset-env'],
		          plugins: [
		              ['babel-plugin-transform-builtin-extend', 
		                  {globals: ["Error", "Array"]}
		              ]
		          ]
		        }
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
	    new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true, entryOnly: true, test: 'bin/perftest.js', })
	],
        mode: 'production'
};
