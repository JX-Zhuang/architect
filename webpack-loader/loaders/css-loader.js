const {getOptions} = require('loader-utils');
module.exports = function (source) {
    let options = getOptions(this);
    return source;
};