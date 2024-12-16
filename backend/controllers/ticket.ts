import express, { Response } from 'express';
import TicketApp from '../services/ticketApps/TicketApp';
import tickpickApp from '../services/ticketApps/TickpickApp';
import gametimeApp from '../services/ticketApps/GametimeApp';
import { TicketAppName, ScrapeEventUrlsRequest } from '../types';
import { scrapeEventUrlsSchema } from './validation';

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

  router.post('/scrapeEventUrls', scrapeEventUrlsRoute);

  return router;
};

export default ticketController;
