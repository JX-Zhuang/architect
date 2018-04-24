# 包教包会Redux
> react里父子组件可以通过props通信，兄弟组件通信需要把数据传递给父组件，再由父组件传递给另一个子组件。以兄弟组件通信为需求，写一个redux。

### 问题
![](https://github.com/JX-Zhuang/architect/blob/master/redux/images/1.png)
这是一个计数器，点击按钮，可以让数字加一或者减一。两个按钮在Counter组件里，显示数字的在Number组件里。

### 兄弟组件通信
* 首先分析这个需求，点击button，改变数字，Number组件重新渲染。
![](https://github.com/JX-Zhuang/architect/blob/master/redux/images/2.png)
* 可抽象为，派发一个动作，改变状态，执行方法。
![](https://github.com/JX-Zhuang/architect/blob/master/redux/images/3.png)
* 根据上两步分析，可以看出组件通信的核心是动作（action）、执行方法（reducer）、状态（state）
![](https://github.com/JX-Zhuang/architect/blob/master/redux/images/4.png)
* action、reducer
```javascript
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
```
```javascript
export default function reducer(state = {number: 0},action) {
    switch (action.type) {
        case types.INCREMENT:
            return {
                number: state.number + 1
            };
        case types.DECREMENT:
            return {
                number: state.number - 1
            };
        default:
            return state;
    }
}
```
* store是个对象，负责提供getState、dispatch、subscribe三个方法。
```javascript
const store = {
    listeners:[],   
    getState(){
        return this.state;
    },
    dispatch(action){
        this.state = reducer(this.state,action);
        this.listeners.forEach(listener=>listener());
    },
    subscribe(listener){
        this.listeners.push(listener);
        return function () {
            this.listeners = listeners.filter(item=>item!==listener);
        }
    }
};
store.dispatch({}); //初始化state
export default store;
```
* Number、Counter组件
```javascript
export default class Number extends React.Component{
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>this.setState({}));
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        return (
            <div>
                {store.getState().number}
            </div>
        )
    }
}
export default class Counter extends React.Component{
    render(){
        return (
            <div>
                <button onClick={()=>store.dispatch({type:types.INCREMENT})}>+</button>
                <button onClick={()=>store.dispatch({type:types.DECREMENT})}>-</button>
            </div>
        )
    }
}
```

### redux
上面实现了兄弟组件的通信，但是复用性差，而且store里的listeners不应该被外界修改。
* createStore，这就是redux里创建store的方法。
```javascript
export default function createStore(reducer) {
    let state;
    let listeners = [];
    function getState() {
        return state;
    }
    function dispatch(action) {
        state =  reducer(state,action);
        listeners.forEach(listener=>listener());
    }
    dispatch({});
    function subscribe(listener) {
        listeners.push(listener);
        return function () {
            const index = listeners.indexOf(listener);
            listeners.splice(index,1);
        }
    }
    return {
        getState,dispatch,subscribe
    }
}
```
* 调用createStore，传入reducer，返回和上一步骤一样的store。
* redux里的三大原则：只有一个store；state是只读的，只有触发action才能改变；使用纯函数修改。我们写自己的redux时也要遵循这些原则。

### 多个reducer
* 由于store只有一个，所以对于多个reducer时，要把reducer合并。
```javascript
export default function combineReducers(reducers) {
    return function (state = {},action) {
        let newState = {};
        for(const key in reducers){
            newState[key] = reducers[key](state[key],action);
        }
        return newState;
    }
};
```
* 调用combineReducers，参数是对象，对象的key可以是reducer的名字，value是reducer，返回一个函数，把函数传给createStore，创建store。

### 简化组件里派发动作
* 我们在派发action的时候，需要
```javascript
<button onClick={()=>store.dispatch({type:types.INCREMENT})}>+</button>
```
* 这样比较麻烦，如果把action直接放在实例上，会比较方便。
```javascript
export default class Counter extends React.Component{
    action = bindActionCreators(actions,store.dispatch)
    render(){
        return (
            <div>
                <button onClick={this.action.increment}>+</button>
                <button onClick={this.action.decrement}>-</button>
            </div>
        )
    }
}
```
* 先实现actions
```javascript
export default {
    increment() {
        return {
            type: 'INCREMENT'
        }
    },
    decrement() {
        return {
            type: 'DECREMENT'
        }
    },
    changeText(value) {
        return {
            type: 'CHANGE_TEXT',
            text: value
        }
    }
}
```
* 再实现bindActionCreators
```javascript
export default function bindActionCreators(actions,dispatch) {
    let boundActionCreators = {};
    for (const attr in actions){
        boundActionCreators[attr] = function () {
            const action = actions[attr](...arguments);
            dispatch(action);
        }
    }
    return boundActionCreators;
}
```
### react-redux
* 上面代码里可以看出组件里的许多代码是重复的，可以进一步抽象组件，最后抽象成react-redux。
* react-redux里要实现一个外层组件，负责传递store和渲染子组件，功能比较简单
```javascript
export default class Provider extends Component {
    static childContextTypes = {
        store:propTypes.object
    }
    getChildContext(){
        return {
            store:this.props.store
        }
    }
    render(){
        return this.props.children
    }
}
```
* 还要实现一个高阶组件，高阶组件先返回一个函数，最后返回一个组件。高阶组件负责把store上的state和dispatch作为props传递给需要渲染的组件，还有实现生命周期函数里的公共功能。
```javascript
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
```
* 首页渲染
```javascript
ReactDOM.render(
    <Provider store={store}>
        <Counter/>
        <Number/>
    </Provider>, document.getElementById('root'));
```
* Counter、Number组件
```javascript
class Counter extends React.Component{
    render(){
        return (
            <div>
                <button onClick={()=>this.props.increment()}>+</button>
                <button onClick={()=>this.props.decrement()}>-</button>
            </div>
        )
    }
}
export default connect(state=>state.counter,actions)(Counter);
class Number extends React.Component{
    render(){
        return (
            <div>
                {this.props.number}
            </div>
        )
    }
}

export default connect(state=>state.counter,actions)(Number);
```
### redux中间件
* 最后实现redux中间件。redux中间件是洋葱模型，和koa的中间件原理一样。
![](https://github.com/JX-Zhuang/architect/blob/master/redux/images/5.png)
* 开发中会有多个中间件，中间件是函数，要把第一个中间件的结果作为参数传递给第二个中间件，依次执行，先实现这个compose函数
```javascript
function compose(...fns) {
    if (fns.length===0) return arg=>arg;
    return fns.reduce((prev, next, index) => (...args) => prev(next(...args)));
}
export default compose;
```
* 应用中间件函数applyMiddleware
```javascript
export default function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducers) {
            const store = createStore(reducers);
            let dispatch = store.dispatch;
            let middlewareApi = {
                dispatch:action=>dispatch(action),
                getState:store.getState
            };
            middlewares = middlewares.map(middleware=>middleware(middlewareApi));
            dispatch = compose(...middlewares)(dispatch);
            return {
                ...store,
                dispatch
            };
        };
    }
}
```
* 使用中间件，修改store
```javascript
const store = applyMiddleware(thunk, logger)(createStore)(reducers);
```

##### 总结
redux是管理页面状态和数据传递，从最开始组件通信的问题，一步步的实现类似一个redux的库，方便我们学习redux和理解redux原理。
#### 参考
* [redux](https://github.com/reactjs/redux)
* [react-redux](https://github.com/reactjs/react-redux)