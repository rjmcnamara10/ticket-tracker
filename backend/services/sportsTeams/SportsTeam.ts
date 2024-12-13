import { Game } from '../../types';

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
}

export default SportsTeam;
