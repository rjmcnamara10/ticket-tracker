import { TicketAppName } from '../types';
import api from './config';

const TICKET_API_URL = `${import.meta.env.VITE_SERVER_URL}/ticket`;

/**
 * Function to scrape event URLs from a ticket resale app.
 *
 * @param {TicketAppName} app - The name of the ticket resale app to scrape event URLs from.
 * @throws Error if there is an issue scraping the event URLs.
 */
const scrapeEventUrls = async (app: TicketAppName) => {
  const res = await api.post(`${TICKET_API_URL}/scrapeEventUrls`, app);

  if (res.status !== 200) {
    const errorMessage = res.data || 'Error while scraping event URLs';
    throw new Error(errorMessage);
  }

  return res.data;
};

/**
 * Function to fetch tickets.
 *
 * @param {string} gameId - The unique identifier of the game to fetch tickets for.
 * @param {string} ticketQuantity - The quantity of tickets the listings are sold in.
 * @throws Error if there is an issue fetching or sorting the tickets.
 */
const fetchTickets = async (gameId: string, ticketQuantity: string) => {
  const res = await api.get(
    `${TICKET_API_URL}/fetchTickets?gameId=${gameId}&ticketQuantity=${ticketQuantity}`,
  );
  if (res.status !== 200) {
    const errorMessage = res.data || 'Error when fetching or sorting tickets';
    throw new Error(errorMessage);
  }
  return res.data;
};

export { scrapeEventUrls, fetchTickets };
