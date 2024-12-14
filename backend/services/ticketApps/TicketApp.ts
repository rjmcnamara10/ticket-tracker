import { ScrapeTicketsResult } from '../../types';

/**
 * Interface representing a ticket resale app.
 */
interface TicketApp {
  /**
   * The proper name of the ticket app.
   * @type {string}
   * @readonly
   */
  readonly name: string;

  /**
   * Scrapes event URLs from the ticket app page.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of event URLs.
   */
  scrapeEventUrls(): Promise<string[]>;

  /**
   * Scrapes tickets from the specified URL.
   *
   * @param {string} url - The URL of the event page to scrape tickets from.
   * @param {number} ticketQuantity - The number of grouped tickets the customer is searching for.
   * @returns {Promise<ScrapeTicketsResult>} A promise that resolves to the result of the ticket scraping,
   * including the ticket data and the number of tickets that failed to be scraped.
   */
  scrapeTickets(url: string, ticketQuantity: number): Promise<ScrapeTicketsResult>;
}

export default TicketApp;
