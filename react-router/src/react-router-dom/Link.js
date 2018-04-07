import React,{Component} from 'react';
import PropTypes from 'prop-types';

export default class Link extends Component{
    static propsTypes = {
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
    }
    static contextTypes = {
        history:PropTypes.object
    }
    onClickHandle=(e)=>{
        e.preventDefault();
        this.context.history.push(this.href);
    }
    render(){
        const {to} = this.props;
        // this.href = typeof to==='string'?to:to.pathname;
        this.href = this.context.history.createHref(to);
        return (
            <a onClick={this.onClickHandle} href={this.href}>{this.props.children}</a>
        );
    }
}