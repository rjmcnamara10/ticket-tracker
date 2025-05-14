import { Ticket } from '../../../../../types';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

/**
 * Represents a list item component for displaying the information associated with a ticket.
 *
 * @param {Ticket} ticket - The ticket to display in the list item.
 */
const TicketListItem = ({ ticket }: { ticket: Ticket }) => {
  const lowercaseAppName = ticket.app.toLowerCase();

  return (
    <a href={ticket.link} className='list-item ticket-list-item'>
      <div className='ticket-app-list'>
        <img
          src={`/ticket_app_logos/${lowercaseAppName}_logo.png`}
          alt={`${lowercaseAppName} logo`}
        />
      </div>
      <span className='seat-list'>
        Section {ticket.section} - Row {ticket.row}
      </span>
      <div
        className='seat-view-list'
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}>
        <i className='fas fa-binoculars'></i>
        <div className='seat-view-image-list'>
          <img
            src={`/balcony-views/${ticket.section}.webp`}
            alt={`View from Section ${ticket.section}`}
          />
        </div>
      </div>
      <span className='price-list'>${ticket.price}</span>
    </a>
  );
};

export default TicketListItem;
