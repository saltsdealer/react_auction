import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import axios from 'axios';

const container = document.getElementById(App);
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

axios.defaults.withCredentials = true;