import React from 'react';
import ReactDOM from 'react-dom';
import Rout from './Rout';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css'
import 'moment/locale/th'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import Reducer from './Reducers'
import logger from 'redux-logger'

const store = createStore(Reducer, applyMiddleware(logger))

const Apps = () => (
    <BrowserRouter>
        <Provider store={store}>
            <Rout />
        </Provider>
    </BrowserRouter>
)


ReactDOM.render(
    <Apps />,
    document.getElementById('root'));
serviceWorker.unregister();
