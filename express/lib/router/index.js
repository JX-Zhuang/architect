const Layer = require('./layer');
const Route = require('./route');
const url = require('url');

class Router {
    constructor() {
        this.stack = [];
    }

    handle(req, res, done) {
        let idx = 0;
        const self = this, {path} = url.parse(req.url);
        next();

        function next() {
            let match = false;
            while (idx < self.stack.length && !match) {
                const layer = self.stack[idx++];
                if (!layer) {
                    continue;
                }
                const route = layer.route;
                if (!route) {
                    continue;
                }
                match = layer.match(path);
                if (match) {
                    return layer.handle_request(req, res, next);
                }
            }
            if(!match){
                return done();
            }
        }
    }

    route(path) {
        const route = new Route(path);
        const layer = new Layer(path, {}, route.dispatch.bind(route));
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
}

module.exports = Router;