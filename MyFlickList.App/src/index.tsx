import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import LocalStorageProvider from './shared/LocalStorageProvider';

ReactDOM.render(
  <React.StrictMode>
    <LocalStorageProvider>
      <Router>
        <App />
      </Router>
    </LocalStorageProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
