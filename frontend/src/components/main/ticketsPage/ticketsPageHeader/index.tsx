import { FaUser, FaSort } from 'react-icons/fa';
import DropdownMenu from './dropdownMenu';
import TicketViewToggleButton from './toggleButton';
import formatDateTime from '../../../../utils/date.utils';
import '@aws-amplify/ui-react/styles.css';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

/**
 * Interface that represents the props for the TicketPageHeader.
 *
 * @property {string} matchup - The teams playing in the game for the tickets.
 * @property {string} location - The location of the game.
 * @property {string} startDatetime - The start date and time of the game.
 * @property {string} ticketViewOption - The selected ticket view option, either 'list' or 'card'.
 * @property {function} handleTicketViewOptionToggle - Function to handle ticket view option toggle.
 * @property {string} ticketSortOption - The selected ticket sort option.
 * @property {function} handleTicketSortOptionChange - Function to handle ticket sort option change.
 * @property {string} ticketQuantity - The selected ticket quantity.
 * @property {function} handleTicketQuantityChange - Function to handle ticket quantity change.
 * @property {boolean} ticketViewList - Indicates if the ticket view is in list mode, true if list, false if card.
 * @property {boolean} loading - Indicates if the tickets are currently being loaded.
 * @property {string} error - The error message to display if there is an error.
 */
interface TicketPageHeaderProps {
  matchup: string;
  location: string;
  startDatetime: string;
  ticketViewOption: string;
  handleTicketViewOptionToggle: (newTicketViewOption: string) => void;
  ticketSortOption: string;
  handleTicketSortOptionChange: (newTicketSortOption: string) => void;
  ticketQuantity: string;
  handleTicketQuantityChange: (newTicketQuantity: string) => void;
  ticketViewList: boolean;
  loading: boolean;
  error: string;
}

/**
 * Represents a header component for the tickets page, displaying the event information and ticket options.
 *
 * @param {TicketPageHeaderProps} props - The props for the TicketPageHeader.
 */
const TicketPageHeader = ({
  matchup,
  location,
  startDatetime,
  ticketViewOption,
  handleTicketViewOptionToggle,
  ticketSortOption,
  handleTicketSortOptionChange,
  ticketQuantity,
  handleTicketQuantityChange,
  ticketViewList,
  loading,
  error,
}: TicketPageHeaderProps) => (
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
  </>
);

export default TicketPageHeader;
