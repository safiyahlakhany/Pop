import React from 'react';
import './scss/index.css';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import popReducer from './redux-data/reducer';
import { initializeIcons } from '@uifabric/icons';

// importing firebase stuff
import firebase from 'firebase/app';
import firebaseConfig from './config';
// initializes the app with firebase configs 
firebase.initializeApp(firebaseConfig);
initializeIcons();


const store = createStore(popReducer);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
