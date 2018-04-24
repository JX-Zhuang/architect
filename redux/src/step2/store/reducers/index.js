//多个reducer
import counter from './counter';
import input from './input';
import {combineReducers} from '../../redux';
export default combineReducers({counter,input});