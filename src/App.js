import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ScrollView } from '@aws-amplify/ui-react';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch('tix_by_price.json')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error));
  }, []);

  return (
    <div className="App">
      <Helmet>
        <title>Ticket Track</title>
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      </Helmet>
      <header className="App-header">
        <img src="/logo192.png" alt="Logo" className="logo" />
        <img src="/title.png" alt="Title" className="title" />
      </header>
      <div className="App-content-container">
        <div className="Side-panel"></div>
        <div className="Main-content">
          <div className="search-info">
            <div className="search-info-containers datetime">
              <span>
                Wed 4/3 7:30 PM
              </span>
            </div>
            <div className="search-info-containers matchup">
              <span>
                Oklahoma City Thunder @ Boston Celtics
              </span>
            </div>
            <div className="search-info-containers ticket-quantity">
              <span>
                Quantity: 3
              </span>
            </div>
          </div>
          <div className="ticket-list-container">
            <div className="ticket-list-title">
              <span>
                Best Value
              </span>
            </div>
            <div className="ticket-scroller-container">
              <ScrollView>
                <div className="ticket-container">
                  {tickets.map(ticket => (
                    <a href={ticket.link} className={`ticket-tile ${ticket.app}`}>
                      <div className="seat-view">
                        <img src={`/balcony-views/${ticket.section}.webp`} alt={`View from Section ${ticket.section}`}/>
                      </div>
                      <div className="ticket-info">
                        <div className="ticket-app">
                          <img src={`/ticket_app_logos/${ticket.app}_logo.png`} alt={`${ticket.app} logo`} />
                        </div>
                        <span className="seat">
                          Section {ticket.section}<br />
                          Row {ticket.row}
                        </span>
                        <span className="price">
                          ${ticket.price}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </ScrollView>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;