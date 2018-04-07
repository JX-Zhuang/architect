# react-router了解一下
> 清明时节雨纷纷，不如在家撸代码。从零开始实现一个react-router，并跑通react-router-dom里的[example](https://reacttraining.com/react-router/web/example/basic)。

react-router是做SPA(不是你想的SPA)时，控制不同的url渲染不同的组件的js库。用react-router可以方便开发，不需要手动维护url和组件的对应关系。开发时用react-router-dom，react-router-dom里面的组件是对react-router组件的封装。
### SPA的原理
单页应用的原理用两种，一种是通过hash的变化，改变页面，另一种是通过url的变化改变页面。
* hash 
    * window.location.hash='xxx' 改变hash
    * window.addEventListener('hashchange',fun) 监听hash的改变
* url
    * history.pushState(obj,title,'/url') 改变url
    * window.addEventListener('popstate',fun) 当浏览器向前向后时，触发该事件。

### React-Router-dom的核心组件
* Router
    * Router是一个外层，最后render的是它的子组件，不渲染具体业务组件。
    * 分为HashRouter(通过改变hash)、BrowserRouter(通过改变url)、MemoryRouter
    * Router负责选取哪种方式作为单页应用的方案hash或browser或其他的，把HashRouter换成BrowserRouter，代码可以继续运行。
    * Router的props中有一个history的对象，history是对window.history的封装，history的负责管理与浏览器历史记录的交互和哪种方式的单页应用。history会作为childContext里的一个属性传下去。
* Route
    * 负责渲染具体的业务组件，负责匹配url和对应的组件
    * 有三种渲染的组件的方式：component(对应的组件)、render(是一个函数，函数里渲染组件)、children(无论哪种路由都会渲染)
* Switch
    * 匹配到一个Route子组件就返回不再继续匹配其他组件。
* Link
    * 跳转路由时的组件，调用history.push把改变url。

### history
* history是管理与浏览器历史记录的交互，和用哪种方式实现单页应用。这里实现了一个简单的history
* MyHistory是父类，HashHistory、BrowserHistory是两个子类。
* HashHistory和BrowserHistory实例的loaction属性是相同的，所以updateLocation是子类方法。location的pathname在HashHistory是hash的#后面的值，在BrowserHistory是window.location.pathname。
* 两个子类里有一个_push方法，用来改变url，都是用的[history.pushState](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)方法。
```
let confirm;
export default class MyHistory {
    constructor() {
        this.updateLocation();//改变实例上的location变量，子类实现
    }
    go() {
    //跳到第几页
    }
    goBack() {
    //返回
    }
    goForward() {
    //向前跳
    }
    push() {
    //触发url改变
        if (this.prompt(...arguments)) {
            this._push(...arguments);//由子类实现
            this.updateLocation();  
            this._listen();
            confirm = null;     //页面跳转后把confirm清空
        }
    }
    listen(fun) {
    //url改变后监听函数
        this._listen = fun;
    }
    createHref(path) {
    // Link组件里的a标签的href
        if (typeof path === 'string') return path;
        return path.pathname;
    }
    block(message) {
    //window.confirm的内容可能是传入的字符串，可能是传入的函数返回的字符串
        confirm = message;
    }
    prompt(pathname) {
    //实现window.confirm，确定后跳转，否则不跳转
        if (!confirm) return true;
        const location = Object.assign(this.location,{pathname});
        const result = typeof confirm === 'function' ? confirm(location) : confirm;
        return window.confirm(result);
    }
}
```

```
import MyHistory from './MyHistory';
class HashHistory extends MyHistory {
    _push(hash) {
    //改变hash
        history.pushState({},'','/#'+hash);
    }
    updateLocation() {
    //获取location
        this.location = {
            pathname: window.location.hash.slice(1) || '/',
            search: window.location.search
        }
    }
}
export default function createHashHistory() {
//创建HashHistory
    const history = new HashHistory();
    //监听前进后退事件
    window.addEventListener('popstate', () => {
        history.updateLocation();
        history._listen();
    });
    return history;
};
```
```
import MyHistory from './MyHistory';
class BrowserHistory extends MyHistory{
    _push(path){
    //改变url
        history.pushState({},'',path);
    }
    updateLocation(){
        this.location = {
            pathname:window.location.pathname,
            search:window.location.search
        };
    }
}
export default function createHashHistory(){
//创建BrowserHistory
    const history = new BrowserHistory();
    window.addEventListener('popstate',()=>{
        history.updateLocation();
        history._listen();
    });
    return history;
};
```
### Router
* HashRouter和BrowserRouter是对Router的封装，传入Router的history对象不同
* Router中要创建childContext，history是props的history，location是history里的location，match是Route组件里匹配url后的结果
* history的listen传入函数，url改变后重新渲染
```
import PropTypes from 'prop-types';//类型检查
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
```
```
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {createHashHistory as createHistory} from './libs/history';
import Router from './Router';
export default class HashRouter extends Component{
    static propTypes = {
        children:PropTypes.node
    }
    history = createHistory()
    render(){
        return <Router history={this.history} children={this.props.children}/>;
    }
}
```
```
import {createBrowserHistory as createHistory} from './libs/history';
export default class BrowserRouter extends Component{
    static propTypes = {
        children:PropTypes.node
    }
    history = createHistory()
    render(){
        return <Router history={this.history} children={this.props.children}/>;
    }
}
```
### Route
* Route通过props里的path和url进行匹配，匹配到了，渲染组件，继续匹配下一个。
* Route里用到[path-to-regexp](https://github.com/pillarjs/path-to-regexp)匹配路径，获取匹配到的params
* Route有三种渲染组件的方法，要分别处理
* Route的props有一个exact属性。如果是true，匹配时到path结束，要和location.pathname准确匹配。
* Route的Context是Router创建的location、history、match，每次匹配完成，要改变Route里的match。
```
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
```
### Switch
* Switch可以套在Route的外面，匹配到了一个Route，就不再往下匹配。
* Switch也用到了路径匹配，和Route里的方法类似，可以提取出来，在react-router-dom里的example用到Switch的地方不多，所以没有提取。
```
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
```
### Link
* Link的属性to是字符串或对象。
* Link渲染a标签，在a标签上绑定事件，进行跳转。
* Link的跳转是用history.push完成的，a的href属性是history.createHref的返回值。
```
export default class Link extends Component{
    static propsTypes = {
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
    }
    static contextTypes = {
        history:PropTypes.object
    }
    onClickHandle=(e)=>{
        e.preventDefault();
        this.context.history.push(this.href);
    }
    render(){
        const {to} = this.props;
        this.href = this.context.history.createHref(to);
        return (
            <a onClick={this.onClickHandle} href={this.href}>{this.props.children}</a>
        );
    }
}
```
### Redirect
* Redirect跳转到某个路由，不渲染组件
* 通过history.createHref获得path，history.push跳转过去
```
export default class Redirect extends Component{
    static propTypes = {
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
    }
    static contextTypes = {
        history: PropTypes.object
    }
    componentDidMount(){
        const href = this.context.history.createHref(this.props.to);
        this.context.history.push(href);
    }
    render(){
        return null;
    }
};
```
### Prompt
* 相当于window.confirm，点击确定后跳转到想要的链接，点击取消不做操作
* Prompt的属性when为true是才触发confirm
```
export default class Prompt extends Component {
    static propTypes = {
        when: PropTypes.bool,
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
    }
    static contextTypes = {
        history: PropTypes.object
    }

    componentWillMount() {
        this.prompt();
    }

    prompt() {
        const {when,message} = this.props;
        if (when){
            this.context.history.block(message);
        }else {
            this.context.history.block(null);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.prompt();
    }
    render() {
        return null;
    }
};
```
### withRouter
* withRouter实际是一个高阶组件，即一个函数返回一个组件。返回的组件外层是Route，Route的children属性里渲染接收到的组件。
```
import React from 'react';
import Route from './Route';
const withRouter = Component => {
    const C = (props)=>{
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

```
##### 总结
react-router、react-router-dom的api还有很多，像Redirect和withRouter还有的许多api。本文的组件只能跑通react-router-dom里的example。源码要复杂的多，通过学习源码，并自己实现相应的功能，可以对react及react-router有更深的理解，学到许多编程思想，数据结构很重要，像源码中Router里的ChildContext的数据解构，子组件多次用到里面的方法或属性，方便复用。
```
//ChildContext的数据解构
{
    router:{
        history,    //某种history
        route:{
            location:history.location,
            match:{} //匹配到的结果
        }
    }
}
```
##### 参考
* [react-router](https://github.com/ReactTraining/react-router)
* [history](https://developer.mozilla.org/zh-CN/Add-ons/WebExtensions/API/history)