const map = require('./map');
const deepGet = require('./_deepGet');
const isString = require('./isString');
const isFunction = require('./isFunction');
const isNone = require('./_isNone');
function invoke(list, methodName) {
    let func, path, contextPath;
    if (isFunction(methodName)) {
        func = methodName;
    } else {
        path = isString(methodName) ? methodName.split(',') : methodName;
        contextPath = path.slice(0, -1);
    }
    const reset = [].splice.call(arguments, 2);
    path = path[path.length - 1];
    return map(list, function (context) {
        let method = func;
        if (!method) {
            if (contextPath && contextPath.length) {
                context = deepGet(context, contextPath);
            }
            if (isNone(context)) return undefined;
            method = context[path];
        }
        return isNone(method) ? method : method.apply(context, reset);
    });
};
module.exports = invoke;