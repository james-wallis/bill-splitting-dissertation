import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import io from 'socket.io-client';
const socket = io('http://localhost:3001/a4cd28eb-faa8-4429-9c89-78cf07a078b3');
socket.on('connect', function () { 
  console.log('connection');
});
socket.on('event', function (data) { });
socket.on('disconnect', function () { });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
