import TicketApp from '../../services/ticketApps/TicketApp';
import tickpickApp from '../../services/ticketApps/TickpickApp';
import gametimeApp from '../../services/ticketApps/GametimeApp';
import { TicketAppName } from '../../types';

/**
 * Returns the appropriate TicketApp based on the app name.
 *
 * @param {TicketAppName} app - The name of the ticket app.
 * @returns {TicketApp} The ticket app instance.
 * @throws {Error} Thrown if the app name is invalid.
 */
function getTicketApp(app: TicketAppName): TicketApp {
  switch (app) {
    case 'Tickpick':
      return tickpickApp;
    case 'Gametime':
      return gametimeApp;
    default:
      throw new Error('Invalid app');
  }
}

export default getTicketApp;
