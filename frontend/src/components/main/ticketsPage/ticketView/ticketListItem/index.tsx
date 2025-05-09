import { Ticket } from '../../../../../types';
import './index.css';

/**
 * Represents a list item component for displaying the information associated with a ticket.
 *
 * @param {Ticket} ticket - The ticket to display in the list item.
 */
const TicketListItem = ({ ticket }: { ticket: Ticket }) => {
  const lowercaseAppName = ticket.app.toLowerCase();

  return (
    <a href={ticket.link} className='list-item ticket-list-item'>
      {/* <div className='seat-view-list'>
        <img
          src={`/balcony-views/${ticket.section}.webp`}
          alt={`View from Section ${ticket.section}`}
        />
      </div> */}
      <div className='ticket-app-list'>
        <img
          src={`/ticket_app_logos/${lowercaseAppName}_logo.png`}
          alt={`${lowercaseAppName} logo`}
        />
      </div>
      {/* <div className='ticket-info-list'>
        <span className='seat-list'>
          Section {ticket.section}
          <br />
          Row {ticket.row}
        </span>
        <span className='price-list'>${ticket.price}</span>
      </div> */}
      <span className='seat-list'>
        Section {ticket.section}
        <br />
        Row {ticket.row}
      </span>
      <span className='price-list'>${ticket.price}</span>
    </a>
  );
};

export default TicketListItem;
