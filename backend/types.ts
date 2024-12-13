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
 * Represents a sports team.
 */
export type SportsTeamName = 'celtics';

/**
 * Represents a game on a team's schedule.
 *
 * @property {string} date - A representation of the date of the game.
 * @property {string} time - A representation of the time of the game.
 * @property {string} homeTeamCity - The city of the home team.
 * @property {string} homeTeamName - The name of the home team.
 * @property {string} awayTeamCity - The city of the away team.
 * @property {string} awayTeamName - The name of the away team.
 */
export interface Game {
  date: string;
  time: string;
  homeTeamCity: string;
  homeTeamName: string;
  awayTeamCity: string;
  awayTeamName: string;
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
