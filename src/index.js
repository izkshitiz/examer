import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  //<React.StrictMode> https://github.com/ant-design/ant-design/issues/22493  Ant design gives warning when used with strict mode. uncomment if not using antd, issue has been resolved or warning in console is no bother to you. 
    <App />
  //</React.StrictMode>,
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
