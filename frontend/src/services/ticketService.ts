import { TicketAppName, TicketOrderType } from '../types';
import api from './config';

const TICKET_API_URL = `${process.env.REACT_APP_SERVER_URL}/ticket`;

/**
 * Function to scrape event URLs from a ticket resale app.
 *
 * @param {TicketAppName} app - The name of the ticket resale app to scrape event URLs from.
 * @throws Error if there is an issue scraping the event URLs.
 */
const scrapeEventUrls = async (app: TicketAppName) => {
  const res = await api.post(`${TICKET_API_URL}/scrapeEventUrls`, app);

  if (res.status !== 200) {
    throw new Error('Error while scraping event URLs');
  }

  return res.data;
};

/**
 * Function to fetch tickets.
 *
 * @param {TicketOrderType} order - The order to sort the tickets by.
 * @param {string} gameId - The unique identifier of the game to fetch tickets for.
 * @param {number} ticketQuantity - The quantity of tickets the listings are sold in.
 * @throws Error if there is an issue fetching or sorting the tickets.
 */
const fetchTickets = async (order: TicketOrderType, gameId: string, ticketQuantity: number) => {
  const res = await api.get(
    `${TICKET_API_URL}/fetchTickets?order=${order}&gameId=${gameId}&ticketQuantity=${ticketQuantity}`,
  );
  if (res.status !== 200) {
    throw new Error('Error when fetching or sorting tickets');
  }
  return res.data;
};

export { scrapeEventUrls, fetchTickets };
