const deepGet = require("./_deepGet");
const toPath = require("./_toPath");

module.exports = function (path) {
    path = toPath(path);
    return function (obj) {
        return deepGet(obj, path);
    }
}