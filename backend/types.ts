import { Request } from 'express';

/**
 * Represents a ticket resale app.
 */
export type TicketAppName = 'tickpick' | 'gametime';

/**
 * Represents a ticket available on a ticket resale app.
 *
 * @property {number} section - The section number of the arena where the ticket is located.
 * @property {number} row - The row number of the section where the ticket is located.
 * @property {number} price - The price of the ticket in USD.
 * @property {TicketAppName} app - The ticket resale app where the ticket is listed.
 * @property {string} link - The link to the ticket listing.
 */
export interface Ticket {
  section: number;
  row: number;
  price: number;
  app: TicketAppName;
  link: string;
}

/**
 * Represents an arena section number to points mapping to associate a value.
 */
export type SectionPoints = {
  [key: number]: number;
}

/**
 * Represents the result of scraping tickets from a ticket resale app.
 *
 * @property {Ticket[]} tickets - The tickets scraped from the app.
 * @property {number} failedTicketsCount - The number of tickets that failed to be scraped.
 */
export interface ScrapeTicketsResult {
  tickets: Ticket[];
  failedTicketsCount: number;
}

/**
 * The request body when scraping tickets from a ticket resale app.
 * 
 * @property {TicketAppName} app - The name of the ticket resale app to scrape tickets from.
 * @property {string} url - The URL of the event page to scrape tickets from.
 * @property {number} ticketQuantity - The number of grouped tickets the customer is searching for.
 */
export interface ScrapeTicketsRequest extends Request {
  body: {
    app: TicketAppName;
    url: string;
    ticketQuantity: number;
  };
}
