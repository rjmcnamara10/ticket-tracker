import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './header';
import SidePanel from './main/sidePanel';
import TicketsPage from './main/TicketsPage';
import './TicketTrack.css';

const TicketTrack = () => (
  <>
    <div className='App'>
      <Helmet>
        <title>Ticket Track</title>
        <link rel='manifest' href='/manifest.json' />
      </Helmet>
      <Header />
      <div className='main-layout'>
        <SidePanel />
        <div className='main-content'>
          <TicketsPage />
        </div>
      </div>
    </div>
  </>
);

export default TicketTrack;
