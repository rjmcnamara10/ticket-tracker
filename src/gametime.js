const puppeteer = require('puppeteer');

async function scrapeGametimeTickets(url, ticketQuantity) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set custom user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');
    await page.goto(url);

    // Select the quantity of tickets (default is 2)
    if (ticketQuantity != 2) {
        const dropdownMenuSelector = 'div._3jbsE7bPH2773pyaT0ayCf > div:nth-child(2)';
        await page.waitForSelector(dropdownMenuSelector);
        const dropdownMenu = await page.$(dropdownMenuSelector);
        await dropdownMenu.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        const ticketsOptionSelector = `div._1WI7N_Bs_b0gkDH7dzIdkV > div:nth-child(${ticketQuantity})`;
        await page.waitForSelector(ticketsOptionSelector);
        await page.click(ticketsOptionSelector);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Select 'all-in pricing'
    const allInPricingEnabled = await page.evaluate(() => {
        const allInPricingElement = document.querySelector('[data-testid="all-in-pricing"]');
        return allInPricingElement.classList.contains('_2amR4x2ztZ5dL7PJxn7oJo');
    });
    if (!allInPricingEnabled) {
        await page.click('[data-testid="all-in-pricing"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Extract ticket information
    const ticketInfo = await page.evaluate(() => {
        const tickets = [];
        const app = 'gametime';
        const ticketElements = document.querySelectorAll('._2h7x6MAQ0R9rPi2f7MFJXo');

        ticketElements.forEach(ticketElement => {
            // Extract section and row
            const sectionRowText = ticketElement.querySelector('._1EShqotjRsBqatpuDDtfZ7').textContent;
            const matchResult = sectionRowText.match(/(\d+), Row (\d+)/);
            if (matchResult) {
                const [sectionStr, rowStr] = matchResult.slice(1, 3);
                const section = parseInt(sectionStr);
                const row = parseInt(rowStr);

                // Extract price
                const priceElement = ticketElement.querySelector('._1Ez1uMaistdU48Vpp8XeO2');
                const priceText = priceElement ? priceElement.lastElementChild.textContent : 'Price not found';
                const price = parseInt(priceText.trim().replace(/^\$|\/ea$/g, ''));

                // Extract link
                const linkElement = ticketElement.querySelector('a.P9HDgcQ4UjHeuRYFOe6DC');
                const link = linkElement.href;

                tickets.push({ section, row, price, app, link });
            }
        });

        return tickets;
    });

    await browser.close();
    return ticketInfo;
}

module.exports = scrapeGametimeTickets;