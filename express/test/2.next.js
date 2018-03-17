const express = require('express');
const app = express();
const router = require('./createRouter');
const fn1 = function(req, res,next) {
    console.log(1)
    // res.send('hello world');
    next()
};
const fn2 = function(req, res,next) {
    res.send('hello world 1');
    next()
};
app.use(function () {
   console.log(1);
})
// app.get('/', fn1,fn2);
app.use('/user', router);
app.listen(3000,function () {
    console.log('server is ok');
});