import SportsTeam from './SportsTeam';
import GameModel from '../../models/game';
import { Game, saveGamesResponse } from '../../types';
import isMongoDuplicateKeyError from '../../utils';

/**
 * Abstract class representing a sports team.
 *
 * @abstract
 * @implements {SportsTeam}
 */
abstract class AbstractSportsTeam implements SportsTeam {
  abstract readonly name: string;

  abstract getRemainingHomeGames(): Promise<Game[]>;

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

export default AbstractSportsTeam;
