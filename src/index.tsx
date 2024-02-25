import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  BrowserRouter
} from 'react-router-dom'
import { Provider } from "react-redux";


import './index.css';
import App from './App';
import store from "./redux/store";
import reportWebVitals from './reportWebVitals';
import ThemeProvider from './components/contextAPI/ThemeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
