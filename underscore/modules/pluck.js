const map = require('./map');
const property = require('./property');
module.exports = function (list, propertyName) {
    return map(list, property(propertyName))
};