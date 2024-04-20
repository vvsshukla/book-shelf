import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store.store}>
          <PersistGate loading={null} persistor={store.persistor}>
            <App/>
          </PersistGate>    
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
