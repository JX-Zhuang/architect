const isArrayLike = require("./_isArrayLike");
const optimizeCb = require("./_optimizeCb");
const keys = require("./keys");
module.exports = function (list, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    const _keys = !isArrayLike(list) && keys(list),
        length = (_keys || list).length,
        result = new Array(length);
    for (let i = 0; i < length; i++) {
        const key = _keys ? _keys[i] : i;
        result[key] = iteratee(list[key], key, list);
    }
    return result;
};