import puppeteer from 'puppeteer';
import TicketApp from './TicketApp';
import { Ticket, TicketAppName, ScrapeTicketsResult } from '../../types';

/**
 * Class to represent the Gametime ticket resale app.
 *
 * @implements {TicketApp}
 */
class GametimeApp implements TicketApp {
  readonly name: TicketAppName = 'Gametime';

  /**
   * The URL to the home page of Gametime.
   * @type {string}
   * @readonly
   * @private
   */
  private readonly _homePageUrl: string = 'https://gametime.co';

  /**
   * The URL which lists event URLs on Gametime.
   * @type {string}
   * @readonly
   * @private
   */
  private readonly _eventPageUrl: string =
    'https://gametime.co/boston-celtics-tickets/performers/nbabos';

  async scrapeEventUrls(): Promise<string[]> {
    // Temporary implementation
    return [
      `${this._homePageUrl}/nba-basketball/detroit-pistons-at-boston-celtics-tickets/12-12-2024-boston-ma-td-garden/events/66bf5fd00109394f0ebeb7d7`,
      `${this._homePageUrl}/nba-basketball/bulls-at-celtics-tickets/12-19-2024-boston-ma-td-garden/events/66be5ccf7514c0d1631d2a79`,
      `${this._homePageUrl}/nba-basketball/76-ers-at-celtics-tickets/12-25-2024-boston-ma-td-garden/events/66b6b97a442e7e398be5eb53`,
      `${this._homePageUrl}/nba-basketball/pacers-at-celtics-tickets/12-27-2024-boston-ma-td-garden/events/66be5d253ede6703176ffac8`,
      `${this._homePageUrl}/nba-basketball/pacers-at-celtics-tickets/12-29-2024-boston-ma-td-garden/events/66be5d3e6c4f21420654405c`,
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

    // Select the quantity of tickets (default is 2)
    if (ticketQuantity !== 2) {
      const dropdownMenuSelector = 'div.ui-Menu-Menu-module__menu.ui-Menu-Menu-module__icon-chip';
      await page.waitForSelector(dropdownMenuSelector);
      const dropdownMenu = await page.$(dropdownMenuSelector);
      if (dropdownMenu) {
        await dropdownMenu.click();
      }
      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
      const ticketsOptionSelector = `div.pages-Event-components-OmnibarOptions-OmnibarOptions-module__panel-body-item[id="${ticketQuantity}"]`;
      await page.waitForSelector(ticketsOptionSelector, { timeout: 60000 });
      await page.click(ticketsOptionSelector);
      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
    }

    // Select 'all-in pricing'
    const allInPricingEnabled = await page.evaluate(() => {
      const allInPricingElement = document.querySelector('[data-testid="all-in-pricing"]');
      return allInPricingElement?.classList.contains('_2amR4x2ztZ5dL7PJxn7oJo') ?? false;
    });
    if (!allInPricingEnabled) {
      await page.click('[data-testid="all-in-pricing"]');
      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
    }

    // Extract ticket information
    const scrapeTicketsResult = await page.evaluate(
      (pageUrl, quantity, app) => {
        const tickets: Ticket[] = [];
        let failedTicketsCount = 0;

        const ticketElements = document.querySelectorAll(
          '.pages-Event-components-ListingCard-ListingCard-module__listing-card-container',
        );
        ticketElements.forEach(ticketElement => {
          // Extract section and row
          let sectionStr = '';
          let rowStr = '';
          const sectionRowElement = ticketElement.querySelector(
            '.pages-Event-components-ListingCard-ListingCard-module__seat-details-row',
          );
          const sectionRowText = sectionRowElement?.textContent;
          if (sectionRowText) {
            const match = sectionRowText.match(/(\d+), Row (\d+|[A-Z])/);
            if (match) {
              [sectionStr, rowStr] = match.slice(1, 3);
            }
          }

          // Extract price
          const priceElement = ticketElement.querySelector(
            '.pages-Event-components-ListingCard-ListingCard-module__price-info',
          );
          const priceText = priceElement
            ? priceElement.lastElementChild?.textContent
            : 'Price not found';
          const price = priceText ? parseInt(priceText.trim().replace(/^\$|\/ea$/g, ''), 10) : -1;

          // Extract link
          const linkElement = ticketElement.querySelector(
            'a.pages-Event-components-ListingCard-ListingCard-module__listing-card',
          );
          const link = linkElement instanceof HTMLAnchorElement ? linkElement.href : pageUrl;

          if (sectionStr && rowStr && price >= 0 && link) {
            // Keep only numbered sections and rows
            const section = parseInt(sectionStr, 10);
            const row = parseInt(rowStr, 10);
            if (!Number.isNaN(section) && !Number.isNaN(row)) {
              tickets.push({ section, row, price, quantity, app, link });
            }
          } else {
            failedTicketsCount++;
          }
        });

        return { app, tickets, failedTicketsCount };
      },
      url,
      ticketQuantity,
      this.name,
    );

    await browser.close();
    return scrapeTicketsResult;
  }
}

const gametimeApp = new GametimeApp();
export default gametimeApp;
