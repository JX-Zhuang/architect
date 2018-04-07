import React,{Component} from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
export default class Switch extends Component{
    static contextTypes = {
        location:PropTypes.object
    }
    constructor(props){
        super(props);
        this.path = props.path;
        this.keys = [];
    }
    match(pathname,path,exact){
        return pathToRegexp(path,[],{end:exact}).test(pathname);
    }
    render(){
        const {location:{pathname}} = this.context;
        const children = this.props.children;
        for(let i = 0,l=children.length;i<l;i++){
            const child = children[i];
            const {path,exact} = child.props;
            if(this.match(pathname,path,exact)){
                return child
            }

        }
        return null;
    }
}