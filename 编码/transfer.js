/**
 * Unicode -> UTF-8
 */
function transfer(num) {
    /**
     * 1.转换成二进制
     * 2.判断在哪个范围
     */
    // num = '0x'+num;
    let binary = num.toString(2),r;
    let l = binary.length;
    if (num >= 0x00000000 && num <= 0x0000007F) {
        let arr = ['0'];

    } else if (num >= 0x00000080 && num <= 0x0000007FF) {
        let arr = ['110', '10'];
    } else if (num >= 0x00000800 && num <= 0x0000FFFF) {
        let arr = ['1110', '10', '10'];
        arr[2]=arr[2]+binary.slice(l-6);
        arr[1]=arr[1]+binary.slice(l-12,l-6);
        arr[0]=arr[0]+binary.slice(0,l-12).padStart(4,'0');
        r = arr.join('');
    } else if (num >= 0x00010000 && num <= 0x0010FFFF) {
        let arr = ['11110', '10', '10', '10'];

    } else {
        console.log('请输入正确的Unicode编码');
        return;
    }
    console.log(parseInt(r,2).toString(16));

}
transfer(0x4E07);

const fs = require('fs');

// fs.readFile('./', () => {
//     setTimeout(() => {
//         console.log('timeout');
//     }, 0);
//     setImmediate(() => {
//         console.log('immediate');
//     });
// });
setTimeout(function () {
    console.log(5);
}, 0);
setImmediate(function() {
    console.log(6);
});