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
      <div className="Main-content">
        <ScrollView width="1000px" maxWidth="100%">
          <div className="ticket-container">
            {tickets.map(ticket => (
              <div className={`ticket-tile ${ticket.app}`}>
                <div className="seat-view"></div>
                <div className="ticket-info">
                  <span className="app">
                    {ticket.app}
                  </span>
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
  );
}

export default App;