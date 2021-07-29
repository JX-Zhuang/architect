const optimizeCb = require('./_optimizeCb');
const keys = require('./keys');
const isArrayLike = require('./_isArrayLike');
const isFunction = require('./isFunction');
module.exports = function (list, predicate, context) {
    const _keys = !isArrayLike(list) && keys(list);
    const length = (_keys || list).length;
    if (!isFunction(predicate)) {
        const obj = { ...predicate };
        predicate = function (item) {
            for (const key in obj) {
                if (item[key] !== obj[key]) return false;
            }
            return true;
        };
    }
    predicate = optimizeCb(predicate, context);
    for (let i = 0; i < length; i++) {
        const key = _keys ? _keys[i] : i;
        const item = list[key];
        const result = predicate(item, key, list);
        if (result) return item;
    }
    return undefined;
}