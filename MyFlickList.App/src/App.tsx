import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './Layout';
import LocalStorageProvider from './shared/LocalStorageProvider';
import './tailwind.output.css';

export default function App() {
  return (
    <Router>
      <LocalStorageProvider>
        <Layout />
      </LocalStorageProvider>
    </Router>
  );
}
