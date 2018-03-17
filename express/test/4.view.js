const express = require('express');
const app = express();
const ejs = require('ejs');
app.set('views',__dirname);
app.set('view engine','html');
app.engine('html',ejs.__express);
app.get('/',function (req,res,next) {
   res.render('index',{content:'hello world'});
});
app.listen(3000);