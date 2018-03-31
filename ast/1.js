const esprima = require('esprima');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const code = 'class A{}';
// const r = esprima.parse(code);
// const result = escodegen.generate(r);
// console.log(result);


// let code = 'function ast(){}';
let ast = esprima.parse(code);
console.log(ast);
estraverse.traverse(ast,{
    enter(node){
        node.name += '_ext';
    },
    leave(node){
        // console.log(node.type);
    }
});
let generated = escodegen.generate(ast);
console.log(generated);