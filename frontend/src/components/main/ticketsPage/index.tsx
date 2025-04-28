import { Alert, SelectField } from '@aws-amplify/ui-react';
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
    ticketQuantityFound,
    cheapestTix,
    bestValueTix,
    loading,
    error,
  } = useTicketsPage();

  return (
    <>
      {!error && !loading && (
        <div className='event-info-container'>
          <div className='event-info datetime'>
            <span>{formatDateTime(new Date(startDatetime))}</span>
          </div>
          <div className='event-info matchup'>
            <span>{matchup}</span>
          </div>
          <div className='event-info location'>
            <span>{location}</span>
          </div>
          <div className='event-info ticket-quantity'>
            <span>Quantity: {ticketQuantity}</span>
          </div>
          <SelectField
            label='Quantity'
            size='small'
            variation='quiet'
            value={ticketQuantity}
            onChange={event => handleTicketQuantityChange(event.target.value)}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </SelectField>
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
      {/* <StepperField
        max={10}
        min={1}
        step={1}
        value={ticketQuantity}
        onStepChange={handleTicketQuantityChange}
        variation='quiet'
        label='Quantity'
      /> */}
      <div className='ticket-scrollers-container'>
        <TicketScroller title='Cheapest' tickets={cheapestTix} loading={loading} />
        <TicketScroller title='Best Value' tickets={bestValueTix} loading={loading} />
      </div>
    </>
  );
};

export default TicketsPage;
