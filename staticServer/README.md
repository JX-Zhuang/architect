# node 静态资源服务器
> 用node实现一个静态资源服务器，读取一个目录下的文件，如果是目录，显示该目录下的文件名。支持命令设置端口和静态目录，支持防盗链、缓存等功能。
#### 创建目录 staticServer
* npm init 在package.json里加入如下代码。bin里面是相应的命令，执行 static-server，即执行bin下面的www.js文件
```javascript
"bin": {
    "static-server": "./bin/www.js"
  }
``` 
#### config
* 在config目录下创建index.js，配置文件，root是静态目录，port是端口号。
```javascript
module.exports = {
    root:'public',
    port:8080
};
```
#### bin目录
* 在bin目录下创建www.js
* yargs是一个获取命令行参数的库
```javascript
#! /usr/bin/env node
const argv = require('yargs')
    .usage('static-server')
    .options('port', {
        alias: 'p',
        describe: '设置端口号',
        default: 8080
    })
    .options('root', {
        alias: 'r',
        describe: '设置静态目录',
        default: process.cwd()
    })
    .help()
    .argv;
const config = Object.assign(require('../config'),argv);
let StaticServer =  require('../src');
let server = new StaticServer(config);
```
#### src
* src是源代码，template里是模板文件，用来展示读取的目录信息，index是node服务的文件
* 要用到获取文件信息、读取文件和目录，把异步的方便变成同步的写法，用到了util.promisify
```javascript
const fsStat = util.promisify(fs.stat);
const fsReadFile = util.promisify(fs.readFile);
const fsReaddir = util.promisify(fs.readdir);
```
#### 目录模版
* 读取模版文件，用Handlebars做模版引擎
```javascript
let template;
function getTemplate() {
    fs.readFile(path.join(__dirname, 'template', 'template.html'), 'utf8', (err, html) => {
        if (err) {
            console.log(err);
        } else {
            template = Handlebars.compile(html);
        }
    });
}
```
#### StaticServer类
* 创建staticServer类，cacheType是缓存的类型，cwd是工作目录
```javascript
class StaticServer {
    constructor(config) {
        this.cacheType = ['CacheControl', 'Expires', 'LastModified', 'ETag'];
        this.port = config.port;
        this.root = config.root;
        this.cwd = process.cwd();
        this.createServer();
    }
}
```
#### createServer启动服务
```javascript
createServer() {
    try {
        const server = http.createServer(this.requestListener.bind(this));
        server.listen(this.port, () => {
            console.log(`server is ok;http://localhost:${this.port}`);
        });
    } catch (e) {
        this.errorListener(e);
    }
}
```
#### errorListener
* errorListener容错处理函数
```javascript
errorListener(err) {
   console.log(err);
}
```
#### requestListener
* createServer监听函数，req是请求、res是相应、dir是文件目录。
* 用mime模块获得mimetype，设置相应头 Content-Type，如果是文字，设置charset是utf-8。
* fsStat获取文件的信息。如果是目录，获取目录；如果是文件，返回文件。
* 如果是图片，先设置防盗链，返回文件。
````javascript
async requestListener(req, res) {
    const pathname = url.parse(req.url).pathname;
    const dir = path.join(this.root, pathname);
    try {
        let contentType = mime.getType(dir);
        if (contentType&&contentType.match('text')) {
            contentType += ';charset=utf-8';
        }
        res.setHeader('Content-Type', contentType);
        const stat = await fsStat(dir);
        if (stat.isDirectory()) {
            this.getDir(req,res,pathname,dir);
        } else {
            this.proxyGetFile(req,res,pathname,dir,stat);
        }
    } catch (e) {
        res.statusCode = 404;
        res.end(e.toString());
        this.errorListener(e);
    }
}
````
#### 读取目录
* 循环目录下的文件名，得到一个数组，每个元素是一个对象，名字和url。
* 返回模板
```javascript
async getDir(req,res,pathname,dir) {
    const dirs = await fsReaddir(dir);
    const list = dirs.map(dir => ({name: dir, url: path.join(pathname, dir)}));
    const html = template({
        title: dir,
        list
    });
    res.end(html);
}
```
#### 防盗链
* 如果是当前服务器访问的就返回该图片，如果是其他服务器访问，返回空白图片
```javascript
sendForbidden(req,res,pathname,dir,stat) {
    const referer = req.headers['referer'] || req.headers['refer'];
    if (referer && url.parse(referer).host !== req.headers['host']) {
        console.log('防盗链');
        res.statusCode = 403;
        fs.createReadStream(path.join(__dirname, 'forbidden.png')).pipe(res);
        return false;
    }
    return true;
}
```
#### 读取文件
* 设置缓存，该类有getFileCacheControl、getFileExpires、getFileLastModified、getFileETag方法
```javascript
proxyGetFile(req,res,pathname,dir,stat) {
    if (mime.getType(dir).match('image')) {
        //图片
        if (!this.sendForbidden(req,res,pathname,dir,stat)) {
            return;
        }
    }
    for (let i = 0; i < this.cacheType.length; i++) {
        if (this[`getFile${this.cacheType[i]}`](req,res,pathname,dir,stat)) {
            console.log(this.cacheType[i]);
            return;
        }
    }
    this.getFile(req,res,pathname,dir,stat);
}
```
#### 强制缓存
* 通过设置响应头Expires和Cache-Control来实现强制缓存
```javascript
getFileExpires(req,res,pathname,dir,stat) {
    res.setHeader('Expires', new Date(Date.now() + 60 * 1000));
}

