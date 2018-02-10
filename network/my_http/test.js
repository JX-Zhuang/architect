let http = require('http');
let server = http.createServer();
server.on('request',function (req,res) {
   res.end('ok');
});
server.listen(3001,function () {
    console.log('server is start');
});