import TicketPageHeader from './ticketsPageHeader';
import TicketView from './ticketView';
import useTicketsPage from '../../../hooks/useTicketsPage';

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
      <TicketPageHeader
        matchup={matchup}
        location={location}
        startDatetime={startDatetime}
        ticketViewOption={ticketViewOption}
        handleTicketViewOptionToggle={handleTicketViewOptionToggle}
        ticketSortOption={ticketSortOption}
        handleTicketSortOptionChange={handleTicketSortOptionChange}
        ticketQuantity={ticketQuantity}
        handleTicketQuantityChange={handleTicketQuantityChange}
        ticketViewList={ticketViewList}
        loading={loading}
        error={error}
      />
      <TicketView
        tickets={displayTickets}
        loading={loading}
        ticketQuantity={ticketQuantity}
        ticketQuantityFound={ticketQuantityFound}
        ticketViewList={ticketViewList}
        error={error}
      />
    </>
  );
};

export default TicketsPage;
