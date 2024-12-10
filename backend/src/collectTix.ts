import scrapeTickpickTickets from './tickpick';
import scrapeGametimeTickets from './gametime';
import { Ticket, SectionPoints } from '../types';

const TICKET_QUANTITY = 2;

const TICKPICK_URL = `https://www.tickpick.com/buy-boston-celtics-vs-houston-rockets-tickets-td-garden-1-27-25-7pm/6633531/?sortType=P&qty=${TICKET_QUANTITY}-false`;
const GAMETIME_URL =
  'https://gametime.co/nba-basketball/rockets-at-celtics-tickets/1-27-2025-boston-ma-td-garden/events/66be5db9baf0bf11fcc615ec';

// Maps each section number to a point value (0, 10, 20, 30, or 40)
const sectionPoints: SectionPoints = {
  301: 40,
  302: 40,
  303: 30,
  304: 20,
  305: 10,
  306: 0,
  307: 0,
  308: 0,
  309: 0,
  310: 0,
  311: 0,
  312: 10,
  313: 20,
  314: 30,
  315: 40,
  316: 40,
  317: 40,
  318: 30,
  319: 20,
  320: 10,
  321: 0,
  322: 0,
  323: 0,
  324: 0,
  325: 0,
  326: 0,
  327: 10,
  328: 20,
  329: 30,
  330: 40,
};

async function collectTickets() {
  const tickpickTix = await scrapeTickpickTickets(TICKPICK_URL);
  const gametimeTix = await scrapeGametimeTickets(GAMETIME_URL, TICKET_QUANTITY);
  const allTickets = tickpickTix.concat(gametimeTix);

  // Only keep balcony tickets, sort by price from lowest to highest
  const cheapestTickets = allTickets
    .filter((ticket: Ticket) => ticket.section >= 301 && ticket.section <= 330)
    .sort((a, b) => a.price - b.price);

  const rankedTickets = cheapestTickets.map((ticket: Ticket) => {
    const locationPoints = sectionPoints[ticket.section] + (15 - ticket.row);
    return {
      ...ticket,
      locationPoints,
    };
  });

  const valueTickets = rankedTickets.filter(ticket => ticket.locationPoints >= 10);
  return { cheapestTickets, valueTickets };
}

// async function test() {
//   const { cheapestTickets, valueTickets } = await collectTickets();
//   fs.writeFileSync('cheapest_tix_test.json', JSON.stringify(cheapestTickets, null, 2));
//   fs.writeFileSync('value_tix_test.json', JSON.stringify(valueTickets, null, 2));
// }
// test();

export default collectTickets;
