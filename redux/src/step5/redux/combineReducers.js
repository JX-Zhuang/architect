export default function combineReducers(reducers) {
    return function (state = {},action) {
        let newState = {};
        for(const key in reducers){
            newState[key] = reducers[key](state[key],action);
        }
        return newState;
    }
};