import * as types from '../action-types';

export default function reducer(state = {number: 0}, action) {
    switch (action.type) {
        case types.INCREMENT:
            console.log(1)
            return {
                number: state.number + 1
            };
        case types.DECREMENT:
            return {
                number: state.number - 1
            };
        case types.PROMISEINCREMENT:
            console.log('999')
            return {
                number: state.number + 1
            }
        default:
            return state;
    }
}