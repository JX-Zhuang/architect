#! /usr/bin/env node
const argv = require('yargs')
    .usage('static-server')
    .options('port', {
        alias: 'p',
        describe: '设置端口号',
        default: 8080
    })
    .options('root', {
        alias: 'r',
        describe: '设置静态目录',
        default: process.cwd()
    })
    .help()
    .argv;
const config = Object.assign(require('../config'),argv);
let StaticServer =  require('../src');
let server = new StaticServer(config);


