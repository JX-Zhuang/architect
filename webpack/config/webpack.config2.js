const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    devServer: {
        port: 8000,
        hot: true,
        open: true,
        inline:true,
        host:'127.0.0.1'
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
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