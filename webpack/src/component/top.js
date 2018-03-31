import React from 'react';
import ReactDOM from 'react-dom';
import ajax from 'libs/ajax';
class Top extends React.Component{
    render(){
        return <p>I am top {ajax}</p>
    }
}
export default Top;