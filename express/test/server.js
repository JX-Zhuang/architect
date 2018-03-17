// const express = require('express');
const express = require('../lib/express');
const app = express();
app.get('/',(req,res,next)=>{
    res.end('get / 1');
    next();
    console.log(1.1);
});
app.get('/',(req,res,next)=>{
    res.end('get / 2');
    next();
    console.log(2.1);
});
app.get('/user',(req,res,next)=>{
    res.end('get /user 1');
    next();
    console.log(2.1);
});
app.get('/user',(req,res,next)=>{
    res.end('get /user 2');
    next();
    console.log(2.1);
});
app.post('/',(req,res,next)=>{
    console.log('/post.1');
    next();
    console.log(2.1);
});
app.post('/',(req,res,next)=>{
    console.log('/post.2');
    next();
    console.log(2.1);
});
app.listen(8080,()=>{
    console.log('ok');
});