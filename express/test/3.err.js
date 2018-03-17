var express = require('express');
var app = express();

app.get('/',function(err, req, res, next) {
    console.error(err);
    // res.status(500).send('Something broke!');
});
app.get('/',function(req, res, next) {
    res.send('hello');
    next('err');
});
app.get('/user',function(req, res, next) {
    res.send('user');
    next();
});
app.listen(8000, function() {
    console.log('Example app listening on port 3000!');
});