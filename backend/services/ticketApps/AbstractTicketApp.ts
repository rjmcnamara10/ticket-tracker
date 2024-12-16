import TicketApp from './TicketApp';
import { TicketAppName, ScrapeTicketsResult } from '../../types';

/**
 * Abstract class representing a ticket resale app.
 *
 * @abstract
 * @implements {TicketApp}
 */
abstract class AbstractTicketApp implements TicketApp {
  abstract readonly name: TicketAppName;

  abstract scrapeEventUrls(): Promise<string[]>;

  abstract scrapeTickets(url: string, ticketQuantity: number): Promise<ScrapeTicketsResult>;
}

export default AbstractTicketApp;
