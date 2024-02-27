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
import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          {/* <GoogleOAuthProvider clientId={clientId}> */}
            <App />
          {/* </GoogleOAuthProvider> */}
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
