import counter from './counter';
import todos from './todos';
function combineReducers(reducers) {
    return function (state = {},action) {
        let newState = {};
        for(const k in reducers){
            const reducer = reducers[k];
            newState[k] = reducer(state[k],action);
        }
        return newState;
    }
}

export default combineReducers({counter,todos});