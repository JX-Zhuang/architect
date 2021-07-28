// Collection Functions
// --------------------
// Functions that work on any collection of elements: either an array, or
// an object of key-value pairs.
// export {
//   default as each,
//   default as forEach
// } from './each.js';
var each = require('./each');
module.exports = {
  each,
  forEach: each,
  map: require('./map'),
  noop: require('./noop')
};