import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import TicketTrack from './components/TicketTrack';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <TicketTrack />
      </HelmetProvider>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
