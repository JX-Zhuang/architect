const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const cssExtract = new ExtractTextPlugin('public/[name].[contenthash:8].css');
const lessExtract = new ExtractTextPlugin('public/[name].[contenthash:8].css');
const scssExtract = new ExtractTextPlugin('public/[name].[contenthash:8].css');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    resolve:{
        alias:{
            '@':path.resolve(__dirname,'src/component'),
            'libs':path.resolve(__dirname,'src/libs'),
        },
        extensions:[".js",".css"]
    },
    module: {
        noParse:[/jquery/],
        rules: [
            {
                test: /\.jsx?$/,
                // exclude:/node_modules/,
                include:path.resolve(__dirname,'src'),
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            ['env',{modules:false}],'react'
                        ]
                        // presets: [
                        //     ["es2015", { "modules": false }]
                        // ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: [__dirname + '/src/style/public']
            },
            {
                test: /\.css$/,
                use: cssExtract.extract(['css-loader']),
                include: __dirname + '/src/style/public'
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
                exclude: [__dirname + '/src/style/public']
            },
            {
                test: /\.less$/,
                use: lessExtract.extract({
                    use: ['css-loader', 'less-loader']	//先用less-loader处理一下less文件
                }),
                include: __dirname + '/src/style/public'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                exclude: [__dirname + '/src/style/public']
            },
            {
                test: /\.scss$/,
                use: scssExtract.extract({
                    use: ['css-loader', 'sass-loader']	//先用sass-loader处理一下sass文件
                }),
                include: __dirname + '/src/style/public'
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10*1024,
                            name: '[path][name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            }
        ]
    },
    plugins: [
        new UglifyjsWebpackPlugin({
            test: /\.js($|\?)/i
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: 'Hello World',
            filename: 'index.html',
            chunks: ['index'],
            hash:true
        }),
        cssExtract,
        lessExtract,
        scssExtract
    ]
};