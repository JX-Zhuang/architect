/**
 * 需求：从第一个接口里得到第二个接口的地址，从第二个接口里获取第三个接口的地址，拿到数据
 */
let fs = require('fs');
//  回调
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