import { Alert } from '@aws-amplify/ui-react';
import TicketScroller from './ticketScroller';
import useTicketsPage from '../../../hooks/useTicketsPage';
import './index.css';

/**
 * Represents the page to display the available tickets for an event.
 */
const TicketsPage = () => {
  const { cheapestTickets, bestValueTickets, loadingCheapest, loadingBestValue, error } =
    useTicketsPage();

  return (
    <>
      <div className='event-info-container'>
        <div className='event-info datetime'>
          <span>Mon 10/28 7:30 PM</span>
        </div>
        <div className='event-info matchup'>
          <span>Milwaukee Bucks @ Boston Celtics</span>
        </div>
        <div className='event-info ticket-quantity'>
          <span>Quantity: 2</span>
        </div>
      </div>
      {error && (
        <Alert variation='error' isDismissible={true} hasIcon={true}>
          {error}
        </Alert>
      )}
      <div className='ticket-scrollers-container'>
        <TicketScroller title='Cheapest' tickets={cheapestTickets} loading={loadingCheapest} />
        <TicketScroller title='Best Value' tickets={bestValueTickets} loading={loadingBestValue} />
      </div>
    </>
  );
};

export default TicketsPage;
