function add1(str) {
    return str+1;
}
function add2(str) {
    return str+2;
}
// let r = add2(add1('zhuang'));
function compose1(...fns) {

    return function (...args) {
        let last = fns.pop();
        return fns.reduceRight((val,fn)=>{
            return fn(val);
        },last(...args));
    }
}

function compose(...fns) {
    if(fns.length===1)
        return fns[0];
    return fns.reduce((a,b)=>(...args)=>a(b(...args)));
}
let add = compose(add2,add1);
let r = add('zhuang');
console.log(r);