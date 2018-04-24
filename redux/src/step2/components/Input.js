import React from 'react';
import store from '../store';
import * as types from '../store/action-types';
export default class Counter extends React.Component{
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>this.setState({}));
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        return (
            <div>
                <input type="text" onChange={(e)=>store.dispatch({type:types.CHANGE_TEXT,text:e.target.value})}/>
                {store.getState().input.text}
            </div>
        )
    }
}

//click -> dispatch -action->