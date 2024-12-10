import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import TicketTrack from './components/tickettrack';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Router>
        <HelmetProvider>
          <TicketTrack />
        </HelmetProvider>
      </Router>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
