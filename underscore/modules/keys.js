const isObject = require('./isObject');
module.exports = function (obj) {
    if (!isObject(obj)) return [];
    return Object.keys(obj);
}