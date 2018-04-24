import React,{Component} from 'react';
import actions from '../store/actions';
import {connect} from '../react-redux';
class Counter extends Component{
    constructor(props){
        super(props);
        this.state = {
            number:props.number
        };
    }
    handleClick=(e)=>{
        this.props.increment();
    }
    render(){
        return (
            <div>
                <p>
                    {this.props.number}
                </p>
                <button onClick={this.props.increment}>+</button>
                <button onClick={this.props.thunkIncrement}>过一秒 +</button>
                <button onClick={this.props.promiseIncrement}>promise +</button>
                <button onClick={this.props.payloadIncrement}>payloadIncrement +</button>
            </div>
        )
    }
}
export default connect(state=>state,actions)(Counter);
