const http = require('http');
const fs = require('fs');
const url = require('url');
const util = require('util');
const path = require('path');
const mime = require('mime');
const fsStat = util.promisify(fs.stat);
const fsReadFile = util.promisify(fs.readFile);
const fsReaddir = util.promisify(fs.readdir);
const Handlebars = require('Handlebars');
const crypto = require('crypto');
const zlib = require('zlib');
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

getTemplate();

class StaticServer {
    constructor(config) {
        this.cacheType = ['CacheControl', 'Expires', 'LastModified', 'ETag'];
        this.port = config.port;
        this.root = config.root;
        this.cwd = process.cwd();
        this.createServer();
    }

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

    async requestListener(req, res) {
        this.req = req;
        this.res = res;
        this.url = req.url;
        this.dir = path.join(this.root, this.url);
        console.log(this.dir);
        try {
            let contentType = mime.getType(this.dir);
            if (contentType.match('text')) {
                contentType += ';charset=utf-8';
            }
            this.res.setHeader('Content-Type', contentType);
            this.stat = await fsStat(this.dir);
            if (this.stat.isDirectory()) {
                this.getDir();
            } else {
                if (mime.getType(this.dir).match('image')) {
                    //图片
                    if (!this.sendForbidden()) {
                        return;
                    }
                }
                this.proxyGetFile();
            }
        } catch (e) {
            res.statusCode = 404;
            res.end(e.toString());
            this.errorListener(e);
        }
    }

    proxyGetFile() {
        for (let i = 0; i < this.cacheType.length; i++) {
            if (this[`getFile${this.cacheType[i]}`]()) {
                console.log(this.cacheType[i]);
                return;
            }
        }
        this.getFile();
    }

    getFileLastModified() {
        this.res.setHeader('Last-Modified', this.stat.ctime.toGMTString());
        if (this.req.headers['if-modified-since'] === this.stat.ctime.toGMTString()) {
            this.res.statusCode = 304;
            this.res.end();
            return true;
        }
    }

    getFileETag() {
        let ifNoneMatch = this.req.headers['if-none-match'];
        let etag = crypto.createHash('md5').update(this.stat.ctime.toGMTString(), 'utf8').digest('hex');
        this.res.setHeader('ETag', etag);
        if (ifNoneMatch == etag) {
            this.res.statusCode = 304;
            this.res.end();
            return true;
        }
    }

    getFileExpires() {
        this.res.setHeader('Expires', new Date(Date.now() + 60 * 1000));
    }

    getFileCacheControl() {
        this.res.setHeader('Cache-Control', 'max-age=60');
    }

    compressFile(inp) {
        const acceptEncodings = this.req.headers['accept-encoding'];
        if(/\bgzip\b/.test(acceptEncodings)){
            this.gzipFile(inp);
            return true;
        }else if(/\bdeflate\b/.test(acceptEncodings)){
            this.deflateFile(inp);
            return true;
        }
        return false;
    }

    gzipFile(inp) {
        const gzip = zlib.createGzip();
        this.res.setHeader('Content-Encoding','gzip');
        inp.pipe(gzip).pipe(this.res);
    }

    deflateFile(inp) {
        const deflate = zlib.createDeflate();
        this.res.setHeader('Content-Encoding','deflate');
        inp.pipe(deflate).pipe(this.res);
    }

    async getFile() {
        const fsReadStream = fs.createReadStream(this.dir);
        if(!this.compressFile(fsReadStream))
            fsReadStream.pipe(this.res);
    }

    async getDir() {
        const dirs = await fsReaddir(this.dir);
        const list = dirs.map(dir => ({name: dir, url: path.join(this.url, dir)}));
        const html = template({
            title: this.dir,
            list
        });
        this.res.end(html);
    }

    sendForbidden() {
        this.referer = this.req.headers['referer'] || this.req.headers['refer'];
        if (this.referer && url.parse(this.referer).host !== this.req.headers['host']) {
            console.log('防盗链');
            this.res.statusCode = 403;
            fs.createReadStream(path.join(__dirname, 'forbidden.png')).pipe(this.res);
            return false;
        }
        return true;
    }

    errorListener(err) {
        console.log(err);
    }

}

module.exports = StaticServer;