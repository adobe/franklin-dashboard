import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< Updated upstream:src/index.jsx
import {lightTheme, Provider} from '@adobe/react-spectrum';
=======
import { BrowserRouter } from 'react-router-dom';
>>>>>>> Stashed changes:src/index.js
import './index.css';
import App from './App';

const rootEl = document.getElementsByTagName('main')[0] || document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
 );
