console.log('main1');  //1

process.nextTick(function() {
    console.log('process.nextTick1');   //4
});

setTimeout(function() {
    console.log('setTimeout');      //6
    process.nextTick(function() {
        console.log('process.nextTick2');   //7
    });
});

new Promise(function(resolve, reject) {
    console.log('promise'); //2
    resolve();
}).then(function() {
    console.log('promise then');    //5
});

console.log('main2');   //3

//
// var p = new Promise(function(resolve,reject){
//     let a ;
//     setTimeout(function(){
//         a = 10;
//         resolve(a)
//     },2000);
// });
// p.then(function(data){
//     console.log(data)
// })
