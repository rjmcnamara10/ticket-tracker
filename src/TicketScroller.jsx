import React from 'react';
import { ScrollView } from '@aws-amplify/ui-react';

function TicketScroller({ title, tickets }) {
    return (
        <div className="ticket-list-container">
            <div className="ticket-list-title">
                <span>{title}</span>
            </div>
            <div className="ticket-scroller-container">
                <ScrollView> 
                    <div className="ticket-container">
                        {tickets.map(ticket => (
                            <a href={ticket.link} className={`ticket-tile ${ticket.app}`} key={ticket.id}>
                                <div className="seat-view">
                                    <img src={`/balcony-views/${ticket.section}.webp`} alt={`View from Section ${ticket.section}`} />
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
    );
}

export default TicketScroller;
