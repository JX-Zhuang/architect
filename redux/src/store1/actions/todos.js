import * as types from '../action-types';
export default {
    addTodo(text){
        return {type:types.ADD_TODO,item:text}
    }
}