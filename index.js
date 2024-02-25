const scrapeTickpickTickets = require('./tickpick.js');
const scrapeGametimeTickets = require('./gametime.js');

const TICKET_QUANTITY = 2;

const TICKPICK_URL = `https://www.tickpick.com/buy-boston-celtics-vs-oklahoma-city-thunder-tickets-td-garden-4-3-24-7pm/5887945/?sortType=P&qty=${TICKET_QUANTITY}-false`;
const GAMETIME_URL = 'https://gametime.co/nba-basketball/thunder-at-celtics-tickets/4-3-2024-boston-ma-td-garden/events/64de750e834ac00001acd215';

async function collectTickets() {
    const TICKPICK_TIX = await scrapeTickpickTickets(TICKPICK_URL);
    const GAMETIME_TIX = await scrapeGametimeTickets(GAMETIME_URL, TICKET_QUANTITY);
    const ALL_TIX = TICKPICK_TIX.concat(GAMETIME_TIX);
    
    const onlyMiddleBalconyTix = ALL_TIX.filter(ticket => {
        const sectionNumber = parseInt(ticket.section);
        return (
            (sectionNumber >= 301 && sectionNumber <= 305) ||
            (sectionNumber >= 312 && sectionNumber <= 320) ||
            (sectionNumber >= 327 && sectionNumber <= 330)
        );
    });

    onlyMiddleBalconyTix.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    console.log(onlyMiddleBalconyTix);
}

collectTickets();