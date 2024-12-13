import { ObjectId } from 'mongodb';
import { Request } from 'express';

/**
 * Represents a ticket resale app.
 */
export type TicketAppName = 'tickpick' | 'gametime';

/**
 * Represents a ticket available on a ticket resale app.
 *
 * @property {ObjectId} [_id] - The unique identifier of the ticket. Optional.
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
export type SectionPoints = {
  [key: number]: number;
}

/**
 * Represents a sports team.
 */
export type SportsTeamName = 'celtics';

/**
 * Represents a matchup between two sports teams.
 *
 * @property {ObjectId} [_id] - The unique identifier of the game. Optional.
 * @property {string} homeTeam - The full name of the home team.
 * @property {string} awayTeam - The full name of the away team.
 * @property {Date} startDateTime - The date and time when the game starts in EST.
 * @property {string} venue - The name of the venue where the game is played.
 * @property {string} city - The city where the game is played.
 * @property {string} state - The two-letter abbreviation of the state where the game is played.
 * @property {Ticket[]} tickets - The tickets available for the game.
 * @property {Date} [lastUpdated] - The date and time when the tickets available was last updated. Optional.
 */
export interface Game {
  _id?: ObjectId;
  homeTeam: string;
  awayTeam: string;
  startDateTime: Date;
  venue: string;
  city: string;
  state: string;
  tickets: Ticket[];
  lastUpdated?: Date;
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
 * @property {number} ticketQuantity - The number of grouped tickets the customer is searching for.
 */
export interface ScrapeTicketsRequest extends Request {
  body: {
    app: TicketAppName;
    url: string;
    ticketQuantity: number;
  };
}

/**
 * The request body when fetching a home schedule.
 * 
 * @property {SportsTeamName} team - The name of the sports team to fetch the home schedule for.
 */
export interface HomeScheduleRequest extends Request {
  body: {
    team: SportsTeamName;
  };
}

/**
 * Type representing the possible responses for saving games to the database.
 */
export type saveGamesResponse = { success: boolean } | { error: string };
