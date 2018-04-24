import React from 'react';
import actions from '../store/actions';
import {connect} from '../react-redux';

class Counter extends React.Component{
    handle=()=>{
        this.props.increment();
    }
    render(){
        return (
            <div>
                <button onClick={this.handle}>+</button>
                <button onClick={this.props.decrement}>-</button>
                <button onClick={this.props.thunkIncrement}>异步+</button>
            </div>
        )
    }
}
export default connect(state=>state.counter,actions)(Counter)
//click -> dispatch -action->