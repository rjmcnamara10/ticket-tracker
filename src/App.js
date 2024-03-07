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
          <ScrollView width="800px" maxWidth="100%" height="275px">
            <div className="ticket-container">
              {tickets.map(ticket => (
                <div className={`ticket-tile ${ticket.app}`}>
                  <div className="seat-view"></div>
                  <div className="ticket-info">
                    <div className="app">
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
                </div>
              ))}
            </div>
          </ScrollView>
        </div>
      </div>
    </div>
  );
}

export default App;