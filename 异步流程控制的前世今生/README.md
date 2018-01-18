# javascript异步的发展
>需求：有三个api，已知第一个api的地址 "1"，从第一个api里获取第二个api的地址，从第二个api里获取第三个api的地址。
用fs模块模拟请求api。

#####api的数据结构
``` javascript
{
  "msg":"This is x", //message
  "data":{
    "api":"x"        //api的地址
  }
}
```
###回调函数
* 传统方式，符合传统js编程
* 可读性差
* 容易形成回调地狱
```javascript
let fs = require('fs');
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
getApi('1',(api)=>{
    console.log(api.msg);
    getApi(api.data.api,(api)=>{
        console.log(api.msg);
        getApi(api.data.api,(api)=>{
            console.log(api.msg);
        })
    })
});
```
###事件订阅
* 发布订阅模式，每次请求订阅事件，得到数据后，发布事件
* 如果请求api很多，要订阅很多事件
* 代码融于，不方便维护
```javascript
let fs = require('fs');
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
```

###Promise
* 链式调用，代码易读
```javascript
let fs = require('fs');
//Promise
function getApi(api) {
    return new Promise(function (resolve,reject) {
        fs.readFile(`./${api}.json`, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                const api = JSON.parse(data);
                resolve(api);
            }
        });
    });
}
getApi(1).then(function (data) {
   console.log(data.msg);
   return getApi(data.data.api);
}).then(function (data) {
    console.log(data.msg);
    return getApi(data.data.api);
}).then(function (data) {
    console.log(data.msg);
});
```

###Generator
* 执行next(),返回对象，key分别是value，done。value是yield 语句后面的内容，done表示是否还有next可以执行
* 以 let api2 = yield getApi(api1) 为例api2是next传入的参数。
* 个人感觉不如promise好用。。。（欢迎来喷，交流学习）
```javascript
let fs = require('fs');
//generator
function getApi(api) {
    return new Promise(function (resolve,reject) {
        fs.readFile(`./${api}.json`, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                const api = JSON.parse(data);
                resolve(api);
            }
        });
    });
}
function* gen(api1) {
    //api1 api2 ap3 是接收用户输入的
    let api2 = yield getApi(api1);
    let api3 = yield getApi(api2);
    yield getApi(api3);
}
let g = gen(1);
let api1 = g.next();
api1.value.then(function (data) {
    console.log(data.msg);
    return data
}).then(function (data) {
    let api2 = g.next(data.data.api).value;
    return api2;
}).then(function (data) {
    console.log(data.msg);
    let api3 = g.next(data.data.api).value;
    return api3;
}).then(function (data) {
    console.log(data.msg);
});
```
###async
* Generator的语法糖，比Generator易读、容易理解
* 代码同步写，同步执行
```javascript
let fs = require('fs');
// async await
function getApi(api) {
    return new Promise(function (resolve, reject) {
        fs.readFile(`./${api}.json`, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                const api = JSON.parse(data);
                resolve(api);
            }
        });
    });
}
async function executor(api) {
    let api1, api2, api3;
    await getApi(api).then(function (data) {
        api1 = data;
        console.log(api1.msg);
    });
    await getApi(api1.data.api).then(function (data) {
        console.log(data.msg);
        api2 = data;
    });
    await (function () {
        if (api2.data) {
            getApi(api2.data.api).then(function (data) {
                console.log(data.msg);
            });
        }
    })();
}
executor(1);
```
#### 小结
小结不是小姐。个人理解，async是趋势，Promise比Generator好用。妈妈再也不会担心回调地狱啦