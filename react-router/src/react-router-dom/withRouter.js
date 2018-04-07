import React from 'react';
import Route from './Route';

const withRouter = Component => {
    const C = ()=>{
        return (
            <Route children={props=>{
                return (
                    <Component {...props} />
                )
            }}/>
        )
    };
    return C;
};
export default withRouter
