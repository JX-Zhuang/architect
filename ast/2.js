let babel = require('babel-core');
let types = require('babel-types');
const code = `class A{
   constructor(name){
     this.name = name;
    }
}`;
const visitor = {
    ClassDeclaration: {
        enter(path) {
            const node = path.node;
            const id = node.id;
            const superClass = node.superClass;
            const body = node.body;
            // const classBody = types.classBody(body.body);
            // const classDeclaration = types.classDeclaration(id, superClass, classBody,[]);
            // const classExpression = types.classExpression(id, superClass, classBody,[]);
            // console.log(classExpression)
            let func;
            body.body.forEach(body => {
                if (body.kind === 'constructor') {
                    // console.log(body)
                    // const statement = types.returnStatement(body.body);
                    // console.log(statement)
                    const block = types.BlockStatement([body.body]);
                    // console.log(block)
                    func = types.functionExpression(id, body.params, block, false, false);
                }
            });
            path.replaceWith(func);
        }
    }
};
const result = babel.transform(code, {
    plugins: [{visitor}]
});
console.log(result.code);
// let babel = require('babel-core');
// let types = require('babel-types');
// const code = `const sum = (a,b)=>a+b`;
// // babel-eslint
//
// const visitor = {
//     ArrowFunctionExpression:{
//         enter(path) {
//             let node = path.node;
//             let expression = node.body;
//             let params = node.params;
//             let returnStatement = types.returnStatement(expression);
//             let block = types.blockStatement([
//                 returnStatement
//             ]);
//             let func = types.functionExpression(null,params, block,false, false);
//             path.replaceWith(func);
//         }
//     }
// }
// const result = babel.transform(code,{
//     plugins:[
//         {visitor}
//     ]
// });
// console.log(result.code);