module.exports = function (name) {
    const tag = `[object ${name}]`;
    return function (obj) {
        return Object.prototype.toString.call(obj) === tag;
    }
}