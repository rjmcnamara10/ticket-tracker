const scrapeTickpickTickets = require('./tickpick.js');
const scrapeGametimeTickets = require('./gametime.js');

const TICKET_QUANTITY = 2;

const TICKPICK_URL = `https://www.tickpick.com/buy-boston-celtics-vs-milwaukee-bucks-tickets-td-garden-10-28-24-7pm/6633486/?sortType=P&qty=${TICKET_QUANTITY}-false`;
const GAMETIME_URL = 'https://gametime.co/nba-basketball/bucks-at-celtics-tickets/10-28-2024-boston-ma-td-garden/events/66be5a25c3fc796135b228a5';

// Maps each section number to a point value (0, 10, 20, 30, or 40)
const sectionPoints = {
    301: 40, 302: 40, 303: 30, 304: 20, 305: 10,
    306: 0, 307: 0, 308: 0, 309: 0, 310: 0,
    311: 0, 312: 10, 313: 20, 314: 30, 315: 40,
    316: 40, 317: 40, 318: 30, 319: 20, 320: 10,
    321: 0, 322: 0, 323: 0, 324: 0, 325: 0,
    326: 0, 327: 10, 328: 20, 329: 30, 330: 40
}

exports.handler = async (event) => {
    try {
        const tickpickTix = await scrapeTickpickTickets(TICKPICK_URL);
        const gametimeTix = await scrapeGametimeTickets(GAMETIME_URL, TICKET_QUANTITY);
        const allTickets = tickpickTix.concat(gametimeTix);

        // Only keep balcony tickets, sort by price from lowest to highest
        const cheapestTickets = allTickets
            .filter(ticket => ticket.section >= 301 && ticket.section <= 330)
            .sort((a, b) => a.price - b.price);

        const rankedTickets = cheapestTickets.map(ticket => {
            const locationPoints = sectionPoints[ticket.section] + (15 - ticket.row);
            return {
                ...ticket,
                locationPoints: locationPoints
            };
        });

        const valueTickets = rankedTickets.filter(ticket => ticket.locationPoints >= 10);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ cheapestTickets, valueTickets }),
        };
    } catch (error) {
        console.error('Error in collectTickets function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to collect tickets' }),
        };
    }
};
