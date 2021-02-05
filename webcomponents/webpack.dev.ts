import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";

const config: webpack.Configuration & webpackDevServer.Configuration = {
  devServer: {
    compress: true,
    contentBase: __dirname,
    index: 'demo.html',
    watchContentBase: true,
  },
	devtool: 'source-map',
	entry: './index.ts',
	mode: 'development',
	module: {
		rules: [
			{
				exclude: /node_modules/,
				loader: 'ts-loader',
				test: /\.ts$/,
			},
		],
	},
	output: {
		filename: 'allcode-amble.js',
		path: __dirname,
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};

export default config;
