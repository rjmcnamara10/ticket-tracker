import puppeteer from 'puppeteer';
import { Ticket } from '../types';

async function scrapeTickpickTickets(url: string): Promise<Ticket[]> {
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
  const result = await page.evaluate(pageUrl => {
    const tickets: Ticket[] = [];
    const app = 'tickpick';
    const link = pageUrl; // Tickpick does not have a separate link for tickets
    let failureCount = 0;

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
          failureCount++;
        }
      } catch (error) {
        failureCount++;
      }
    });

    return { tickets, failureCount };
  }, url);

  await browser.close();

  const { tickets, failureCount } = result;
  if (failureCount > 0) {
    console.log(`Failed to extract ${failureCount} ticket(s) from Tickpick`);
  }
  return tickets;
}

export default scrapeTickpickTickets;
