function f1(a) {
    console.log(a)
    return a+1;
}
function f2(a) {
    console.log(a)
    return a+2;
}
function f3(a) {
    console.log(a)
    return a+3;
}
function f4(a) {
    return a+4;
}
function f5(a) {
    return a+5;
}
// console.log(compose(f1,f2,f3)(8));
function compose(...fns) {
    if (fns.length===0) return arg=>arg;
    return fns.reduce((prev, next, index) => (...args) => prev(next(...args)));
}
export default compose;