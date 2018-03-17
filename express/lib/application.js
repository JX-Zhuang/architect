const http = require('http');
const methods = require('methods');
const Router = require('./router');
const Route = require('./router/route');
const slice = Array.prototype.slice;
class Application{
    constructor(){

    }
    handle(req,res,callback){
        let done = callback||function () {
            res.statusCode = 404;
            res.end(`Cannot ${req.method} ${req.url}`);
        };
        this._router.handle(req,res,done);
    }
    listen(){
        const server = http.createServer(this.handle.bind(this));
        server.listen(...arguments);
    }
    lazyrouter(){
        if(!this._router){
            this._router = new Router();
        }
    }
}
methods.forEach(method=>{
    Application.prototype[method] = function (path) {
        this.lazyrouter();
        const route = this._router.route(path);
        route[method].apply(route,slice.call(arguments,1));
        return this;
    }
});
module.exports = Application;
