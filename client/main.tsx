import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container && !container.hasChildNodes()) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else if (container && container.hasChildNodes()) {
  // During HMR, React will handle the update automatically
  // This prevents the "already passed to createRoot" error
}
