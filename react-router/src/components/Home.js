import React,{Component} from 'react';
export default class Home extends Component{
    constructor(props){
        super(props);
        console.log(props)
    }
    render(){
        return (
            <div>Home</div>
        )
    }
};
// var a = {
//     history: {},
//     location: {
//         hash: "",
//         pathname: "/home",
//         search:"",
//     },
//     match:{
//         isExact:true,
//         params:{},
//         path:"/home",
//         url:"/home"
//     }
// };