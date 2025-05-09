import { useState } from 'react';
import { Alert, Loader } from '@aws-amplify/ui-react';
import TicketListItem from './ticketListItem';
import TicketCard from './ticketCard';
import { Ticket } from '../../../../types';
import '@aws-amplify/ui-react/styles.css';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

/**
 * Interface that represents the props for the TicketView.
 *
 * @property {Ticket[]} tickets - The tickets to display in the TicketView.
 * @property {boolean} loading - Indicates if the tickets are currently being loaded.
 * @property {string} ticketQuantity - The selected ticket quantity.
 * @property {boolean} ticketQuantityFound - Indicates if the game in the database has tickets at the specified quantity.
 * @property {boolean} ticketViewList - Indicates if the ticket view is in list mode, true if list, false if card.
 * @property {string} error - The error message to display if there is an error.
 */
interface TicketViewProps {
  tickets: Ticket[];
  loading: boolean;
  ticketQuantity: string;
  ticketQuantityFound: boolean;
  ticketViewList: boolean;
  error: string;
}

/**
 * Represents a scrolling component for displaying tickets.
 *
 * @param {TicketViewProps} props - The props for the TicketView.
 */
const TicketView = ({
  tickets,
  loading,
  ticketQuantity,
  ticketQuantityFound,
  ticketViewList,
  error,
}: TicketViewProps) => {
  const defaultVisibleTickets = 20;
  const [visibleTickets, setVisibleTickets] = useState(defaultVisibleTickets);

  /**
   * Handles the event when the user clicks the "Load more results" tile.
   */
  const handleLoadMore = () => {
    setVisibleTickets(prev => prev + defaultVisibleTickets);
  };

  return (
    <>
      {error && (
        <Alert variation='error' isDismissible={true} hasIcon={true}>
          {error}
        </Alert>
      )}
      {!ticketQuantityFound && !loading && (
        <Alert variation='info' isDismissible={false} hasIcon={true}>
          <span>Tickets not found for the specified quantity: {ticketQuantity}</span>
        </Alert>
      )}
      <div className='ticket-container'>
        <div className='ticket-scroller-container'>
          {loading && <Loader size='large' />}
          {!loading && tickets.length === 0 && (
            <div className='no-tickets-message'>
              <span>No tickets available</span>
            </div>
          )}
          <div className={`ticket-view-container-${ticketViewList ? 'list' : 'card'}`}>
            {tickets
              .slice(0, visibleTickets)
              .map((ticket, index) =>
                ticketViewList ? (
                  <TicketListItem ticket={ticket} key={index} />
                ) : (
                  <TicketCard ticket={ticket} key={index} />
                ),
              )}
            {visibleTickets < tickets.length && (
              <div
                className={`end-of-results load-more ${ticketViewList ? 'list-item' : 'card'}`}
                onClick={handleLoadMore}>
                <span>Load more results</span>
                {ticketViewList ? (
                  <i className='fas fa-arrow-down'></i>
                ) : (
                  <i className='fas fa-arrow-right'></i>
                )}
              </div>
            )}
            {visibleTickets >= tickets.length && tickets.length > 0 && (
              <div className={`end-of-results ${ticketViewList ? 'list-item' : 'card'}`}>
                No more results
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketView;
