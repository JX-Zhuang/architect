import React from 'react';
import actions from '../store/actions';
import {connect} from '../react-redux';

class Counter extends React.Component{
    render(){
        return (
            <div>
                <button onClick={()=>this.props.increment()}>+</button>
                <button onClick={()=>this.props.decrement()}>-</button>
            </div>
        )
    }
}
export default connect(state=>state.counter,actions)(Counter)
//click -> dispatch -action->