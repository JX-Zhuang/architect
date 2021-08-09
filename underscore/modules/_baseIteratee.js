const optimizeCb = require('./_optimizeCb');
const isNone = require('./_isNone');
const identity = require('./identity'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isArray = require('./isArray'),
    property = require('./property'),
    isMatch = require('./isMatch');
module.exports = function (value, context) {
    if (isNone(value)) return identity;
    if (isFunction(value)) return optimizeCb(value, context);
    if (isObject(value) && !isArray(value)) return function (obj) {
        return isMatch(obj, value);
    };
    return property(value);
};