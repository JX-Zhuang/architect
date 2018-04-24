import {createStore, applyMiddleware} from '../redux';
import reducer from './reducer';

let logger = function ({dispatch, getState}) {
    return function (next) {
        return function (action) {
            console.log('old2', getState());
            next(action);
            console.log('new2', getState());
        }
    }
};
let thunk = ({dispatch, getState}) => next => action => {
    if(typeof action === 'function'){
        action(dispatch,getState);
    }else {
        next(action);
    }
};

let promise = ({dispatch, getState}) => next => action => {
    if(action.then){
        action.then(dispatch);
    }else if(action.payload&&action.payload.then){
        action.payload.
        then(payload=>dispatch({...action,payload}),
                payload=>dispatch({...action,payload}));
    }else {
        next(action);
    }
};
let store = createStore(reducer,{number:0},applyMiddleware(promise,thunk,logger))
// const store = applyMiddleware(promise,thunk,logger)(createStore)(reducer);
window.store = store;
export default store;