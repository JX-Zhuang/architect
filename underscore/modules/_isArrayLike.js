module.exports = function (list) {
    const length = list ? list.length : undefined;
    return typeof length === 'number' && length >= 0;
}