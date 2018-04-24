import React from 'react';
import {connect} from '../react-redux';
import actions from '../store/actions';
class Counter extends React.Component{
    render(){
        return (
            <div>
                <input type="text" onChange={(e)=>this.props.changeText(e.target.value)}/>
                {this.props.text}
            </div>
        )
    }
}
export default connect(state=>state.input,actions)(Counter)
//click -> dispatch -action->