import express, { Response } from 'express';
import getHomeSchedule from '../services/schedule';
import { HomeScheduleRequest } from '../types';
import { homeScheduleSchema } from './validation';

/**
 * Creates an Express router for handling schedule-related routes.
 *
 * @returns {express.Router} The Express router with schedule-related routes.
 */
const scheduleController = () => {
  const router = express.Router();

  /**
   * Route to retrieve the home schedule of a sports team.
   *
   * @param {HomeScheduleRequest} req - The request object containing the URL and home arena information.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const homeScheduleRoute = async (req: HomeScheduleRequest, res: Response): Promise<void> => {
    const { error } = homeScheduleSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { url, arenaName, arenaCity, arenaState } = req.body;

    try {
      const homeSchedule = await getHomeSchedule(url, arenaName, arenaCity, arenaState);
      res.json({
        message: 'Home schedule retrieved successfully',
        homeSchedule,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when retrieving home schedule: ${err.message}`);
      } else {
        res.status(500).send(`Error when retrieving home schedule`);
      }
    }
  };

  router.post('/homeSchedule', homeScheduleRoute);

  return router;
};

export default scheduleController;
