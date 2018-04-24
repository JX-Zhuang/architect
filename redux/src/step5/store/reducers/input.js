import actions from '../actions';


export default function reducer(state = {text: 'Hello World!'},action) {
    switch (action.type) {
        case actions.changeText().type:
            return {
                text: action.text
            };
        default:
            return state;
    }
}