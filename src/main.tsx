import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, } from "react-router-dom";
import { SocketProvider } from './context/SocketProvider.tsx';
import './global.css';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Toaster />
        <App />
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
)
