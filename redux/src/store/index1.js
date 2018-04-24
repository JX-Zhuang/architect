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
//middleware应用的中间件，createStore创建仓库 reducer
let applyMiddleware = function (middleware) {
    return function (createStore) {
        return function (reducer) {
            let store = createStore(reducer);
            let dispatch ;
            let middlewareAPI = {
                getState:store.getState,
                dispatch:action=>dispatch(action)
            };
            middleware = middleware(middlewareAPI);
            dispatch = middleware(store.dispatch);
            return {...store,dispatch};
        }
    }
};
const store = applyMiddleware(logger)(createStore)(reducer);
window.store = store;
export default store;