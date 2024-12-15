import express, { Response } from 'express';
import TicketApp from '../services/ticketApps/TicketApp';
import TickpickApp from '../services/ticketApps/TickpickApp';
import GametimeApp from '../services/ticketApps/GametimeApp';
import { TicketAppName, ScrapeEventUrlsRequest, ScrapeTicketsRequest } from '../types';
import { scrapeEventUrlsSchema, scrapeTicketsSchema } from './validation';

const tickpickApp = new TickpickApp();
const gametimeApp = new GametimeApp();

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
   * @param {ScrapeTicketsRequest} req - The request object containing the app name, URL, ticket quantity, and game ID.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  // refreshTicketsRoute
  const scrapeTicketsRoute = async (req: ScrapeTicketsRequest, res: Response): Promise<void> => {
    const { error } = scrapeTicketsSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { app, url, ticketQuantity, gameId } = req.body;

    try {
      const ticketApp = getTicketApp(app);
      const scrapedTicketsResult = await ticketApp.scrapeTickets(url, ticketQuantity);
      const { tickets, failedTicketsCount, scrapeDateTime } = scrapedTicketsResult;

      if (tickets.length === 0) {
        // Do something
      }
      const ticketsFromDb = await ticketApp.saveTickets(tickets);
      if ('error' in ticketsFromDb) {
        throw new Error(ticketsFromDb.error);
      }

      const gameResponse = await ticketApp.addTicketsToGame(
        gameId,
        ticketsFromDb,
        ticketQuantity,
        scrapeDateTime,
      );
      if ('error' in gameResponse) {
        throw new Error(gameResponse.error);
      }
      const successTicketsCount = tickets.length;
      res.json({
        app: ticketApp.name,
        scrapeDateTime,
        successTicketsCount,
        failedTicketsCount,
        game: gameResponse,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when scraping tickets: ${err.message}`);
      } else {
        res.status(500).send(`Error when scraping tickets`);
      }
    }
  };

  router.post('/scrapeEventUrls', scrapeEventUrlsRoute);
  router.post('/scrapeTickets', scrapeTicketsRoute);

  return router;
};

export default ticketController;
