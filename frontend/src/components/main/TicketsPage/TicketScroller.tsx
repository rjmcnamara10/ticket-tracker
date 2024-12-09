import React from 'react';
import { ScrollView, Loader } from '@aws-amplify/ui-react';
import { Ticket } from '../../../types';

/**
 * Interface that represents the props for the TicketScroller.
 *
 * @property {string} title - The title of the TicketScroller.
 * @property {Ticket[]} tickets - The tickets to display in the TicketScroller.
 * @property {boolean} loading - Whether the tickets are still loading.
 */
interface TicketScrollerProps {
  title: string;
  tickets: Ticket[];
  loading: boolean;
}

function TicketScroller({ title, tickets, loading }: TicketScrollerProps) {
  return (
    <div className='ticket-list-container'>
      <div className='ticket-list-title'>
        <span>{title}</span>
      </div>
      <div className='ticket-scroller-container'>
        {loading ? (
          <div className='loader-container'>
            <Loader className='custom-loader' variation='linear' />
          </div>
        ) : (
          <ScrollView>
            <div className='ticket-container'>
              {tickets.map((ticket, index) => (
                <a href={ticket.link} className={`ticket-tile ${ticket.app}`} key={index}>
                  <div className='seat-view'>
                    <img
                      src={`/balcony-views/${ticket.section}.webp`}
                      alt={`View from Section ${ticket.section}`}
                    />
                  </div>
                  <div className='ticket-info'>
                    <div className='ticket-app'>
                      <img
                        src={`/ticket_app_logos/${ticket.app}_logo.png`}
                        alt={`${ticket.app} logo`}
                      />
                    </div>
                    <span className='seat'>
                      Section {ticket.section}
                      <br />
                      Row {ticket.row}
                    </span>
                    <span className='price'>${ticket.price}</span>
                  </div>
                </a>
              ))}
            </div>
          </ScrollView>
        )}
      </div>
    </div>
  );
}

export default TicketScroller;
