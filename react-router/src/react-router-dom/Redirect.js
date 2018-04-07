import React,{Component} from 'react';
import PropTypes from 'prop-types';

export default class Redirect extends Component{
    static propTypes = {
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
    }
    static contextTypes = {
        history: PropTypes.object
    }
    componentDidMount(){
        const href = this.context.history.createHref(this.props.to);
        this.context.history.push(href);
    }
    render(){
        return null;
    }
};