import { Alert } from '@aws-amplify/ui-react';
import { FaUser, FaSort } from 'react-icons/fa';
import DropdownMenu from './dropdownMenu';
import TicketViewToggleButton from './toggleButton';
import TicketScroller from './ticketScroller';
import useTicketsPage from '../../../hooks/useTicketsPage';
import formatDateTime from '../../../utils/date.utils';
import './index.css';

/**
 * Represents the page to display the available tickets for an event.
 */
const TicketsPage = () => {
  const {
    matchup,
    location,
    startDatetime,
    ticketQuantity,
    handleTicketQuantityChange,
    ticketSortOption,
    handleTicketSortOptionChange,
    ticketViewOption,
    handleTicketViewOptionToggle,
    ticketViewList,
    ticketQuantityFound,
    displayTickets,
    loading,
    error,
  } = useTicketsPage();

  return (
    <>
      {!error && !loading && (
        <div className='tickets-page-heading-container'>
          <div className='event-info-ticket-view-container'>
            <div className='event-info-container'>
              <div className='matchup'>
                <span>{matchup}</span>
              </div>
              <div className='location-datetime'>
                <span>
                  {location} - {formatDateTime(new Date(startDatetime))}
                </span>
              </div>
            </div>
            <TicketViewToggleButton
              value={ticketViewOption}
              onChange={handleTicketViewOptionToggle}
              listView={ticketViewList}
            />
          </div>
          <div className='ticket-options-container'>
            <div className='ticket-sort'>
              <div className='dropdown-container'>
                <FaSort className='dropdown-icon' />
                <DropdownMenu
                  value={ticketSortOption}
                  onChange={handleTicketSortOptionChange}
                  options={[
                    { value: 'cheapest', label: 'Cheapest' },
                    { value: 'bestValue', label: 'Best Value' },
                  ]}
                />
              </div>
            </div>
            <div className='ticket-quantity'>
              <div className='dropdown-container'>
                <FaUser className='dropdown-icon' />
                <DropdownMenu
                  value={ticketQuantity}
                  onChange={handleTicketQuantityChange}
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                    { value: '6', label: '6' },
                    { value: '7', label: '7' },
                    { value: '8', label: '8' },
                    { value: '9', label: '9' },
                    { value: '10', label: '10' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
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
      {ticketViewList ? (
        <TicketScroller title='List' tickets={displayTickets} loading={loading} />
      ) : (
        <div className='ticket-scrollers-container'>
          <TicketScroller title='Card' tickets={displayTickets} loading={loading} />
        </div>
      )}
    </>
  );
};

export default TicketsPage;
