import { Game, saveGamesResponse } from '../../types';

/**
 * Interface representing a sports team.
 */
interface SportsTeam {
  /**
   * The full name of the sports team.
   * @type {string}
   * @readonly
   */
  readonly name: string;

  /**
   * Retrieves the home schedule of the sports team.
   *
   * @returns {Promise<Game[]>} A promise that resolves to an array of games representing the home schedule.
   */
  getHomeSchedule(): Promise<Game[]>;

  /**
   * Saves a list of games to the database.
   *
   * @param {Game[]} games - The list of games to save.
   * @returns {Promise<saveGamesResponse>} A promise that resolves to an object indicating success or error message.
   */
  saveGames(games: Game[]): Promise<saveGamesResponse>;
}

export default SportsTeam;
