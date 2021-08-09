const isNone = require('./_isNone');
module.exports = function (start, stop, step) {
    if (isNone(stop)) {
        stop = start || 0;
        start = 0;
    }
    if (!step) {
        step = start > stop ? -1 : 1;
    }
    const length = Math.max(Math.floor((stop - start) / step), 0);
    const result = Array(length);
    for (let i = 0; i < length; i++, start += step) {
        result[i] = start;
    }
    return result;
}