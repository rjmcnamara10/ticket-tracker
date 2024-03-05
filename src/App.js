import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, ScrollView } from '@aws-amplify/ui-react';
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
        <img src="/title.png" alt="Logo" className="title" />
      </header>
      <div className="Main-content">
        <ScrollView width="1000px" maxWidth="100%">
          <ul className="Card-container">
            {tickets.map(ticket => (
              <Card key={ticket.id}> {/* Wrap each ticket in a Card */}
                <p>Section: {ticket.section}</p>
                <p>Row: {ticket.row}</p>
                <p>Price: ${ticket.price}</p>
                <p>App: {ticket.app}</p>
                <p>Location Points: {ticket.locationPoints}</p>
              </Card>
            ))}
          </ul>
        </ScrollView>
      </div>
    </div>
  );
}

export default App;