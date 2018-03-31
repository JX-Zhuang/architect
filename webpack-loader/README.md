#webpack loader的"套路"
> 学习webpack loader，最后模拟style-loader、less-loader
### 什么是loader
* loader是一个函数，用来把文件转换成webpack识别的模块。
### loader API
* this.callback，一个可以同步或者异步调用的可以返回多个结果的函数。
* this.async，异步的loader，返回this.callback
### 如何编写loader
#### 设置
* webpack默认从node_modules里找loader
* 直接引入loader
```javascript
{
  test: /\.js$/
  use: [
    {
      loader: path.resolve('path/to/loader.js'),
      options: {/* ... */}
    }
  ]
}
```
* 如果有多个loader的目录，可以设置loader的目录，webpack会从设置的目录里找到loader
```javascript
resolveLoader: {
  modules: [
    'node_modules',
    path.resolve(__dirname, 'loaders')  //自己开发的loaders
  ]
}
```
#### 简单用法
* 当使用一个loader时，这个loader函数只有一个参数，参数是包含文件内容的字符串。
* 同步loader可以返回一个代表模块转化后的简单的值
* loader的返回值是javascript代码字符串或者是Buffer
```javascript
//css-loader 把css解析成webpack识别的模块
module.exports = function(source) {
  return `module.exports=${source}`;
}
```
#### 复杂用法
* 当配置多个loader时，loader的执行顺序时从右往左，右边的执行结果作为参数传到左边。
* less-loader把less转化成css，传给css-loader，css-loader把结果给style-loader，style-loader返回javascript代码字符串。
```javascript
{
    test:/\.less$/,
    use:[
        'style-loader','css-loader','less-loader'
    ]
}
```
#### 编写原则
* 单一职责。每个loader只负责一件事情。
* 使用链式调用，确保loader的依赖关系的正确。
* 无状态性，确保loader在不同模块转换之间不保存状态。每次运行都应该独立于其他编译模块以及相同模块之前的编译结果。
#### loader工具库
* loader-utils，可以获取loader的options
* schema-utils，校验loader的options的合法性
### 模拟less-loader、css-loader、style-loader
* less-loader负责把less编译成css
```javascript
const less = require('less');
module.exports = function (source) {
    less.render(source, (e, output)=>{
        this.callback(e,output.css);    //把编译后的css返回给下一个loader
    });
};

```
* css-loader负责把css交给下一个loader
```javascript
module.exports = function (source) {
    return source;          //source是上个loader的返回值，如果没有上一个loader，则是css的内容
};
```
* style-loader把css添加到style标签里
```javascript
module.exports = function (source) {
    return `const e = document.createElement('style');
        e.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(e);`;
};
```
* 虽然每个loader功能简单，但是loader之前职责单一，方便扩展。

##### 总结
webpack loader的功能远不止这些，本文算是编写loader的"套路"入门篇。
##### 参考
* [编写一个loader](https://doc.webpack-china.org/contribute/writing-a-loader/#src/components/Sidebar/Sidebar.jsx)
* [webpack-loader api](https://doc.webpack-china.org/api/loaders/#src/components/Sidebar/Sidebar.jsx)
* [loader-utils](https://github.com/webpack/loader-utils)
* [schema-utils](https://github.com/webpack-contrib/schema-utils)
