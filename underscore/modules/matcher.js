const isMatch = require("./isMatch")

module.exports = function (attr) {
    return function (obj) {
        return isMatch(obj, attr);
    }
}