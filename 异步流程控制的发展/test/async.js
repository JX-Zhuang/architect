function timeout(ms,color) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(color);
        },ms);
    });
}

async function asyncPrint(value, ...ms) {
    const light = ['red','yellow','green'];
    for(var i = 0;i<light.length;i++){
        console.log(i);
        await timeout(ms[i],light[i]).then(function (data) {
            console.log(data);
        });
    }
    console.log(value);
}

asyncPrint('hello world', 1000,2000,3000);
console.log(99)