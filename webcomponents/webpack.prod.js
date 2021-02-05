// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const ROOT = path.resolve(__dirname);
module.exports = {
	devServer: {
		compress: true,
		contentBase: ROOT,
		index: 'demo.html',
		watchContentBase: true,
	},
	devtool: 'source-map',
	entry: './index.ts',
	mode: 'production',
	module: {
		rules: [
			{
				exclude: /node_modules/,
				loader: 'ts-loader',
				test: /\.ts$/,
			},
		],
	},
	optimization: {
		usedExports: true,
	},
	output: {
		filename: 'allcode-amble.js',
		path: ROOT,
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};
