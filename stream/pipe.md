# Node Stream pipe的诞生
>流在Node.js中是处理流数据的抽象接口。```stream```模块提供了基础的API。使用这些API可以很容易地来构建实现流接口的对象。
Node.js里提供了很多流对象。例如```http.IncomingMessage```类、```fs.createReadStream```类等等。都继承流的私有属性和公有方法。
所以学习流，有助于学习Node的其他模块。
#### 文章结构
* 简介stream
* pipe源码
#### stream
```javascript
const EE = require('events');
const util = require('util');
function Stream() {
  EE.call(this);
}
util.inherits(Stream, EE);
```
* ```Stream```继承```EventEmitter```。流可以是可读的、可写的，或是可读写的。
* ```Stream```分为```Readable```（可读流）、```Writable```（可写流）、```Duplex```（可读写流）、```Transform```（读写过程中可以修改和变换数据的 Duplex 流）。
#### pipe
```javascript
Stream.prototype.pipe = function(dest, options){
    var source = this;
    source.on('data', ondata);
    dest.on('drain', ondrain);
    if (!dest._isStdio && (!options || options.end !== false)) {
        source.on('end', onend);
        source.on('close', onclose);
    }
    source.on('error', onerror);
    dest.on('error', onerror);
    source.on('end', cleanup);
    source.on('close', cleanup);  
    dest.on('close', cleanup);
    dest.emit('pipe', source);
    return dest;
};
```
* ```Stream```公有方法```pipe```
    * source是可读流：Readable。dest是可写流：Writable。
    * ```Readable.pipe(Writable)``` 。
    * Readable订阅事件：data、error、end、close。Readable接收到事件执行相应的方法。
    * Writable订阅事件：drain、error、close，并发布pipe事件。Writable接收到事件执行相应的方法。
    * 返回Writable。
#### ondata
```javascript
function ondata(chunk) {
    if (dest.Writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }
```
* Readable订阅data事件。
* Readable触发data事件，表示读入数据。
* ```dest.Writable```当写完时会赋值为false。
* 如果读的太快，没有写完```dest.write(chunk)```返回false。
* ```source.pause```暂停写入。
* 总结：订阅data事件，触发ondata方法，如果Readable读入数据太快，来不及写入，要暂停读入数据。
#### ondrain
```javascript
function ondrain() {
    if (source.Readable && source.resume) {
      source.resume();
    }
  }
```
* Writable订阅drain事件。
* Writable触发drain事件，表示这时才可以继续向流中写入数据。
* ```source.Readable```在读到末尾时会赋值为false。
* ```source.resume()```表示会重新触发Writable的data事件。
* 总结：订阅drain事件，表示这时才可以继续向流中写入数据，调用```source.resume()```，触发Writable的data事件。
#### cleanup
```javascript
 function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

```
* 移除Writable和Readable订阅的事件。
#### error
```javascript
function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }
```
* Writable和Readable有错误是执行的方法。
#### options
```javascript
if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
}
```
* ```dest._isStdio``` 暂时没理解。
* 如果不传options或者options.end不是false，给Readable订阅end和close事件。
#### onend
```javascript
var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }
```
* 当Readable触发end事件时，执行```dest.end()```，停止写入。
#### onclose
```javascript
function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

```
* 当Readable触发close事件后，该流将不会再触发任何事件。
* ```dest.destroy()```摧毁这个流，并发出传过来的错误。当这个函数被调用后，这个写入流就结束了。

##### 小记
* pipe方法大白话：读东西，写东西，读快了，来不及写，暂停读，来得及写了，再读东西，再写。。。
* 流在Node.js中应用广泛，http、文件、打包工具等等。可见流的重要性。
* 学习源码，有助于理解底层的实现。

##### 参考
* [Stream](http://nodejs.cn/api/stream.html)
* [pipe](https://github.com/nodejs/node/blob/master/lib/internal/streams/legacy.js)