const isObject = require('./isObject');
const keys = require('./keys');
module.exports = function (object, properties) {
    const _keys = keys(properties), length = _keys.length;
    for (let i = 0; i < length; i++) {
        const key = _keys[i];
        if (properties[key] !== object[key] || !(key in object)) return false;
    }
    return true;
}