const isNone = require('./_isNone');
module.exports = function (obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
        if (isNone(obj)) return undefined;
        obj = obj[path[i]];
    }
    return length ? obj : undefined;
}