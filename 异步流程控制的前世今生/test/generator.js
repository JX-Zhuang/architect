// var fetch = require('node-fetch');
//
// function* gen() {
//     var url = 'https://api.github.com/users/github';
//     var result = yield fetch(url);
//     console.log("reset");
//     console.log(result.login);
// }
//
// var g = gen();
// var result = g.next();
//
// result.value.then(function (data) {
//     return data.json();
// }).then(function (data) {
//     console.log(data)
//     g.next(data);
// });

function* gen() {
    var getApi = yield new Promise(function (resolve, reject) {
        setTimeout(function () {
            let api = {status:'success'};
            console.log("getApi is over");
            resolve(api);
        }, 2000);
    });
    console.log(getApi);
    var getData = yield new Promise(function (resolve,reject) {
        setTimeout(function () {
            if(getApi.status){
                let data = {msg:'ok'};
                console.log("getData is over");
                resolve(data);
            }
        }, 1000);
    });
    console.log(getData);
}

var g = gen();
var result = g.next();
result.value.then(function (data) {
    return data;
}).then(function (data) {
    let getData = g.next(data).value;
    return getData;
}).then(function(data){
    g.next(data);
});



