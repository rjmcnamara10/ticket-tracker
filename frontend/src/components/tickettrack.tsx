import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './header';
import SidePanel from './main/sidePanel';
import GamePage from './main/gamePage';
import TicketsPage from './main/ticketsPage';
import './index.css';

/**
 * Represents the main component for the application.
 */
const TicketTrack = () => (
  <div className='app-container'>
    <Helmet>
      <title>Ticket Track</title>
      <link rel='manifest' href='/manifest.json' />
    </Helmet>
    <Header />
    <div className='main-layout'>
      <SidePanel />
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<GamePage />} />
          <Route path='/tickets' element={<TicketsPage />} />
        </Routes>
      </div>
    </div>
  </div>
);

export default TicketTrack;
