import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Optional, if you have custom styles
import App from './App';  // Assuming you have an App component
import { BrowserRouter as Router } from 'react-router-dom';

// This will render your main App component into the HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);
