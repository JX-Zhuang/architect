import React,{Component} from 'react';
import store from '../store';
import {connect} from '../react-redux';
import actions from '../store/actions/todos';
// import {bindActionCreators} from '../redux';
// let newActions = bindActionCreators(actions,store.dispatch);
class Todos extends Component{
    // state = {
    //     todos:store.getState().todos
    // }
    // componentDidMount(){
    //     this.unsubscribe = store.subscribe(()=>this.setState({
    //         todos:store.getState().todos
    //     }));
    // }
    // componentWillUnmount(){
    //     this.unsubscribe();
    // }
    render(){
        return (
            <div>
                <input type="text" onKeyUp={(e)=>{
                    if(e.keyCode===13){
                        this.props.addTodo(e.target.value);
                    }
                }}/>
                <ul>
                    {this.props.todos.map((todo,index)=>(
                        <li key={index}>
                            {todo.item}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
export default connect(state=>state.todos,actions)(Todos)