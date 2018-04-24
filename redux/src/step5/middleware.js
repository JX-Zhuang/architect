let logger = function ({dispatch, getState}) {
    return function (next) {
        return function (action) {
            console.log('old', getState());
            next(action);//需要action
            console.log('new', getState());
        }
    }
};
let thunk = ({dispatch,getState})=>next=>action=>{
    console.log(1)
    if(typeof action == 'function'){
        action(dispatch,getState);
    }else{
        next(action);
    }
    console.log(2)
}

export {
    logger,
    thunk
}