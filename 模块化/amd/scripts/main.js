// require(['./utils'], function (utils) {
//     console.log('utils')
//     utils.request();
// });
console.log('main')
require(['./a', './b'], function (a, b) {
    console.log(b + a)
})