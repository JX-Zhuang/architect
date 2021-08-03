const map = require('./map');
const deepGet = require('./_deepGet');
module.exports = function (list, propertyName) {
    return map(list, function (item) {
        return deepGet(list, propertyName);
    })
};