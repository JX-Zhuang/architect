import React, {Component} from 'react';
import {Route, Link,Switch} from '../react-router-dom';


class UserAdd extends Component {
    onClickHandle = () => {
        const username = this.input.value;
        let user = {
            id: Date.now(), username
        };
        let usersStr = localStorage.getItem('users');
        let users = usersStr ? JSON.parse(usersStr) : [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    render() {
        return (
            <div>
                <input ref={e => this.input = e} type="text"/>
                <button onClick={this.onClickHandle}>add</button>
            </div>
        )
    }
}

class UserList extends Component {
    constructor(props) {
        super(props);
        this.users = JSON.parse(localStorage.getItem('users'));
    }

    render() {
        return (
            <div>
                <ul>
                    {this.users.map((user, index) =>
                        <li key={index}>
                            <Link to={"/user/detail/"+user.id}>
                                {user.username}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

class UserDetail extends Component {
    constructor(props){
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div>
                UserDetail
                {this.props.match.params.id}
            </div>
        )
    }
}

class User extends Component {
    constructor(props){
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-2">
                    <ul className="nav nav-pills nav-stacked">
                        <li className="list-group-item">
                            <Link to='/user/list'>用户列表</Link>
                        </li>
                        <li className="list-group-item">
                            <Link to='/user/add'>增加用户</Link>
                        </li>
                    </ul>
                </div>
                <div className="col-md-10">
                    {/*<Switch>*/}
                        <Route path="/user/add" component={UserAdd}/>
                        <Route path="/user/list" component={UserList}/>
                        <Route path="/user/detail/:id" component={UserDetail}/>
                    {/*</Switch>*/}
                </div>
            </div>
        )
    }
}

User.UserAdd = UserAdd;
User.UserList = UserList;
User.UserDetail = UserDetail;

export default User;