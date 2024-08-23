import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import appLogo from '/logo192.png';
import appTitle from '/title.png';
import TicketScroller from './TicketScroller.jsx';
import './App.css';

function App() {
    const [valueTix, setValueTix] = useState([]);
    const [cheapestTix, setCheapestTix] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch('value_tix.json').then(response => response.json()),
            fetch('cheapest_tix.json').then(response => response.json())
        ]).then(([valueTixData, cheapestTixData]) => {
            setValueTix(valueTixData);
            setCheapestTix(cheapestTixData);
        }).catch(error => console.error('Error fetching tickets:', error));
    }, []);

    return (
        <>
            <div className="App">
                <Helmet>
                    <title>Ticket Track</title>
                    <link rel="manifest" href="/manifest.json" />
                </Helmet>
                <header className="App-header">
                    <img src={appLogo} alt="Logo" className="logo" />
                    <img src={appTitle} alt="Title" className="title" />
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
                        <div className="ticket-scrollers-container">
                            <TicketScroller title="Best Value" tickets={valueTix} />
                            <TicketScroller title="Cheapest" tickets={cheapestTix} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
