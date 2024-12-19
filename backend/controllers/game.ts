import express, { Response } from 'express';
import {
  getGameById,
  saveGames,
  saveTickets,
  addTicketAppUrlToGame,
  addTicketsToGame,
  populateGameDocument,
} from '../services/database';
import SportsTeam from '../services/sportsTeams/SportsTeam';
import bostonCeltics from '../services/sportsTeams/BostonCeltics';
import TicketApp from '../services/ticketApps/TicketApp';
import tickpickApp from '../services/ticketApps/TickpickApp';
import gametimeApp from '../services/ticketApps/GametimeApp';
import {
  Ticket,
  SportsTeamName,
  AddHomeGamesRequest,
  AddTicketAppUrlRequest,
  RefreshTicketsRequest,
  IncompleteTicketApp,
} from '../types';
import { addHomeGamesSchema, addTicketAppUrlSchema, refreshTicketsSchema } from './validation';

/**
 * Creates an Express router for handling game-related routes.
 *
 * @returns {express.Router} The Express router with game-related routes.
 */
const gameController = () => {
  const router = express.Router();

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
   * Route to add future home games of a sports team to the database if they do not already exist.
   *
   * @param {AddHomeGamesRequest} req - The request object containing the team name.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const addHomeGamesRoute = async (req: AddHomeGamesRequest, res: Response): Promise<void> => {
    const { error } = addHomeGamesSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { team } = req.body;

    try {
      const sportsTeam = getSportsTeam(team);
      const remainingHomeSchedule = await sportsTeam.getRemainingHomeGames();
      const saveResult = await saveGames(remainingHomeSchedule);
      if ('error' in saveResult) {
        throw new Error(`Error saving games: ${saveResult.error}`);
      }
      res.json({
        message: `${saveResult.length} new game(s) saved`,
        team: sportsTeam.name,
        newGames: saveResult,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error updating games: ${err.message}`);
      } else {
        res.status(500).send(`Error updating games`);
      }
    }
  };

  /**
   * Route to add a ticket app URL to a game in the database, or modify the URL if it already exists.
   *
   * @param {AddTicketAppUrlRequest} req - The request object containing the game ID, ticket app, and ticket app URL.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const addTicketAppUrlRoute = async (
    req: AddTicketAppUrlRequest,
    res: Response,
  ): Promise<void> => {
    const { error } = addTicketAppUrlSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { gameId, app, ticketAppUrl } = req.body;

    try {
      const gameFromDb = await addTicketAppUrlToGame(gameId, app, ticketAppUrl);
      if ('error' in gameFromDb) {
        throw new Error(gameFromDb.error);
      }
      res.json({
        message: 'Ticket app URL added successfully',
        game: gameFromDb,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when adding ticket app URL: ${err.message}`);
      } else {
        res.status(500).send(`Error when adding ticket app URL`);
      }
    }
  };

  /**
   * Route to refresh the available tickets for a game.
   *
   * @param {RefreshTicketsRequest} req - The request object containing the game ID and ticket quantity.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const refreshTicketsRoute = async (req: RefreshTicketsRequest, res: Response): Promise<void> => {
    const { error } = refreshTicketsSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { gameId, ticketQuantity } = req.body;

    try {
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

      res.json({
        scrapeDateTime,
        successTicketsCount: ticketsFromDb.length,
        failedTickets,
        incompleteTicketApps,
        game: populatedGame,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when refreshing tickets: ${err.message}`);
      } else {
        res.status(500).send(`Error when refreshing tickets`);
      }
    }
  };

  router.post('/addHomeGames', addHomeGamesRoute);
  router.post('/addTicketAppUrl', addTicketAppUrlRoute);
  router.post('/refreshTickets', refreshTicketsRoute);

  return router;
};

export default gameController;
