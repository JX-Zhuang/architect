const filter = require('./filter');
const matcher = require('./matcher');
module.exports = function (list, properties) {
    return filter(list, matcher(properties));
}