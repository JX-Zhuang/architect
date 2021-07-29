const keys = require('./keys');
const optimizeCb = require('./_optimizeCb');
const isArrayLike = require('./_isArrayLike');
const isNone = require('./_isNone');
module.exports = function (dir) {
    const reduce = function (list, iteratee, memo, initial) {
        const _keys = !isArrayLike(list) && keys(list),
            length = (_keys || list).length;
        let i = dir > 0 ? 0 : length - 1;
        if (!initial) {
            memo = list[_keys ? _keys[i] : i];
            i += dir;
        }
        for (; i < length && i >= 0; i += dir) {
            const key = _keys ? _keys[i] : i;
            memo = iteratee(memo, list[key], key, list);
        }
        return memo;
    }
    return function (list, iteratee, memo, context) {
        const initial = arguments.length >= 3;
        return reduce(list, optimizeCb(iteratee, context), memo, initial);
    }
}