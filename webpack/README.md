#webpack小记
> 把工作中常用的webpack配置，包括loader、plugins、优化等记录下来，方便学习和查阅。会一直更新本文。

### 初识webpack
* 在项目里安装 webpack、webpack-cli
* 在根目录新建 webpack.config.js
* webpack4有两种模式：development、production
### entry
* 入口文件，可以是对象，数组，字符串。
* 对象，key是可以做输出名字。
### output
* path，输出目录，绝对路径。
* filename，输出文件的名字
```javascript
const config = {
  entry:{
      index:'./index'
  },
  output:{
      filename:'[name].[hash].js',   //[name]是entry里的key，可以加hash
      path:__dirname
  } 
};
```
### resolve: 
* alias，设置别名。
```javascript
//a.js
const help = requrie('../libs/help/a.js');
//b.js
const help = requrie('../../../libs/help/b.js');
//我们看到用到help里某个文件时，要找很多层目录，可以在配置文件里写入别名。
const config = {
    resolve:{
        alias:{
            help:path.resolve(__dirname,"libs/help")
        }
    }
};
//a.js
const help = requrie('help/a.js');
//b.js
const help = requrie('help/b.js');
```
* extensions，省略扩展名，js引入时不需要写扩展名
### module
* noParse，如果确定一个模块没有其他的依赖，可以配置这项。可以提高打包的速度
```javascript
const config = {
    module:{
        noParse:[/jquery/],
        rules:[
            {
                test:'匹配的文件',
                include:'在哪个目录查找',
                exclude:'排除哪个目录',
                loader:'use:[{loader}]的简写',
                use:[
                    //配置多个loader，从有往左依次执行
                    {
                        loader:"需要的loader",
                        options:{
                            //loader的相关配置
                        }
                    }
                ]
            }
        ]
    }
}
```
* rules，是一个规则数组，每一项是一个对象，配置loader。
### loader
* 在webpack里，所有的文件都是模块。loader的作用就是把文件转换成webpack可以识别的模块。
##### ES6、ES7、react
* babel-loader、babel-core
* babel-preset-stage-0 编译ES7
* babel-preset-2015 编译ES6
* babel-preset-react 编译react
```javascript
{
    module:{
        rules:[
            {
                test: /\.jsx?$/,
                exclude:/node_modules/,
                include:path.resolve(__dirname,'src'),
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                             'es2015','react'
                        ]
                    }
                }
            }
        ]
    }
}
```
##### css、less、sass
* js里引入css
* [style-loader](https://github.com/webpack-contrib/style-loader)，把css放在style标签里插入html里。
* [css-loader](https://github.com/webpack-contrib/css-loader)，识别css，把css变成一个模块，可以根据options配置css模块化等。
* [less-loader](https://github.com/webpack-contrib/less-loader) 该loader要和less一起使用。
```shell
npm install --save-dev less-loader less
```
* [sass-loader](https://github.com/webpack-contrib/sass-loader) 要和node-sass一起使用。
```shell
npm install sass-loader node-sass webpack --save-dev
```
```javascript
const config = {
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    {
                        loader:'css-loader',
                        options:{
                            modules:true    //css模块化
                        }
                    }
                    ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', {
                    loader:'less-loader',
                    options:{
                        modifyVars:{
                            "color":"#ccc"  //设置变量
                        }
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
}
```
##### 图片等其他资源
* js里引入图片等资源
* [file-loader](https://github.com/webpack-contrib/file-loader)，在输出目录生成对应的图片
```javascript
{
    module:{
        rules:[
            {
                test: /\.(png|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    }
}
```
* [url-loader](https://github.com/webpack-contrib/url-loader)，很像file-loader，把符合大小把图片生成base64，不符合的生成图片
```javascript
{
    module:{
        rules:[
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
            }
        ]
    }
}
```
##### html
* [html-loader](https://github.com/webpack-contrib/html-loader) 可以把html页面中引入的图片，输出在相应的输出目录
```javascript
{
    test: /\.(html)$/,
    use: {
        loader: 'html-loader'
    }
}
```

### plugins
* webpack提供了丰富的插件接口。插件可以让webpack灵活可配置。
* plugins是一个数组，里面是每个插件的实例。
##### 清理文件
* [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin) 清理文件
```javascript
const CleanWebpackPlugin = requrie('clean-webpack-plugin');
const config = {
    plugins:[
        new CleanWebpackPlugin(['输出目录'])
    ]
}
```
##### 在html里加入资源
* [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 设置html模版，让入口js加载到相应的html里，可以根据参数设置js的位置、顺序、是否压缩、加载哪些js、或者不加载哪些js等功能。
```javascript
const HtmlWebpackPlugin = requrie('html-webpack-plugin');
const config = {
    plugins:[
        new HtmlWebpackPlugin({
            template:'index.html',  //设置模版
            hash:true,  //添加hash
            filename:'hello.html',  //输出名字
               
        })
    ]
}
```
##### 提取css
* [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)，把想要的css提取到相应的文件里
* 为了兼容webpack4要安装next版本
* 需要和loader一起使用
```shell
npm i extract-text-webpack-plugin@next -S
```

```javascript
//注：此处的[name]生成后为入口文件的key
const cssExtract = new ExtractTextPlugin('public/[name].[contenthash:8].css');
const lessExtract = new ExtractTextPlugin('public/[name].[contenthash:8].css');
const scssExtract = new ExtractTextPlugin('public/[name].[contenthash:8].css');
const config = {
  module:{
      rules:[
          {
            test: /\.css$/,
            use: cssExtract.extract(['css-loader'])
           },
        {
            test: /\.less$/,
            use: lessExtract.extract({
                use: ['css-loader', 'less-loader']
            })
        },
        {
            test: /\.scss$/,
            use: scssExtract.extract({
                use: ['css-loader', 'sass-loader']	
            })
        }
      ]
  },
  plugins:[
      cssExtract,
      lessExtract,
      scssExtract
  ]  
};
```
##### 压缩混淆代码
* (uglifyjs-webpack-plugin)[https://github.com/webpack-contrib/uglifyjs-webpack-plugin]
```javascript
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const config = {
  module:{
  plugins:[
      new UglifyjsWebpackPlugin({
        test: /\.js($|\?)/i
      })
  ] 
  } 
};
```
* 或者用webpack的生产模式
```shell
webpack --mode production
```
##### 拷贝静态文件
* 有时项目中没有引用的文件，也需要打包到目标目录里
* [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin)
```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
{
    plugins:[
        new CopyWebpackPlugin([
            {
                from:'./src/test',
                to:'./'
            }
        ])
    ]
}
```
### 监听文件变化
* webpack定时获取文件等更新时间，并跟上次保存的时间作对比，不一样就是做了修改。
* poll，每秒钟询问的次数
* aggregateTimeout，监听变化，多少ms后再执行
```javascript
const config = {
    watch:true,     //watch为true时，watchOptions才生效
    watchOptions: {
        ignored:/node_modules/, //忽略目录
        aggregateTimeout:300,   //监听变化 300ms后再执行
        poll:1000   // 默认每秒询问1000次
    }
}
```
### webpack-dev-server
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)，本地服务器，监听文件变化自动刷新浏览器等功能。
* 文档里是可以实现模块热更替的，我没有实现，有好的教程请告诉我，谢谢！
```javascript
const webpack = require('webpack');
const config = {
    devServer: {
        hot: true, //写了这项就不会自动刷新，不写就会自动刷新，知道原因的请留言，谢谢！
        open: true,
        inline:true
    },
    plugins:[
       new webpack.HotModuleReplacementPlugin() //不写会报错，不知道为什么。。。
    ]
}
```
### 提取公共代码
* [common-chunk-and-vendor-chunk](https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk)
* 提取公共代码
```javascript
module.exports = {
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
    }
}
```
#### 总结
记录用到过的webpack loaders、plugins和其他相关配置。后续还会添加
#### 参考
* [webpack](https://doc.webpack-china.org/)

