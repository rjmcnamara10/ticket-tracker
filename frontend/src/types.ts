/**
 * Represents a ticket resale app.
 */
export type TicketAppName = 'Tickpick' | 'Gametime';

/**
 * Represents a ticket available on a ticket resale app.
 *
 * @property {string} [_id] - The unique identifier of the ticket. Optional field.
 * @property {number} section - The section number of the arena where the ticket is located.
 * @property {number} row - The row number of the section where the ticket is located.
 * @property {number} price - The price of the ticket in USD.
 * @property {number} quantity - The number of tickets available to purchase at the price and location.
 * @property {TicketAppName} app - The ticket resale app where the ticket is listed.
 * @property {string} link - The link to the ticket listing.
 */
export interface Ticket {
  _id?: string;
  section: number;
  row: number;
  price: number;
  quantity: number;
  app: TicketAppName;
  link: string;
}

/**
 * Represents a sports team.
 */
export type SportsTeamName = 'celtics';

/**
 * Represents a ticket resale app page for a specific game.
 *
 * @property {TicketAppName} app - The name of the ticket resale app.
 * @property {string} gameUrl - The URL to the game page on the app.
 */
interface TicketsPage {
  app: TicketAppName;
  gameUrl: string;
}

/**
 * Represents a set of ticket listings which are sold in the same quantity.
 *
 * @property {number} ticketQuantity - The size of the group that all the tickets are sold in.
 * @property {Date} lastUpdated - The date and time when the tickets were last updated.
 * @property {Ticket[]} tickets - The set of available ticket listings at the quantity.
 */
interface TicketQuantityGroup {
  ticketQuantity: number;
  lastUpdated: Date;
  tickets: Ticket[];
}

/**
 * Represents a matchup between two sports teams.
 *
 * @property {string} [_id] - The unique identifier of the game. Optional field.
 * @property {string} homeTeam - The full name of the home team.
 * @property {string} awayTeam - The full name of the away team.
 * @property {Date} startDateTime - The date and time when the game starts in EST.
 * @property {string} venue - The name of the venue where the game is played.
 * @property {string} city - The city where the game is played.
 * @property {string} state - The two-letter abbreviation of the state where the game is played.
 * @property {TicketsPage[]} ticketAppUrls - The URLs to the game page for each ticket app.
 * @property {TicketQuantityGroup[]} ticketsByQuantity - The tickets available for the game, grouped by quantity.
 */
export interface Game {
  _id?: string;
  homeTeam: string;
  awayTeam: string;
  startDateTime: Date;
  venue: string;
  city: string;
  state: string;
  ticketAppUrls: TicketsPage[];
  ticketsByQuantity: TicketQuantityGroup[];
}
