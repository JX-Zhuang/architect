const keys = require('./keys');
const optimizeCb = require('./_optimizeCb');
const isArrayLike = require('./_isArrayLike');
function each(list, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    if (isArrayLike(list)) {
        for (let i = 0; i < list.length; i++) {
            iteratee(list[i], i, list);
        }
    } else {
        const _keys = keys(list);
        for (let i = 0; i < _keys.length; i++) {
            const key = _keys[i];
            iteratee(list[key], key, list);
        }
    }
    return list;
}
module.exports = each;