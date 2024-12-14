import express, { Response } from 'express';
import SportsTeam from '../services/sportsTeams/SportsTeam';
import BostonCeltics from '../services/sportsTeams/BostonCeltics';
import { SportsTeamName, HomeScheduleRequest } from '../types';
import { homeScheduleSchema } from './validation';

const celtics = new BostonCeltics();

/**
 * Creates an Express router for handling sports team-related routes.
 *
 * @returns {express.Router} The Express router with sports team-related routes.
 */
const teamController = () => {
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
        return celtics;
      default:
        throw new Error('Invalid team');
    }
  }

  /**
   * Route to add future home games of a sports team to the database if they do not already exist.
   *
   * @param {HomeScheduleRequest} req - The request object containing the team name.
   * @param {Response} res - The HTTP response object used to send back the result of the operation.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  const updateGamesRoute = async (req: HomeScheduleRequest, res: Response): Promise<void> => {
    const { error } = homeScheduleSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const { team } = req.body;

    try {
      const sportsTeam = getSportsTeam(team);
      const remainingHomeSchedule = await sportsTeam.getRemainingHomeGames();
      const saveResult = await sportsTeam.saveGames(remainingHomeSchedule);
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

  router.post('/updateGames', updateGamesRoute);

  return router;
};

export default teamController;
