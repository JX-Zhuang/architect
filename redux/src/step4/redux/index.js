/**
 * Redux 三大原则：
 * 1、单一数据源，只有一个store
 * 2、State是只读的，唯一改变state的是触发action
 * 3、使用纯函数修改
 */

/**
 * combineReducers 合并多个reducer
 */

export createStore from "./createStore";
export combineReducers from './combineReducers';
export bindActionCreators from './bindActionCreators';