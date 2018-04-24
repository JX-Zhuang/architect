import * as types from '../action-types';

export default function reducer(state = {text: 'Hello World!'},action) {
    switch (action.type) {
        case types.CHANGE_TEXT:
            return {
                text: action.text
            };
        default:
            return state;
    }
}