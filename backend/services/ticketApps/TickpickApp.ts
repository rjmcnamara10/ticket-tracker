import puppeteer from 'puppeteer';
import AbstractTicketApp from './AbstractTicketApp';
import { Ticket, ScrapeTicketsResult } from '../../types';

/**
 * Class to represent the Tickpick ticket resale app.
 *
 * @extends AbstractTicketApp
 */
class TickpickApp extends AbstractTicketApp {
  readonly name: string = 'Tickpick';

  /**
   * The URL to the home page of Tickpick.
   * @type {string}
   * @readonly
   * @private
   */
  private readonly _homePageUrl: string = 'https://www.tickpick.com';

  /**
   * The URL which lists event URLs on Tickpick.
   * @type {string}
   * @readonly
   * @private
   */
  private readonly _eventPageUrl: string = 'https://www.tickpick.com/nba/boston-celtics-tickets/';

  async scrapeEventUrls(): Promise<string[]> {
    // Temporary implementation
    return [
      `${this._homePageUrl}/buy-boston-celtics-vs-detroit-pistons-tickets-td-garden-12-12-24-7pm/6637544/`,
      `${this._homePageUrl}/buy-washington-wizards-vs-boston-celtics-tickets-capital-one-arena-12-15-24-6pm/6637555/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-chicago-bulls-tickets-td-garden-12-19-24-7pm/6633509/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-philadelphia-76ers-tickets-td-garden-12-25-24-5pm/6620096/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-indiana-pacers-tickets-td-garden-12-27-24-7pm/6633517/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-indiana-pacers-tickets-td-garden-12-29-24-6pm/6633518/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-toronto-raptors-tickets-td-garden-12-31-24-3pm/6633521/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-sacramento-kings-tickets-td-garden-1-10-25-7pm/6633524/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-new-orleans-pelicans-tickets-td-garden-1-12-25-6pm/6633525/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-orlando-magic-tickets-td-garden-1-17-25-7pm/6633527/`,
      `${this._homePageUrl}/buy-boston-celtics-vs-atlanta-hawks-tickets-td-garden-1-18-25-7pm/6633529/`,
    ];
  }

  async scrapeTickets(url: string, ticketQuantity: number): Promise<ScrapeTicketsResult> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set custom user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    );
    await page.goto(url);

    // Wait for the listings container to load
    await page.waitForSelector('#listingContainer');
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });

    // Extract ticket information
    const scrapeTicketsResult = await page.evaluate(pageUrl => {
      const tickets: Ticket[] = [];
      const app = 'tickpick';
      const link = pageUrl; // Tickpick does not have a separate link for tickets
      let failedTicketsCount = 0;

      const ticketElements = document.querySelectorAll('.listing');
      ticketElements.forEach(ticketElement => {
        try {
          // Extract section and row
          let sectionStr = '';
          let rowStr = '';
          const sectionRowText = ticketElement.querySelector('.sout span')?.textContent;
          if (sectionRowText) {
            const match = sectionRowText.match(/Section (\d+) • Row (\d+)/);
            if (match) {
              [sectionStr, rowStr] = match.slice(1, 3);
            }
          }

          // Extract price
          const priceElement = ticketElement.querySelector('label > b');
          const priceText = priceElement ? priceElement.textContent?.trim() : '';
          const price = priceText ? parseInt(priceText.replace(/^\$/, ''), 10) : -1;

          if (sectionStr && rowStr && price >= 0) {
            // Keep only numbered sections and rows
            const section = parseInt(sectionStr, 10);
            const row = parseInt(rowStr, 10);
            if (!Number.isNaN(section) && !Number.isNaN(row)) {
              tickets.push({ section, row, price, quantity: ticketQuantity, app, link });
            }
          } else {
            failedTicketsCount++;
          }
        } catch (error) {
          failedTicketsCount++;
        }
      });

      return { tickets, failedTicketsCount };
    }, url);

    await browser.close();
    return scrapeTicketsResult;
  }
}

export default TickpickApp;
