import express, { Response } from 'express';
import { ScrapeEventUrlsRequest, ScrapeTicketsRequest, FetchTicketsRequest } from '../../types';
import {
  scrapeEventUrlsHandler,
  scrapeTicketsHandler,
  fetchTicketsHandler,
} from '../../handlers/ticketHandlers';
import {
  scrapeEventUrlsSchema,
  scrapeTicketsSchema,
  fetchTicketsSchema,
} from '../../utils/validation';

/**
 * Creates an Express router for handling ticket-related routes.
 *
 * @returns {express.Router} The Express router with ticket-related routes.
 */
const ticketController = () => {
  const router = express.Router();

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

    try {
      const simplifiedReq: ScrapeEventUrlsRequest = { body: req.body };
      const result = await scrapeEventUrlsHandler(simplifiedReq);
      res.json(result);
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

    try {
      const simplifiedReq: ScrapeTicketsRequest = { body: req.body };
      const result = await scrapeTicketsHandler(simplifiedReq);
      res.json(result);
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

    try {
      const simplifiedReq: FetchTicketsRequest = { query: req.query };
      const result = await fetchTicketsHandler(simplifiedReq);
      res.json(result);
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
