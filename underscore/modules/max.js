const each = require('./each');
const cb = require('./_cb');
const isNone = require('./_isNone');
const isArrayLike = require('./_isArrayLike');
const isNumber = require('./isNumber');
const isObject = require('./isObject');
const values = require('./values');
module.exports = function (list, iteratee, context) {
    let result = -Infinity;
    if (isNone(iteratee) || isNumber(iteratee) && !isObject(list[0]) && !isNone(list)) {
        list = isArrayLike(list) ? list : values(list);
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!isNone(item) && item > result) {
                result = item;
            }
        }
    } else {
        iteratee = cb(iteratee, context);
        each(list, function (item, index, list) {
            const current = iteratee(item, index, list);
            if (isNumber(current)) {
                if (current > iteratee(result) || result === -Infinity) {
                    result = item;
                }
            }
        });
    }
    return result;
}