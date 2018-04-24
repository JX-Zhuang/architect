import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import Number from './components/Number';
import Input from './components/Input';
import {Provider} from './react-redux';
import store from './store';
ReactDOM.render(
    <Provider store={store}>
        <Counter/>
        <Number/>
        <Input />
    </Provider>, document.getElementById('root'));
