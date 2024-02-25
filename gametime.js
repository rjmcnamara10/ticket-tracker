const puppeteer = require('puppeteer');

const TICKET_QUANTITY = 0;

async function scrapeTickets(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set custom user agent
    await page.goto(url);

    // // Check if all-in pricing is enabled
    // const allInPricingEnabled = await page.evaluate(() => {
    //     const allInPricingElement = document.querySelector('[data-testid="all-in-pricing"]');
    //     return allInPricingElement.classList.contains('_2amR4x2ztZ5dL7PJxn7oJo');
    // });

    // // If all-in pricing is enabled, click the button
    // if (allInPricingEnabled) {
    //     await page.click('[data-testid="all-in-pricing"]');
    //     // Wait for some time to let the page content update
    //     await page.waitForTimeout(2000); // Adjust this delay as needed
    // }

    // Extract ticket information
    const ticketInfo = await page.evaluate(() => {
        const tickets = [];
        const ticketElements = document.querySelectorAll('._2h7x6MAQ0R9rPi2f7MFJXo');

        ticketElements.forEach(ticketElement => {
            // Extract section and row
            const sectionRowText = ticketElement.querySelector('._1EShqotjRsBqatpuDDtfZ7').textContent;
            const matchResult = sectionRowText.match(/(\d+), Row (\d+)/);
            if (matchResult) {
                const [section, row] = matchResult.slice(1, 3);

                // Extract price
                const price = ticketElement.querySelector('._1Ez1uMaistdU48Vpp8XeO2 span').textContent.trim();
                // const priceElements = ticketElement.querySelectorAll('._1Ez1uMaistdU48Vpp8XeO2 span');
                // let price = null;
                // if (priceElements.length > 1) {
                //     const lastPriceElement = priceElements[priceElements.length - 2];
                //     price = lastPriceElement.textContent.trim();
                //     // price = priceText.replace(/\D/g, '');
                // }

                tickets.push({ section, row, price });
            }
        });

        return tickets;
    });

    await browser.close();
    return ticketInfo;
}

const url = `https://gametime.co/nba-basketball/thunder-at-celtics-tickets/4-3-2024-boston-ma-td-garden/events/64de750e834ac00001acd215`;
scrapeTickets(url)
    .then(ticketInfo => {
        console.log(ticketInfo);
    })
    .catch(error => {
        console.error('Error scraping tickets:', error);
    });