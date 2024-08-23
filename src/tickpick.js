const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeTickpickTickets(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set custom user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');
    await page.goto(url);

    // Wait for the listings container to load
    await page.waitForSelector('#listingContainer');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract ticket information
    const ticketInfo = await page.evaluate((url) => {
        const tickets = [];
        const app = 'tickpick';
        const ticketElements = document.querySelectorAll('.listing');
        // return ticketElements.length;
        return ticketElements[20];

        // ticketElements.forEach(ticketElement => {
        //     // Extract section and row
        //     const sectionRowText = ticketElement.querySelector('.sout span').textContent;
        //     const [sectionStr, rowStr] = sectionRowText.match(/Section (\d+) • Row (\d+)/).slice(1, 3);
        //     const section = parseInt(sectionStr);
        //     const row = parseInt(rowStr);

        //     // Extract price
        //     const priceText = ticketElement.querySelector('label > b').textContent.trim();
        //     const price = parseInt(priceText.replace(/^\$/, ''));

        //     // Tickpick does not have a separate link for tickets
        //     const link = url;

        //     tickets.push({ section, row, price, app, link });
        // });

        // return tickets;
    }, url);

    await browser.close();
    return ticketInfo;
}

async function test() {
    const TICKPICK_URL = `https://www.tickpick.com/buy-boston-celtics-vs-milwaukee-bucks-tickets-td-garden-10-28-24-7pm/6633486/?sortType=P&qty=2-false`;
    const tickpickTix = await scrapeTickpickTickets(TICKPICK_URL);
    console.log(tickpickTix);
    // fs.writeFileSync('testing.json', JSON.stringify(tickpickTix, null, 2));
}
test();

module.exports = scrapeTickpickTickets;