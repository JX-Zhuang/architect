/**
 * 需求：从第一个接口里得到第二个接口的地址，从第二个接口里获取第三个接口的地址，拿到数据
 */
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