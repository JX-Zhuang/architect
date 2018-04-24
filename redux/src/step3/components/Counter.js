import React from 'react';
import store from '../store';
import actions from '../store/actions';
import {bindActionCreators} from '../redux';
const dispatch = store.dispatch;
export default class Counter extends React.Component{
    action = bindActionCreators(actions,dispatch)
    render(){
        return (
            <div>
                <button onClick={this.action.increment}>+</button>
                <button onClick={this.action.decrement}>-</button>
            </div>
        )
    }
}

//click -> dispatch -action->