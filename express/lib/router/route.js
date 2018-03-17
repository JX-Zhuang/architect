const methods = require('methods');
const Layer = require('./layer');

class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};
    }

    dispatch(req, res, done) {
        const self = this,method = req.method.toLowerCase();
        let i = 0;
        next();

        function next() {
            const layer = self.stack[i++];
            if (!layer) {
                return done();
            }
            if(layer.method&&layer.method!==method){
                return next();
            }
            layer.handle_request(req, res, next);
        }
    }
}

methods.forEach(method => Route.prototype[method] = function () {
    for (let i = 0; i < arguments.length; i++) {
        const handle = arguments[i];
        const layer = new Layer('/', {}, handle);
        layer.method = method;

        this.methods[method] = true;
        this.stack.push(layer);
    }
    return this;
});
module.exports = Route;