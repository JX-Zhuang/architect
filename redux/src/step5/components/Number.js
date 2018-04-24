import React from 'react';
import {connect} from '../react-redux';
import actions from '../store/actions';

class Number extends React.Component{
    render(){
        return (
            <div>
                {this.props.number}
            </div>
        )
    }
}

export default connect(state=>state.counter,actions)(Number);