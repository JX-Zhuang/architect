/**
 * 需求：从第一个接口里得到第二个接口的地址，从第二个接口里获取第三个接口的地址，拿到数据
 */
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