getFileCacheControl(req,res,pathname,dir,stat) {
    res.setHeader('Cache-Control', 'max-age=60');
}  
```
#### 协商缓存
* 设置响应头的Last-Modified为文件修改时间，如果请求头的If-Modified-Since和文件修改时间一样，设置Status Code为304，让客户端从缓存里获取数据。
* 设置响应头的ETag为文件修改时间的md5值，如果请求头的If-None-Match和md5值一样，设置Status Code为304，让客户端从缓存里获取数据。
```javascript
getFileLastModified(req,res,pathname,dir,stat) {
    const lastModified = stat.ctime.toGMTString();
    res.setHeader('Last-Modified', lastModified);
    if (req.headers['if-modified-since'] === lastModified) {
        res.statusCode = 304;
        res.end();
        return true;
    }
}

getFileETag(req,res,pathname,dir,stat) {
    let ifNoneMatch = req.headers['if-none-match'];
    let etag = crypto.createHash('md5').update(stat.ctime.toGMTString(), 'utf8').digest('hex');
    res.setHeader('ETag', etag);
    if (ifNoneMatch == etag) {
        res.statusCode = 304;
        res.end();
        return true;
    }
}
```
#### 压缩
* 根据请求头Accept-Encoding，返回不同的压缩格式
```javascript
compressFile(req,res,inp) {
    const acceptEncodings = req.headers['accept-encoding'];
    if(/\bgzip\b/.test(acceptEncodings)){
        this.gzipFile(req,res,inp);
        return true;
    }else if(/\bdeflate\b/.test(acceptEncodings)){
        this.deflateFile(req,res,inp);
        return true;
    }
    return false;
}

gzipFile(req,res,inp) {
    const gzip = zlib.createGzip();
    res.setHeader('Content-Encoding','gzip');
    inp.pipe(gzip).pipe(res);
}

deflateFile(req,res,inp) {
    const deflate = zlib.createDeflate();
    res.setHeader('Content-Encoding','deflate');
    inp.pipe(deflate).pipe(res);
}
```
#### 读取文件
* 先进行压缩
```javascript
getFile(req,res,pathname,dir,stat) {
    const fsReadStream = fs.createReadStream(dir);
    if(!this.compressFile(req,res,fsReadStream))
        fsReadStream.pipe(res);
}
```
##### 总结
根据近段时间学习，做了静态资源服务器，根据请求头做一些操作，返回响应的响应头。功能有待改善，后续会继续更新，并发不到npm上。
