/**
 * 需求：从第一个接口里得到第二个接口的地址，从第二个接口里获取第三个接口的地址，拿到数据
 */
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