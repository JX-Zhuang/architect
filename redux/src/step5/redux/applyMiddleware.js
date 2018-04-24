import compose from './compose';

export default function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducers) {
            const store = createStore(reducers);
            let dispatch = store.dispatch;
            let middlewareApi = {
                dispatch:action=>dispatch(action),
                getState:store.getState
            };
            middlewares = middlewares.map(middleware=>middleware(middlewareApi));
            dispatch = compose(...middlewares)(dispatch);
            return {
                ...store,
                dispatch
            };
        };
    }
}