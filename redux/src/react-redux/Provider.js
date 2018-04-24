//通过上下文向底层传递store
import React,{Component} from 'react';
import propsTypes from 'prop-types';
export default class Provider extends Component{
    static childContextTypes = {
        store:propsTypes.object.isRequired
    }
    getChildContext(){
        return {
            store:this.props.store
        }
    }
    render(){
        return this.props.children;
    }
}