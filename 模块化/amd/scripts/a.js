console.log('a');
const start = Date.now();
while (true) {
    if (Date.now() - start > 4000) break;
}
define(['./d'], function (d) {
    return 10 + d
})