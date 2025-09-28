import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './App.jsx';
import { UserProvider } from './context/User.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
