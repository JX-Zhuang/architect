const express = require('express');
const app = express();
const router = require('./createRouter');
const fn = function (req, res, next) {
    console.log(req.url)
    res.send('hello world');
    // next()
};
//1.app.get创建路由
app.use('/a', function (req, res, next) {
    console.log('a')
    res.send('hello world');
    next()
});
app.use('/aa',function (req, res, next) {
    console.log('aa')
    res.send('hello world');
    next()
});
// //2.app.all
// app.all('/', fn);
// //3.app.route创建路由
// app.route('/book')
//     .get(fn)
//     .post(fn)
//     .put(fn);
// //4.express.Router
// app.use(router);
// app.use(fn);
// app.use('/a', fn);
// app.use('/user', router);
// app.get('/get', router);
debugger;
// console.log(app._router.stack[2].route.stack[0].handle===fn);
// console.log(app._router.stack[3].route.stack[0].handle===fn);
// console.log(app._router.stack[4].route.stack[0].handle===fn);
// console.log(app._router.stack[5].handle===router);
// console.log(app._router.stack[6].handle===fn);
// console.log(app._router.stack[7].handle===fn);
app.listen(3000, function () {
    console.log('server is ok');
});