import React,{Component} from 'react';
import {bindActionCreators} from '../redux';
import propsTypes from 'prop-types';

// let newActions = bindActionCreators(actions,store.dispatch);

export default function (mapStateToProps,mapDispatchToProps) {
    return function (WrapedComponent) {
        class ProxyComponent extends Component{
            static contextTypes = {
                store:propsTypes.object
            }
            constructor(props,context){
                super(props,context);
                this.store = context.store;
                this.state = mapStateToProps(this.store.getState());
            }
            componentDidMount(){
                this.unsubscribe = this.store.subscribe(()=>this.setState(mapStateToProps(this.store.getState())));
            }
            componentWillUnmount(){
                this.unsubscribe();
            }
            render(){
                let actions ;
                if(typeof mapDispatchToProps === 'object'){
                    actions = bindActionCreators(mapDispatchToProps,this.store.dispatch);
                }
                return <WrapedComponent {...this.state} {...actions}/>
            }
        }
        return ProxyComponent;
    }
}