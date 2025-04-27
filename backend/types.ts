import { ObjectId } from 'mongodb';
import { Request } from 'express';

/**
 * Represents a ticket resale app.
 */
export type TicketAppName = 'Tickpick' | 'Gametime';

/**
 * Represents a ticket available on a ticket resale app.
 *
 * @property {ObjectId} [_id] - The unique identifier of the ticket. Optional field.
 * @property {number} section - The section number of the arena where the ticket is located.
 * @property {number} row - The row number of the section where the ticket is located.
 * @property {number} price - The price of the ticket in USD.
 * @property {number} quantity - The number of tickets available to purchase at the price and location.
 * @property {TicketAppName} app - The ticket resale app where the ticket is listed.
 * @property {string} link - The link to the ticket listing.
 */
export interface Ticket {
  _id?: ObjectId;
  section: number;
  row: number;
  price: number;
  quantity: number;
  app: TicketAppName;
  link: string;
}

/**
 * Represents an arena section number to points mapping to associate a value.
 */
export type SectionPointsMap = {
  [key: number]: number;
};

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
 * @property {ObjectId} [_id] - The unique identifier of the game. Optional field.
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
  _id?: ObjectId;
  homeTeam: string;
  awayTeam: string;
  startDateTime: Date;
  venue: string;
  city: string;
  state: string;
  ticketAppUrls: TicketsPage[];
  ticketsByQuantity: TicketQuantityGroup[];
}

/**
 * Represents an attempted scraping for an app that resulted in zero tickets during a request to refresh tickets for a game.
 *
 * @property {TicketAppName} app - The name of the ticket app.
 * @property {string} reason - The reason the scraping attempt failed.
 */
export interface IncompleteTicketApp {
  app: TicketAppName;
  reason: string;
}

/**
 * Represents the possible ordering options for games.
 */
export type GameOrderType = 'chronological';

/**
 * Represents the result of scraping tickets from a ticket resale app.
 *
 * @property {TicketAppName} app - The name of the ticket resale app.
 * @property {Ticket[]} tickets - The tickets scraped from the app.
 * @property {number} failedTicketsCount - The number of tickets that failed to be scraped.
 */
export interface ScrapeTicketsResult {
  app: TicketAppName;
  tickets: Ticket[];
  failedTicketsCount: number;
}

/**
 * The request body when scraping event URLs from a ticket resale app.
 *
 * @property {TicketAppName} app - The name of the ticket resale app to scrape event URLs from.
 */
export interface ScrapeEventUrlsRequest extends Request {
  body: {
    app: TicketAppName;
  };
}

/**
 * The request body when scraping tickets from a ticket resale app.
 *
 * @property {TicketAppName} app - The name of the ticket resale app to scrape tickets from.
 * @property {string} url - The URL of the event page to scrape tickets from.
 * @property {number} ticketQuantity - The size of the group of tickets the customer is searching for.
 */
export interface ScrapeTicketsRequest extends Request {
  body: {
    app: TicketAppName;
    url: string;
    ticketQuantity: number;
  };
}

/**
 * The request query when fetching tickets for a game.
 *
 * @property {string} gameId - The unique identifier of the game to fetch tickets for.
 * @property {string} ticketQuantity - The quantity of tickets to fetch.
 */
export interface FetchTicketsRequest extends Request {
  query: {
    gameId: string;
    ticketQuantity: string;
  };
}

/**
 * The request body when fetching and adding future home games for a team.
 *
 * @property {SportsTeamName} team - The name of the sports team to add the home games for.
 */
export interface AddHomeGamesRequest extends Request {
  body: {
    team: SportsTeamName;
  };
}

/**
 * The request body when adding a ticket app URL to a game.
 *
 * @property {string} gameId - The unique identifier of the game to add the ticket app URL to.
 * @property {TicketAppName} app - The name of the ticket app.
 * @property {string} ticketAppUrl - The URL to the game page on the ticket app.
 */
export interface AddTicketAppUrlRequest extends Request {
  body: {
    gameId: string;
    app: TicketAppName;
    ticketAppUrl: string;
  };
}

/**
 * The request body when refreshing the tickets for a game.
 *
 * @property {string} gameId - The unique identifier of the game to refresh the tickets for.
 * @property {number} ticketQuantity - The quantity of tickets to refresh.
 */
export interface RefreshTicketsRequest extends Request {
  body: {
    gameId: string;
    ticketQuantity: number;
  };
}

/**
 * The request query when fetching games.
 *
 * @property {GameOrderType} order - The order type for the games.
 */
export interface FetchGamesRequest extends Request {
  query: {
    order: GameOrderType;
  };
}

/**
 * Type representing the possible responses for a Game-related operation involving a single game.
 */
export type GameResponse = Game | { error: string };

/**
 * Type representing the possible responses for a Game-related operation involving a multiple games.
 */
export type GamesResponse = Game[] | { error: string };

/**
 * Type representing the possible responses for a Ticket-related operation involving a multiple tickets.
 */
export type TicketsResponse = Ticket[] | { error: string };

/**
 * Type representing the possible responses for a 'fetch tickets' operation.
 */
export type FetchTicketsResponse =
  | {
      homeTeam: string;
      awayTeam: string;
      startDateTime: Date;
      venue: string;
      city: string;
      state: string;
      cheapestTickets: Ticket[];
      bestValueTickets: Ticket[];
    }
  | { error: string };
