import * as types from './action-types';

export default {
    increment() {
        console.log(222)
        return {
            type: types.INCREMENT
        }
    },
    decrement() {
        return {
            type: types.DECREMENT
        }
    },
    thunkIncrement() {
        return function (dispatch, getState) {
            console.log(222);
            setTimeout(function () {
                dispatch({
                    type: types.PROMISEINCREMENT
                });
                console.log(222345);
            },1000);
        }
    },
    changeText(value) {
        return {
            type: types.CHANGE_TEXT,
            text: value
        }
    }
}