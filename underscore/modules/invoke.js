const map = require('./map');
const deepGet = require('./_deepGet');
const isString = require('./isString');
const cb = require('./_cb');
const isFunction = require('./isFunction');
function invoke(list, methodName) {
    const reset = [].splice.call(arguments, 2);
    return map(list, function (item) {
        const func = deepGet(item, isString(methodName) ? methodName.split(',') : methodName);
        console.log(item,func)
        return isFunction(func) ? func.apply(item, reset) : func;
    });
};
var getThis = function () { return this; };
var getFoo = function () { return 'foo' }
var item = {
    a: {
        b: getFoo,
        c: getThis,
        d: null
    }
};
console.log(invoke([item], ['a', 'c']))
module.exports = invoke;