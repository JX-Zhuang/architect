import React from 'react';
import store from '../store';
class Number extends React.Component{
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>this.setState({}));
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        return (
            <div>
                {store.getState().counter.number}
            </div>
        )
    }
}

export default Number;