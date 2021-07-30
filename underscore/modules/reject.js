const filter = require('./filter');
const negate = require('./negate');
const cb = require('./_cb');
module.exports = function (list, predicate, context) {
    return filter(list, negate(cb(predicate)), context);
}