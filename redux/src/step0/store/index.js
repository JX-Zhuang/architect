import reducer from './reducer';

const store = {
    listeners:[],
    getState(){
        return this.state;
    },
    dispatch(action){
        this.state = reducer(this.state,action);
        this.listeners.forEach(listener=>listener());
    },
    subscribe(listener){
        this.listeners.push(listener);
        return function () {
            this.listeners = listeners.filter(item=>item!==listener);
        }
    }
};
store.dispatch({});
export default store;