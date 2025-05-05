import {
  getGameById,
  saveGames,
  saveTickets,
  addTicketAppUrlToGame,
  addTicketsToGame,
  populateGameDocument,
  fetchGamesByOrder,
} from '../services/database';
import SportsTeam from '../services/sportsTeams/SportsTeam';
import bostonCeltics from '../services/sportsTeams/BostonCeltics';
import TicketApp from '../services/ticketApps/TicketApp';
import tickpickApp from '../services/ticketApps/TickpickApp';
import gametimeApp from '../services/ticketApps/GametimeApp';
import {
  Ticket,
  SportsTeamName,
  IncompleteTicketApp,
  AddHomeGamesRequest,
  AddTicketAppUrlRequest,
  RefreshTicketsRequest,
  FetchGamesRequest,
} from '../types';

/**
 * Returns the appropriate SportsTeam based on the team name.
 *
 * @param {SportsTeamName} team - The name of the team.
 * @returns {SportsTeam} The sports team instance.
 * @throws {Error} Thrown if the team is invalid.
 */
function getSportsTeam(team: SportsTeamName): SportsTeam {
  switch (team) {
    case 'celtics':
      return bostonCeltics;
    default:
      throw new Error('Invalid team');
  }
}

/**
 * Returns an array of TicketApps.
 *
 * @returns {TicketApp[]} The array of ticket apps.
 */
function getTicketApps(): TicketApp[] {
  return [tickpickApp, gametimeApp];
}

/**
 * Adds home games for a given sports team.
 *
 * @param {AddHomeGamesRequest} req - The request object containing the team name.
 * @returns {Promise} A Promise that resolves to an object containing a success message, the team name, and the new games.
 */
const addHomeGamesHandler = async (req: AddHomeGamesRequest) => {
  const { team } = req.body;

  const sportsTeam = getSportsTeam(team);
  const remainingHomeSchedule = await sportsTeam.getRemainingHomeGames();
  const saveResult = await saveGames(remainingHomeSchedule);
  if ('error' in saveResult) {
    throw new Error(`Error saving games: ${saveResult.error}`);
  }
  return {
    message: `${saveResult.length} new game(s) saved`,
    team: sportsTeam.name,
    newGames: saveResult,
  };
};

/**
 * Adds a ticket app URL to a game.
 *
 * @param {AddTicketAppUrlRequest} req - The request object containing the game ID, app name, and ticket app URL.
 * @returns {Promise} A Promise that resolves to an object containing a success message and the updated game.
 */
const addTicketAppUrlHandler = async (req: AddTicketAppUrlRequest) => {
  const { gameId, app, ticketAppUrl } = req.body;

  const gameFromDb = await addTicketAppUrlToGame(gameId, app, ticketAppUrl);
  if ('error' in gameFromDb) {
    throw new Error(gameFromDb.error);
  }
  return {
    message: 'Ticket app URL added successfully',
    game: gameFromDb,
  };
};

/**
 * Refreshes the tickets for a given game.
 *
 * @param {RefreshTicketsRequest} req - The request object containing the game ID and ticket quantity.
 * @returns {Promise} A Promise that resolves to an object containing a success message and the updated game.
 */
const refreshTicketsHandler = async (req: RefreshTicketsRequest) => {
  const { gameId, ticketQuantity } = req.body;

  const game = await getGameById(gameId);
  if ('error' in game) {
    throw new Error(game.error);
  }

  const { ticketAppUrls } = game;
  if (ticketAppUrls.length === 0) {
    throw new Error('No ticket app URLs found for this game');
  }

  const ticketApps = getTicketApps();
  const incompleteTicketApps: IncompleteTicketApp[] = [];
  const scrapePromises = ticketApps.map(ticketApp => {
    const ticketsPage = ticketAppUrls.find(appUrlObj => appUrlObj.app === ticketApp.name);
    if (!ticketsPage) {
      incompleteTicketApps.push({
        app: ticketApp.name,
        reason: 'Game does not contain URL for this app',
      });
      return Promise.resolve({ app: ticketApp.name, tickets: [], failedTicketsCount: 0 });
    }
    return ticketApp.scrapeTickets(ticketsPage.gameUrl, ticketQuantity);
  });

  const scrapeDateTime = new Date();
  const scrapedTicketsResults = await Promise.all(scrapePromises);
  const allTickets: Ticket[] = [];
  const failedTickets = [];
  for (const scrapedTicketsResult of scrapedTicketsResults) {
    const { app, tickets, failedTicketsCount } = scrapedTicketsResult;
    if (tickets.length === 0) {
      const existingEntry = incompleteTicketApps.some(entry => entry.app === app);
      if (!existingEntry) {
        incompleteTicketApps.push({
          app,
          reason: 'Scrape returned zero tickets',
        });
      }
    } else {
      allTickets.push(...tickets);
    }
    failedTickets.push({ app, failedTicketsCount });
  }

  if (allTickets.length === 0) {
    throw new Error('No tickets found for this game');
  }

  const ticketsFromDb = await saveTickets(allTickets);
  if ('error' in ticketsFromDb) {
    throw new Error(ticketsFromDb.error);
  }

  const gameResponse = await addTicketsToGame(
    gameId,
    ticketsFromDb,
    ticketQuantity,
    scrapeDateTime,
  );
  if ('error' in gameResponse) {
    throw new Error(gameResponse.error);
  }

  const populatedGame = await populateGameDocument(gameResponse._id?.toString());
  if ('error' in populatedGame) {
    throw new Error(populatedGame.error);
  }

  return {
    scrapeDateTime,
    successTicketsCount: ticketsFromDb.length,
    failedTickets,
    incompleteTicketApps,
    game: populatedGame,
  };
};

/**
 * Fetches games from the database based on the specified order.
 *
 * @param {FetchGamesRequest} req - The request object containing the order type.
 * @returns {Promise} A Promise that resolves to an object containing a success message and the fetched games.
 */
const fetchGamesHandler = async (req: FetchGamesRequest) => {
  const { order } = req.query;

  const games = await fetchGamesByOrder(order);
  if ('error' in games) {
    throw new Error(games.error);
  }
  return {
    message: 'Games fetched successfully',
    order,
    games,
  };
};

export { addHomeGamesHandler, addTicketAppUrlHandler, refreshTicketsHandler, fetchGamesHandler };
