import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import App from './App.js'; // Assuming App is in the same directory
import axios from 'axios';
// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app on the root.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

axios.defaults.withCredentials = true;
