/**
 * Represents a ticket resale app.
 */
type TicketAppName = 'tickpick' | 'gametime';

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
};
