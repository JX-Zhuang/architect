const cb = require('./_cb');
const keys = require('./keys');
const isArrayLike = require('./_isArrayLike');
module.exports = function (list, predicate, context) {
    const _keys = !isArrayLike(list) && keys(list),
        length = (_keys || list).length;
    predicate = cb(predicate, context);
    for (let i = 0; i < length; i++) {
        const key = _keys ? _keys[i] : i;
        if (predicate(list[key], list)) return true;
    }
    return false;
};