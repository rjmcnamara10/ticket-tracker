import puppeteer from 'puppeteer';
import { Ticket } from '../types';

async function scrapeGametimeTickets(url: string, ticketQuantity: number): Promise<Ticket[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set custom user agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
  );
  await page.goto(url);

  // Select the quantity of tickets (default is 2)
  if (ticketQuantity !== 2) {
    const dropdownMenuSelector = 'div._3jbsE7bPH2773pyaT0ayCf > div:nth-child(2)';
    await page.waitForSelector(dropdownMenuSelector);
    const dropdownMenu = await page.$(dropdownMenuSelector);
    if (dropdownMenu) {
      await dropdownMenu.click();
    }
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    const ticketsOptionSelector = `div._1WI7N_Bs_b0gkDH7dzIdkV > div:nth-child(${ticketQuantity})`;
    await page.waitForSelector(ticketsOptionSelector);
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
  const result = await page.evaluate(pageUrl => {
    const tickets: Ticket[] = [];
    const app = 'gametime';
    let failureCount = 0;

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
          tickets.push({ section, row, price, app, link });
        }
      } else {
        failureCount++;
      }
    });

    return { tickets, failureCount };
  }, url);

  await browser.close();

  const { tickets, failureCount } = result;
  if (failureCount > 0) {
    console.log(`Failed to extract ${failureCount} ticket(s) from Gametime`);
  }

  return tickets;
}

export default scrapeGametimeTickets;
