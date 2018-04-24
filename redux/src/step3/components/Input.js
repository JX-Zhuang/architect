import React from 'react';
import store from '../store';
import actions from '../store/actions';
import {bindActionCreators} from '../redux';
const dispatch = store.dispatch;
export default class Counter extends React.Component{
    action = bindActionCreators(actions,dispatch)
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>this.setState({}));
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        return (
            <div>
                <input type="text" onChange={(e)=>this.action.changeText(e.target.value)}/>
                {store.getState().input.text}
            </div>
        )
    }
}

//click -> dispatch -action->