export default function bindActionCreators(actions,dispatch) {
    let boundActionCreators = {};
    for (const attr in actions){
        boundActionCreators[attr] = function () {
            const action = actions[attr](...arguments);
            dispatch(action);
        }
    }
    return boundActionCreators;
}