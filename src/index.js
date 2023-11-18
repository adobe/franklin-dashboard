import React from 'react';
import ReactDOM from 'react-dom/client';
import {Button, lightTheme, Provider} from '@adobe/react-spectrum';
import './index.css';
import App from './App';

const rootEl = document.getElementsByTagName('main')[0] || document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <Provider theme={lightTheme}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
const data = {};
data.source = new URL(location.href).hostname;
