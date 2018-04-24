import {createStore} from '../redux';
import reducer from './reducer';
import actions from "./actions";
// const store = createStore(reducer);
// let dispatch = store.dispatch;
// store.dispatch = function (action) {
//     console.log(store.getState());
//     dispatch(action);
//     console.log(store.getState());
// }

let logger1 = function ({dispatch,getState}) {
    return function (next) {
        return function (action) {
            console.log('old1',getState());
            next(action);
            console.log('new1',getState());
        }
    }
};
let logger2 = function ({dispatch,getState}) {
    return function (next) {
        return function (action) {
            console.log('old2',getState());
            next(action);
            console.log('new2',getState());
        }
    }
};
function compose(...fns) {
    if(fns.length===1)
        return fns[0];
    return fns.reduce((a,b)=>(...args)=>a(b(...args)));
}
//middleware应用的中间件，createStore创建仓库 reducer
let applyMiddleware = function (...middlewares) {
    return function (createStore) {
        return function (reducer) {
            let store = createStore(reducer);
            let dispatch ;
            let middlewareAPI = {
                getState:store.getState,
                dispatch:action=>dispatch(action)
            };
            middlewares = middlewares.map(middleware=>middleware(middlewareAPI));
            dispatch = compose(...middlewares)(store.dispatch);
            return {...store,dispatch};
        }
    }
};
const store = applyMiddleware(logger1,logger2)(createStore)(reducer);
window.store = store;
export default store;