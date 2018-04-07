import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {createBrowserHistory as createHistory} from './libs/history';
import Router from './Router';
export default class BrowserRouter extends Component{
    static propTypes = {
        children:PropTypes.node
    }
    history = createHistory()
    render(){
        return <Router history={this.history} children={this.props.children}/>;
    }
}