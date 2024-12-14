import axios from 'axios';
import SportsTeam from './SportsTeam';
import GameModel from '../../models/game';
import { Game, saveGamesResponse } from '../../types';
import isMongoDuplicateKeyError from '../../utils';

/**
 * Class to represent the Boston Celtics sports team
 */
class BostonCeltics implements SportsTeam {
  readonly name: string;

  constructor() {
    this.name = 'Boston Celtics';
  }

  async getRemainingHomeGames(): Promise<Game[]> {
    const venue = 'TD Garden';
    const city = 'Boston';
    const state = 'MA';
    const now = new Date();

    const remainingHomeSchedule: Game[] = [];
    const { data } = await axios.get(
      'https://cdn.celtics.com/evergreen/dotcom/schedule/v2024/2024_celtics_schedule.json',
    );
    const allGames = data.data.gscd.g;
    for (const game of allGames) {
      const gameDay = new Date(`${game.gdte}T23:59:59`);
      const isFutureGame = gameDay > now;
      const isHomeGame = game.an === venue && game.ac === city && game.as === state;
      if (isFutureGame && isHomeGame) {
        const futureHomeGame: Game = {
          homeTeam: this.name,
          awayTeam: `${game.v.tc} ${game.v.tn}`,
          startDateTime: game.etm,
          venue,
          city,
          state,
          tickets: [],
        };
        remainingHomeSchedule.push(futureHomeGame);
      }
    }
    return remainingHomeSchedule;
  }

  async saveGames(games: Game[]): Promise<saveGamesResponse> {
    try {
      const savePromises = games.map(async game => {
        try {
          const gameFromDb = await GameModel.create(game);
          return gameFromDb;
        } catch (err: unknown) {
          if (isMongoDuplicateKeyError(err)) {
            return null; // Games that already exist will return null
          }
          throw err;
        }
      });

      const savedGames = await Promise.all(savePromises);
      const filteredSavedGames = savedGames.filter(game => game !== null);
      return filteredSavedGames;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: err.message };
      }
      return { error: 'Error saving games' };
    }
  }
}

export default BostonCeltics;
