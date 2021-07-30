const find = require('./find');
const matcher = require('./matcher');
module.exports = function(list,properties){
    return find(list,matcher(properties));
}