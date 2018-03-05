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

    getFileExpires(req,res,pathname,dir,stat) {
        res.setHeader('Expires', new Date(Date.now() + 60 * 1000));
    }

    getFileCacheControl(req,res,pathname,dir,stat) {
        res.setHeader('Cache-Control', 'max-age=60');
    }

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

    getFile(req,res,pathname,dir,stat) {
        const fsReadStream = fs.createReadStream(dir);
        if(!this.compressFile(req,res,fsReadStream))
            fsReadStream.pipe(res);
    }
    async getDir(req,res,pathname,dir) {
        const dirs = await fsReaddir(dir);
        const list = dirs.map(dir => ({name: dir, url: path.join(pathname, dir)}));
        const html = template({
            title: dir,
            list
        });
        res.end(html);
    }

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

    errorListener(err) {
        console.log(err);
    }

}

module.exports = StaticServer;