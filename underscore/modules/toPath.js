const isArray = require("./isArray")

module.exports = function (path) {
    return isArray(path) ? path : [path];
}