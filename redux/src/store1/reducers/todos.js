import {COMPLETE,DELETE,ADD_TODO } from '../action-types';
export default function (state = {todos:[],newType:'all'},action) {
    let newState = {...state};
    switch (action.type){
        case ADD_TODO:
            newState.todos.push({
                state:ADD_TODO,
                item:action.item
            });
            break;
        case COMPLETE:
            newState.todos.find((item,index)=>index === action.index).state = COMPLETE;
            break;
        case DELETE:
            newState.todos.splice(action.index,1);
            break;
        default:
            break;
    }
    return newState;
}