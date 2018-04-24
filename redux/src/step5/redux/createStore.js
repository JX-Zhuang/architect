export default function createStore(reducer) {
    let state;
    let listeners = [];
    function getState() {
        return state;
    }
    function dispatch(action) {
        state =  reducer(state,action);
        listeners.forEach(listener=>listener());
    }
    dispatch({});
    function subscribe(listener) {
        listeners.push(listener);
        return function () {
            const index = listeners.indexOf(listener);
            listeners.splice(index,1);
        }
    }
    return {
        getState,dispatch,subscribe
    }
}