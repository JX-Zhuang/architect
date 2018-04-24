export default function combineReducers(reducers) {
    return function (state = {},action) {
        const newState = {};
        for(const key in reducers){
            const reducer = reducers[key];
            newState[key] = reducer(state[key],action);
        }
        return newState;
    }
}