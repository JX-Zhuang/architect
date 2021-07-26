// require(['./utils'], function (utils) {
//     console.log('utils')
//     utils.request();
// });
require(['./a', './b'], function (a, b) {
    console.log(b + a)
})