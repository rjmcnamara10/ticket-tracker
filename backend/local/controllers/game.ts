import express, { Response } from 'express';
import {
  AddHomeGamesRequest,
  AddTicketAppUrlRequest,
  RefreshTicketsRequest,
  FetchGamesRequest,
} from '../../types';
import {
  addHomeGamesHandler,
  addTicketAppUrlHandler,
  refreshTicketsHandler,
  fetchGamesHandler,
} from '../../handlers/gameHandlers';
import {
  addHomeGamesSchema,
  addTicketAppUrlSchema,
  refreshTicketsSchema,
  fetchGamesSchema,
} from '../../utils/validation';

/**
 * Creates an Express router for handling game-related routes.
 *
 * @returns {express.Router} The Express router with game-related routes.
 */
const gameController = () => {
  const router = express.Router();

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

    try {
      const simplifiedReq: AddHomeGamesRequest = { body: req.body };
      const result = await addHomeGamesHandler(simplifiedReq);
      res.json(result);
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

    try {
      const simplifiedReq: AddTicketAppUrlRequest = { body: req.body };
      const result = await addTicketAppUrlHandler(simplifiedReq);
      res.json(result);
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

    try {
      const simplifiedReq: RefreshTicketsRequest = { body: req.body };
      const result = await refreshTicketsHandler(simplifiedReq);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when refreshing tickets: ${err.message}`);
      } else {
        res.status(500).send(`Error when refreshing tickets`);
      }
    }
  };

  /**
   * Route to fetch games from the database.
   *
   * @param {FetchGamesRequest} req - The request object containing the order type.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const fetchGamesRoute = async (req: FetchGamesRequest, res: Response): Promise<void> => {
    const { error } = fetchGamesSchema.validate(req.query);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    try {
      const simplifiedReq: FetchGamesRequest = { query: req.query };
      const result = await fetchGamesHandler(simplifiedReq);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching games: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching games`);
      }
    }
  };

  router.post('/addHomeGames', addHomeGamesRoute);
  router.post('/addTicketAppUrl', addTicketAppUrlRoute);
  router.post('/refreshTickets', refreshTicketsRoute);
  router.get('/fetchGames', fetchGamesRoute);

  return router;
};

export default gameController;
