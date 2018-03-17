const express = require('express');
const router = express.Router();
const Route = express.Route;
const fn1 = function (req,res,next) {
    console.log(2)
    // res.send('get name');
    next();
};
const fn2 = function (req,res,next) {
    res.send('get name');
    next();
};
router.use('/name',require('./createRouter2'));  //会挂很多级
// router.get('/name',fn1,fn2);
// router.post('/name',function (req,res,next) {
//     res.send('post name');
// });
// const layer = router.stack[0];
// console.log(layer.handle.toString(),Route.prototype.dispatch.toString());
// console.log(fn === layer.route.stack[0].handle);

module.exports = router;