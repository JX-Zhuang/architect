const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:'./src/index.js',
    output:{
        filename: "index.js",
        path: path.resolve(__dirname,'dist')
    },
    module: {
        rules:[{
            test:/\.js$/,
            include:path.resolve(__dirname,'src'),
            exclude:path.resolve(__dirname,'node_modules'),
            // use:[{
                loader:'babel-loader',
                options: {
                    presets:[
                        'env','stage-0','react'
                    ]
                }
            // }]
        },{
            test:/\.css$/,
            use:['style-loader','css-loader']
        },{
            test:/\.(eot|svg|jpg|png|woff|woff2|ttf)$/,
            use:'url-loader'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        })
    ]
};