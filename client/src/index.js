import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App.js';

import { AuthContextProvider } from './context/AuthContext.js';

const app = ReactDOM.createRoot(document.getElementById('react-root'));
app.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
