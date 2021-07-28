module.exports = function (func, context) {
    return func.bind(context);
}