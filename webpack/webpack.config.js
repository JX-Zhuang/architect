const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry: {
        index: './src/index.js',
        main: './src/main.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0 // This is example is too small to create commons chunks
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: 'Hello World',
            filename: 'index.html',
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // watch: true,
    // watchOptions: {
    //     ignored:/node_modules/,
    //     aggregateTimeout:300,   //监听变化 300ms后再执行
    //     poll:1000   // 默认每秒询问1000次
    // },
};