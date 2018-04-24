import React,{Component} from 'react';
import actions from '../store/actions/counter';
import {connect} from '../react-redux';
//import store from '../store';
// import {bindActionCreators} from '../redux';
// let newActions = bindActionCreators(actions,store.dispatch);
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
                {this.props.number}
                <button onClick={this.handleClick}>+</button>
                <button onClick={this.props.decrement}>-</button>
                <button>异步 +</button>
            </div>
        )
    }
}
//connect(mapStateToProps, mapDispatchToProps)(Counter)
//mapStateToProps:从外部state对象到props对象的映射关系
//mapDispatchToProps:
//1.函数
//2.对象
export default connect(state=>state.counter,actions)(Counter);
