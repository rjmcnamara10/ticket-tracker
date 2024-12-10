import { ScrollView, Loader } from '@aws-amplify/ui-react';
import TicketTile from '../ticketTile';
import { Ticket } from '../../../../types';
import './index.css';

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

/**
 * Represents a scrolling component for displaying tickets.
 *
 * @param {TicketScrollerProps} props - The props for the TicketScroller.
 */
const TicketScroller = ({ title, tickets, loading }: TicketScrollerProps) => (
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
          <div className='tickets-container'>
            {tickets.map((ticket, index) => (
              <TicketTile ticket={ticket} key={index} />
            ))}
          </div>
        </ScrollView>
      )}
    </div>
  </div>
);

export default TicketScroller;
