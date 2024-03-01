const fs = require('fs');
const scrapeTickpickTickets = require('./tickpick.js');
const scrapeGametimeTickets = require('./gametime.js');

const TICKET_QUANTITY = 3;

const TICKPICK_URL = `https://www.tickpick.com/buy-boston-celtics-vs-oklahoma-city-thunder-tickets-td-garden-4-3-24-7pm/5887945/?sortType=P&qty=${TICKET_QUANTITY}-false`;
const GAMETIME_URL = 'https://gametime.co/nba-basketball/thunder-at-celtics-tickets/4-3-2024-boston-ma-td-garden/events/64de750e834ac00001acd215';

// Maps each section number to a point value (0, 10, 20, 30, or 40)
const sectionPoints = {
    301: 40, 302: 40, 303: 30, 304: 20, 305: 10,
    306: 0, 307: 0, 308: 0, 309: 0, 310: 0,
    311: 0, 312: 10, 313: 20, 314: 30, 315: 40,
    316: 40, 317: 40, 318: 30, 319: 20, 320: 10,
    321: 0, 322: 0, 323: 0, 324: 0, 325: 0, 
    326: 0, 327: 10, 328: 20, 329: 30, 330: 40
}

async function collectTickets() {
    const tickpickTix = await scrapeTickpickTickets(TICKPICK_URL);
    const gametimeTix = await scrapeGametimeTickets(GAMETIME_URL, TICKET_QUANTITY);
    const allTickets = tickpickTix.concat(gametimeTix);

    const rankedTickets = allTickets
        .filter(ticket => ticket.section >= 301 && ticket.section <= 330) // only keep balcony tickets
        .map(ticket => {
            const locationPoints = sectionPoints[ticket.section] + (15 - ticket.row);
            return {
                ...ticket,
                locationPoints: locationPoints
            };
        });

    const candidateTickets = rankedTickets.filter(ticket => ticket.locationPoints >= 10);

    // Sort by price from lowest to highest
    candidateTickets.sort((a, b) => a.price - b.price);
    // fs.writeFileSync('tix_by_price.json', JSON.stringify(candidateTickets, null, 2));
    return candidateTickets;
}

// collectTickets();