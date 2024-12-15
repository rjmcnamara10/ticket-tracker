import {
  Ticket,
  TicketAppName,
  ScrapeTicketsResult,
  saveTicketsResponse,
  GameResponse,
} from '../../types';

/**
 * Interface representing a ticket resale app.
 */
interface TicketApp {
  /**
   * The proper name of the ticket app.
   * @type {TicketAppName}
   * @readonly
   */
  readonly name: TicketAppName;

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

  /**
   * Saves a list of tickets to the database.
   *
   * @param {Ticket[]} tickets - The list of tickets to save.
   * @returns {Promise<saveTicketsResponse>} A promise that resolves to an array of the saved tickets or error message.
   */
  saveTickets(tickets: Ticket[]): Promise<saveTicketsResponse>;

  addTicketsToGame(
    gameId: string,
    tickets: Ticket[],
    ticketQuantity: number,
    scrapeDateTime: Date,
  ): Promise<GameResponse>;
}

export default TicketApp;
