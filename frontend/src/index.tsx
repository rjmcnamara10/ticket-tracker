import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import TicketTrack from './components/tickettrack';
import './index.css';

const rootElement = document.getElementById('root');

const App = () => {
  const serverURL = import.meta.env.VITE_SERVER_URL;

  if (serverURL === undefined) {
    throw new Error("Environment variable 'VITE_SERVER_URL' must be defined");
  }

  return (
    <React.StrictMode>
      <Router>
        <HelmetProvider>
          <TicketTrack />
        </HelmetProvider>
      </Router>
    </React.StrictMode>
  );
};

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}
