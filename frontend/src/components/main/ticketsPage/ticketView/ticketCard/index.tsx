import { Ticket } from '../../../../../types';
import './index.css';

/**
 * Represents a card component for displaying the information associated with a ticket.
 *
 * @param {Ticket} ticket - The ticket to display in the card.
 */
const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const lowercaseAppName = ticket.app.toLowerCase();

  return (
    <a href={ticket.link} className={`card ticket-card ${lowercaseAppName}`}>
      <div className='seat-view'>
        <img
          src={`/balcony-views/${ticket.section}.webp`}
          alt={`View from Section ${ticket.section}`}
        />
      </div>
      <div className='ticket-app'>
        <img
          src={`/ticket_app_logos/${lowercaseAppName}_logo.png`}
          alt={`${lowercaseAppName} logo`}
        />
      </div>
      <div className='ticket-info'>
        <span className='seat'>
          Section {ticket.section}
          <br />
          Row {ticket.row}
        </span>
        <span className='price'>${ticket.price}</span>
      </div>
    </a>
  );
};

export default TicketCard;
