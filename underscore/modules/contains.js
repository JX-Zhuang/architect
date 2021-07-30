const keys = require('./keys');
const isArrayLike = require('./_isArrayLike');
module.exports = function (list, value, fromIndex) {
    if (typeof fromIndex !== 'number') fromIndex = 0;
    const _keys = !isArrayLike(list) && keys(list);
    const length = (_keys || list).length;
    if (fromIndex < 0) fromIndex += length;
    for (let i = fromIndex; i < length; i++) {
        const key = _keys ? _keys[i] : i;
        if (list[key] === value) return true;
    }
    return false;
}