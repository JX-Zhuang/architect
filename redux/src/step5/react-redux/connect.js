import React from 'react';
import propTypes from 'prop-types';
import {bindActionCreators} from '../redux';


export default function (mapStateToProps,mapDispatchToProps) {
    return function (Component) {
        return class ProxyComponent extends React.Component{
            static contextTypes = {
                store:propTypes.object
            }
            constructor(props,context){
                super(props,context);
                this.store = context.store;
                this.state = mapStateToProps(this.store.getState());
            }
            componentDidMount(){
                const store = this.store;
                this.unsubscribe = store.subscribe(()=>this.setState(mapStateToProps(store.getState())));
            }
            componentWillUnmount(){
                this.unsubscribe();
            }
            render(){
                const actions  = bindActionCreators(mapDispatchToProps,this.store.dispatch);
                return <Component
                    {...actions}
                    {...this.state}
                />
            }
        }
    }
}
