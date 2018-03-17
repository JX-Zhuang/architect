const express = require('express');
const app = express();
const router = require('./createRouter');
const fn = function (req, res, next) {
    console.log(1)
    res.send('hello world');
    next()
};
//1.app.get创建路由
// app.use('/', fn);
app.use('/user',router);
debugger
app.listen(3000, function () {
    console.log('server is ok');
});