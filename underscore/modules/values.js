const keys = require('./keys');
module.exports = function (obj) {
    const _keys = keys(obj);
    const length = _keys.length;
    const values = new Array(length);
    for (let i = 0; i < length; i++) {
        values[i] = obj[_keys[i]];
    }
    return values;
}