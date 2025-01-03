import React, { useState, useEffect } from 'react';
import TicketScroller from './ticketScroller';
import './index.css';

/**
 * Represents the page to display the available tickets for an event.
 */
const TicketsPage = () => {
  const [valueTix, setValueTix] = useState([]);
  const [cheapestTix, setCheapestTix] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('value_tix.json').then(response => response.json()),
      fetch('cheapest_tix.json').then(response => response.json()),
    ])
      .then(([valueTixData, cheapestTixData]) => {
        setValueTix(valueTixData);
        setCheapestTix(cheapestTixData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className='event-info-container'>
        <div className='event-info datetime'>
          <span>Mon 10/28 7:30 PM</span>
        </div>
        <div className='event-info matchup'>
          <span>Milwaukee Bucks @ Boston Celtics</span>
        </div>
        <div className='event-info ticket-quantity'>
          <span>Quantity: 2</span>
        </div>
      </div>
      <div className='ticket-scrollers-container'>
        <TicketScroller title='Best Value' tickets={valueTix} loading={loading} />
        <TicketScroller title='Cheapest' tickets={cheapestTix} loading={loading} />
      </div>
    </>
  );
};

export default TicketsPage;
