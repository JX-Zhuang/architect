import React, {Component} from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';

export default class Route extends Component {
    static contextTypes = {
        location: PropTypes.object,
        history: PropTypes.object,
        match:PropTypes.object
    }
    static propTypes = {
        component: PropTypes.func,
        render: PropTypes.func,
        children: PropTypes.func,
        path: PropTypes.string,
        exact: PropTypes.bool
    }
    static childContextTypes = {
        history:PropTypes.object
    }
    getChildContext(){
        return {
            history:this.context.history
        }
    }
    computeMatched() {
        const {path, exact = false} = this.props;
        if(!path) return this.context.match;
        const {location: {pathname}} = this.context;
        const keys = [];
        const reg = pathToRegexp(path, keys, {end: exact});
        const result = pathname.match(reg);
        if (result) {
            return {
                path: path,
                url: result[0],
                params: keys.reduce((memo, key, index) => {
                    memo[key.name] = result[index + 1];
                    return memo
                }, {})
            };
        }
        return false;
    }

    render() {
        let props = {
            location: this.context.location,
            history: this.context.history
        };
        const { component: Component, render,children} = this.props;
        const match = this.computeMatched();
        if(match){
            props.match = match;
            if (Component) return <Component {...props} />;
            if (render) return render(props);
        }
        if(children) return children(props);
        return null;
    }
}