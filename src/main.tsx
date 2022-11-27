import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import './setup/style.css'
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={6} dense>
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
)

