const puppeteer = require('puppeteer');

const TICKET_QUANTITY = 0;

async function scrapeTickets(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Set custom user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');
    await page.goto(url);
    // Print page title
    const title = await page.title();
    console.log("Page Title:", title);

    // Wait for the listings container to load
    await page.waitForSelector('#listingContainer');

    // Insert a delay (in milliseconds) to ensure content has loaded
    await page.evaluate(() => {
        return new Promise(resolve => {
            setTimeout(resolve, 3000); // Adjust this delay as needed
        });
    });

    // Print the inner HTML of the listingContainer
    const listingContainerHTML = await page.$eval('#listingContainer', container => container.innerHTML);
    // console.log(listingContainerHTML);

    // Extract ticket information
    const ticketInfo = await page.evaluate(() => {
        const tickets = [];
        const ticketElements = document.querySelectorAll('.listing');

        ticketElements.forEach(ticketElement => {
            // Extract section and row
            const sectionRowText = ticketElement.querySelector('.sout span').textContent;
            const [section, row] = sectionRowText.match(/Section (\d+) • Row (\d+)/).slice(1, 3);

            // Extract price
            const price = ticketElement.querySelector('label > b').textContent.trim();

            // Extract quantity
            const quantity = ticketElement.querySelector('select').value;

            tickets.push({ section, row, price, quantity });
        });

        return tickets;
    });

    await browser.close();
    return ticketInfo;
}

// Example usage:
const url = `https://www.tickpick.com/buy-boston-celtics-vs-oklahoma-city-thunder-tickets-td-garden-4-3-24-7pm/5887945/?sortType=P&qty=${TICKET_QUANTITY}-false`;
scrapeTickets(url)
    .then(ticketInfo => {
        console.log(ticketInfo);
    })
    .catch(error => {
        console.error('Error scraping tickets:', error);
    });
