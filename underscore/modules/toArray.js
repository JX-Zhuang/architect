const map = require('./map');
const isArrayLike = require('./_isArrayLike');
const identity = require('./identity');
const values = require('./values');
const isString = require('./isString');
const reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
module.exports = function (list) {
    if (!list) return [];
    if (isString(list)) return list.match(reStrSymbol);
    if (isArrayLike(list)) return map(list, identity);
    return values(list);
};