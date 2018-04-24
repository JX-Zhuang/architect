import actions from '../actions';

export default function reducer(state = {number: 0},action) {
    switch (action.type) {
        case actions.increment().type:
            return {
                number: state.number + 1
            };
        case actions.decrement().type:
            return {
                number: state.number - 1
            };
        default:
            return state;
    }
}