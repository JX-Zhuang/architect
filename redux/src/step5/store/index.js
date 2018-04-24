import {createStore, applyMiddleware} from '../redux';
import reducers from './reducers';
import {logger, thunk} from "../middleware";

const store = applyMiddleware(thunk, logger)(createStore)(reducers);
// thunk->logger
export default store;