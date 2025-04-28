import express, { Response } from 'express';
import { fetchTicketsByOrder } from '../services/database';
import TicketApp from '../services/ticketApps/TicketApp';
import tickpickApp from '../services/ticketApps/TickpickApp';
import gametimeApp from '../services/ticketApps/GametimeApp';
import {
  TicketAppName,
  ScrapeEventUrlsRequest,
  ScrapeTicketsRequest,
  FetchTicketsRequest,
} from '../types';
import { scrapeEventUrlsSchema, scrapeTicketsSchema, fetchTicketsSchema } from './validation';

/**
 * Creates an Express router for handling ticket-related routes.
 *
 * @returns {express.Router} The Express router with ticket-related routes.
 */
const ticketController = () => {
  const router = express.Router();

  /**
   * Returns the appropriate TicketApp based on the app name.
   *
   * @param {TicketAppName} app - The name of the ticket app.
   * @returns {TicketApp} The ticket app instance.
   * @throws {Error} Thrown if the app name is invalid.
   */
  function getTicketApp(app: TicketAppName): TicketApp {
    switch (app) {
      case 'Tickpick':
        return tickpickApp;
      case 'Gametime':
        return gametimeApp;
      default:
        throw new Error('Invalid app');
    }
  }

  /**
   * Route to scrape event URLs from a ticket resale app.
   *
   * @param {ScrapeEventUrlsRequest} req - The request object containing the app name.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const scrapeEventUrlsRoute = async (
    req: ScrapeEventUrlsRequest,
    res: Response,
  ): Promise<void> => {
    const { error } = scrapeEventUrlsSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { app } = req.body;

    try {
      const ticketApp = getTicketApp(app);
      const eventUrls = await ticketApp.scrapeEventUrls();
      res.json({
        message: `${ticketApp.name} event URLs scraped successfully`,
        eventUrls,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when scraping event URLs: ${err.message}`);
      } else {
        res.status(500).send(`Error when scraping event URLs`);
      }
    }
  };

  /**
   * Route to scrape tickets from a ticket resale app.
   *
   * @param {ScrapeTicketsRequest} req - The request object containing the app name, URL, and ticket quantity.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const scrapeTicketsRoute = async (req: ScrapeTicketsRequest, res: Response): Promise<void> => {
    const { error } = scrapeTicketsSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { app, url, ticketQuantity } = req.body;

    try {
      const ticketApp = getTicketApp(app);
      const { tickets, failedTicketsCount } = await ticketApp.scrapeTickets(url, ticketQuantity);
      res.json({
        app: ticketApp.name,
        successTicketsCount: tickets.length,
        failedTicketsCount,
        tickets,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when scraping tickets: ${err.message}`);
      } else {
        res.status(500).send(`Error when scraping tickets`);
      }
    }
  };

  /**
   * Route to fetch tickets for a game from the database.
   *
   * @param {FetchTicketsRequest} req - The request object containing the order type, game ID, and ticket quantity.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const fetchTicketsRoute = async (req: FetchTicketsRequest, res: Response): Promise<void> => {
    const { error } = fetchTicketsSchema.validate(req.query);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { gameId, ticketQuantity } = req.query;

    try {
      const ticketQuantityNumber = parseInt(ticketQuantity, 10);
      const fetchTixRes = await fetchTicketsByOrder(gameId, ticketQuantityNumber);
      if ('error' in fetchTixRes) {
        throw new Error(fetchTixRes.error);
      }

      res.json({
        message: 'Tickets fetched successfully',
        ...fetchTixRes,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(err.message);
      } else {
        res.status(500).send(`Error when fetching tickets`);
      }
    }
  };

  router.post('/scrapeEventUrls', scrapeEventUrlsRoute);
  router.post('/scrapeTickets', scrapeTicketsRoute);
  router.get('/fetchTickets', fetchTicketsRoute);

  return router;
};

export default ticketController;
