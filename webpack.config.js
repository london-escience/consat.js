const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		index: path.join(__dirname, 'src', 'index.js'),
	},
	devtool: 'source-map',
	output: {
		path: path.join(__dirname, 'lib'),
		library: 'consat',
		filename: 'consat.js',
		sourceMapFilename: 'consat.js.map'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
		          presets: ['env']
		        }
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: []
}