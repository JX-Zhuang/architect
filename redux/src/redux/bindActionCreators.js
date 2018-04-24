export default function bindActionCreators(action,dispatch) {
    let newActions = {};
    for (const attr in action){
        newActions[attr] = function () {
            dispatch(action[attr].apply(null,arguments));
        };
    }
    return newActions;
}