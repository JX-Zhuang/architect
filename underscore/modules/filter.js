const each = require('./each');
const cb = require('./_cb');
module.exports = function (list, predicate, context) {
    const results = [];
    predicate = cb(predicate, context);
    each(list, function (item, key, list) {
        if (predicate(item, key, list)) {
            results.push(item);
        }
    });
    return results;
};