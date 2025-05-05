import TicketApp from '../services/ticketApps/TicketApp';
import tickpickApp from '../services/ticketApps/TickpickApp';
import gametimeApp from '../services/ticketApps/GametimeApp';
import {
  TicketAppName,
  ScrapeEventUrlsRequest,
  ScrapeTicketsRequest,
  FetchTicketsRequest,
} from '../types';
import { fetchTickets } from '../services/database';

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

/**
 * Scrapes event URLs from a ticket resale app.
 *
 * @param {ScrapeEventUrlsRequest} req - The request object containing the app name.
 * @returns {Promise} A Promise that resolves to an object containing a success message and the scraped event URLs.
 */
const scrapeEventUrlsHandler = async (req: ScrapeEventUrlsRequest) => {
  const { app } = req.body;
  const ticketApp = getTicketApp(app);
  const eventUrls = await ticketApp.scrapeEventUrls();

  return {
    message: `${ticketApp.name} event URLs scraped successfully`,
    eventUrls,
  };
};

/**
 * Scrapes tickets from a ticket resale app for a given URL and ticket quantity.
 *
 * @param {ScrapeTicketsRequest} req - The request object containing the app name, URL, and ticket quantity.
 * @returns {Promise} A Promise that resolves to an object containing the app name, success and failed ticket counts, and the scraped tickets.
 */
const scrapeTicketsHandler = async (req: ScrapeTicketsRequest) => {
  const { app, url, ticketQuantity } = req.body;
  const ticketApp = getTicketApp(app);
  const { tickets, failedTicketsCount } = await ticketApp.scrapeTickets(url, ticketQuantity);

  return {
    app: ticketApp.name,
    successTicketsCount: tickets.length,
    failedTicketsCount,
    tickets,
  };
};

/**
 * Fetches tickets from the database for a given game ID and ticket quantity.
 *
 * @param {FetchTicketsRequest} req - The request object containing the game ID and ticket quantity.
 * @returns {Promise} A Promise that resolves to an object containing a success message and the fetched tickets response info.
 */
const fetchTicketsHandler = async (req: FetchTicketsRequest) => {
  const { gameId, ticketQuantity } = req.query;
  if (!gameId || !ticketQuantity) {
    throw new Error('gameId and ticketQuantity are required');
  }

  const ticketQuantityNumber = parseInt(ticketQuantity, 10);
  const fetchTixRes = await fetchTickets(gameId, ticketQuantityNumber);

  if ('error' in fetchTixRes) {
    throw new Error(fetchTixRes.error);
  }

  return {
    message: 'Tickets fetched successfully',
    ...fetchTixRes,
  };
};

export { scrapeEventUrlsHandler, scrapeTicketsHandler, fetchTicketsHandler };
