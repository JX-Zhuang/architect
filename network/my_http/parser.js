let fs = require('fs');
const {StringDecoder} = require('string_decoder');
const decoder = new StringDecoder('utf8');

function parser(readableStream, readableStreamListener) {

    function onReadable() {
        let buf, buffers = [];
        while (null !== (buf = readableStream.read())) {
            buffers.push(buf);
            let str = decoder.write(buffers);   //所有读到的
            if (str.match(/\r\n\r\n/)) {
                let request = str.split(/\r\n\r\n/);
                let headerObj = parserHeaders(request.shift());
                let body = request.join(/\r\n/);
                Object.assign(readableStream, headerObj);
                readableStream.removeListener('readable', onReadable);
                readableStream.unshift(Buffer.from(body));
                return readableStreamListener(readableStream);
            }
        }
    }

    readableStream.on('readable', onReadable);

}

function parserHeaders(headerStr) {
    let lines = headerStr.split(/\r\n/);
    let start = lines.shift().split(' ');
    let method = start[0];
    let url = start[1];
    let protocal = start[2];
    let headers = {};
    lines.forEach(line => {
        "use strict";
        let row = line.split(': ');
        headers[row[0]] = row[1];
    });
    return {headers, method, url, protocal};
}
module.exports = parser;