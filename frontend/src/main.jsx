import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

console.log('%c[ULTRACK] App entry point reached!', 'background: #222; color: #bada55; font-size: 20px;');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
