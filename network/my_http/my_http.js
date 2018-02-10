let net = require('net');
let parser = require('./parser');
function createServer(requestListener) {
    return new Server(requestListener);
}
class Server extends net.Server {
    constructor(requestListener){
        super();
        if(requestListener){
            this.on('request',requestListener);
        }
        this.on('connection',connection.bind(this));
    }
}
function connection(socket) {
    //socket 双工流
    // socket.end('oo');
    let res = {
        write:socket.write.bind(socket),
        end:function(chunk){
            let data = 'HTTP/1.1 200 OK\n' +
                'Date: Wed, 07 Feb 2018 10:04:38 GMT\n' +
                'Connection: keep-alive\n' +
                `Content-Length: ${chunk.length}\n\n`+chunk;
            socket.end(data);
        }
    };
    parser(socket,(req)=>{
        this.emit('request',req,res,socket);
    });
}
let MyHttp = {
    createServer
};
let server = MyHttp.createServer(function (req,res,socket) {
    console.log(req.method);
    console.log(req.url);
    console.log(req.headers);
    req.on('data', function (data) {
        console.log(data.toString());
    });
    req.on('end', function () {
        console.log('end');
    });
    res.end('123');
});
server.listen(3000,function () {
   console.log('server is start');
});