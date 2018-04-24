import {INCREMENT,DECREMENT } from '../action-types';
export default function (state = {number:0},action) {
    let newState = {...state};
    switch (action.type){
        case INCREMENT:
            newState.number++;
            break;
        case DECREMENT:
            newState.number--;
            break;
        default:
            break;
    }
    return newState;
}