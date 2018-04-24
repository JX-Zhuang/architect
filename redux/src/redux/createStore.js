function createStore(reducer, preloadedState,enhancer) {
    if(enhancer&&typeof enhancer === 'function'){
        return enhancer(createStore)(reducer,preloadedState);
    }
    let state = preloadedState;
    let listeners = [];
    function getState() {
        return JSON.parse(JSON.stringify(state))
    }
    function dispatch(action) {
        state = reducer(state,action);
        listeners.forEach(listener=>listener());
    }
    function subscribe(listener) {
        //订阅事件
        listeners.push(listener);
        //取消订阅
        return function () {
            listeners = listeners.filter(item=>item!==listener);
        }
    }
    dispatch({});
    return {
        getState,dispatch,subscribe
    }
}
export default createStore;