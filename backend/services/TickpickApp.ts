import puppeteer from 'puppeteer';
import ITicketApp from './ITicketApp';
import { Ticket, ScrapeTicketsResult } from '../types';

/**
 * Class to represent the Tickpick ticket resale app.
 */
class TickpickApp implements ITicketApp {
  readonly name: string;

  constructor() {
    this.name = 'Tickpick';
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
              tickets.push({ section, row, price, app, link });
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
