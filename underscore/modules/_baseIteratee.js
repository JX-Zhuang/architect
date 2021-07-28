const optimizeCb = require('./_optimizeCb');
const identity = require('./identity'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isArray = require('./isArray'),
    property = require('./property');
module.exports = function (value, context) {
    if (!value) return identity;
    if (isFunction(value)) return optimizeCb(value, context);
    if (isObject(value) && !isArray(value)) return;
    return property(value);
};