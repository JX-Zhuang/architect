/**
 * 需求：从第一个接口里得到第二个接口的地址，从第二个接口里获取第三个接口的地址，拿到数据
 */
let fs = require('fs');

//事件监听
function getApi(api, callBack) {
    fs.readFile(`./${api}.json`, "utf8", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const api = JSON.parse(data);
            callBack(api);
        }
    });
}
function Event() {
    this.event = {};
}
Event.prototype.on = function (type,callBack) {
    if(this.event[type]){
        this.event[type].push(callBack);
    }else{
        this.event[type] = [callBack];
    }
};
Event.prototype.emit = function (type,...data) {
    this.event[type].forEach((item)=>item(...data));
};
let event = new Event();
event.on('api1',function () {
    getApi(1, function (api) {
        console.log(api.msg);
        event.emit('api2',api.data.api);
    });
});
event.on('api2',function (api) {
    getApi(api, function (api) {
        console.log(api.msg);
        event.emit('api3',api.data.api);
    });
});
event.on('api3',function (api) {
    getApi(api, function (api) {
        console.log(api.msg);
    });
});
event.emit('api1');