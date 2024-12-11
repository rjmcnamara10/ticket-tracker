import express, { Response } from 'express';
import ITicketApp from '../services/ITicketApp';
import TickpickApp from '../services/TickpickApp';
import GametimeApp from '../services/GametimeApp';
import { TicketAppName, ScrapeTicketsRequest } from '../types';
import scrapeTicketsSchema from './validation';

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
   * Returns the appropriate ITicketApp based on the app name.
   *
   * @param {TicketAppName} app - The name of the ticket app.
   * @returns {ITicketApp} The ticket app instance.
   * @throws {Error} Thrown if the app name is invalid.
   */
  function getTicketApp(app: TicketAppName): ITicketApp {
    switch (app) {
      case 'tickpick':
        return tickpickApp;
      case 'gametime':
        return gametimeApp;
      default:
        throw new Error('Invalid app');
    }
  }

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
      const scrapeDateTime = new Date().toISOString();
      const scrapedTicketsResult = await ticketApp.scrapeTickets(url, ticketQuantity);
      const { tickets, failedTicketsCount } = scrapedTicketsResult;
      const successTicketsCount = tickets.length;
      res.json({
        app: ticketApp.name,
        scrapeDateTime,
        successTicketsCount,
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

  router.post('/scrapeTickets', scrapeTicketsRoute);

  return router;
};

export default ticketController;
