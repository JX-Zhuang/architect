import React from 'react';
import store from '../store';
import * as types from '../store/action-types';
export default class Counter extends React.Component{
    render(){
        return (
            <div>
                <button onClick={()=>store.dispatch({type:types.INCREMENT})}>+</button>
                <button onClick={()=>store.dispatch({type:types.DECREMENT})}>-</button>
            </div>
        )
    }
}

//click -> dispatch -action->