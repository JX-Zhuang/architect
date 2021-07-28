const isNone = require('./_isNone');
module.exports = function (func, context) {
    if (isNone(context)) return func;
    return func.bind(context);
}