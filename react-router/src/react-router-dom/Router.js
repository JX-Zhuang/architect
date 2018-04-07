import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class HashRouter extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        children: PropTypes.node
    }
    static childContextTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
        match:PropTypes.object
    }

    getChildContext() {
        return {
            history: this.props.history,
            location: this.props.history.location,
            match:{
                path: '/',
                url: '/',
                params: {}
            }
        }
    }

    componentDidMount() {
        this.props.history.listen(() => {
            this.setState({})
        });
    }

    render() {
        return this.props.children;
    }
}
// props = {
//     history:{
//         action:'',
//         block:'',   //fun
//         createHref:'',//fun
//         go:'',//fun
//         goBack:'',//fun
//         goForward:'',//fun
//         length:'',
//         listen:'',//fun
//         location:'',//同外面的location
//         push:'',//fun
//         replace:''//fun
//     },
//     location:{
//         hash:'',
//         key:"um5ide",//暂时不用
//         pathname: "",//Route的path
//         search: "查询字符串",//window.location.search
//         state:undefined
//     },
//     match:{
//         isExtract:'是否精确匹配',
//         params:{
//             //路径参数
//         },
//         path:'Route的path',
//         url:'访问的url'
//
//     },
//     staticContext
// }

// http://localhost:8080/#/topics/rendering
// var s = {
//     //history.location === location
//     "match": {
//         "path": "/topics/:topicId",
//         "url": "/topics/rendering",
//         "isExact": true,
//         "params": {"topicId": "rendering"}
//     },
//     "location":
//         {"pathname": "/topics/rendering", "search": "", "hash": ""},
//     "history":
//         {"length": 50, "action": "PUSH",
//             "location":
//                 {"pathname": "/topics/rendering", "search": "", "hash": ""}
//         }
// };


//http://localhost:8080/topics/rendering
// var s = {
//     "match": {
//         "path": "/topics/:topicId",
//         "url": "/topics/rendering",
//         "isExact": true,
//         "params": {"topicId": "rendering"}
//     },
//     "location":
//         {"pathname": "/topics/rendering", "search": "", "hash": "", "key": "z26dc7"},
//     "history": {
//         "length": 50,
//         "action": "PUSH",
//         "location":
//             {"pathname": "/topics/rendering", "search": "", "hash": "", "key": "z26dc7"}
//     }
// }
