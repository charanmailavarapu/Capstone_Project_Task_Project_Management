import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './redux/store';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </Provider>
);
