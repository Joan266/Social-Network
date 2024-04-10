import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

import App from './App.js';
import { AuthContextProvider } from './context/AuthContext.js';
import { WindowContextProvider } from './context/WindowContext.js';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

const app = ReactDOM.createRoot(document.getElementById('react-root'));
app.render(
  <WindowContextProvider>
    <AuthContextProvider>
      <QueryClientProvider client ={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthContextProvider>
  </WindowContextProvider>
);
