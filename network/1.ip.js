let os = require('os');
let network = os.networkInterfaces();
// console.log(network);
const { TCP, constants: TCPConstants } = process.binding('tcp_wrap');
console.log(process.binding('tcp_wrap'));