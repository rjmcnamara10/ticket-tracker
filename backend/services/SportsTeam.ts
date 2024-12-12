import { Game } from '../types';

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
   * The URL to the full schedule of the sports team.
   * @type {string}
   * @readonly
   */
  readonly scheduleUrl: string;

  /**
   * The name of the home venue of the sports team, as represented on the schedule.
   * @type {string}
   * @readonly
   */
  readonly venueName: string;

  /**
   * The city where the home venue is located, as represented on the schedule.
   * @type {string}
   * @readonly
   */
  readonly venueCity: string;

  /**
   * The state where the home venue is located, as represented on the schedule.
   * @type {string}
   * @readonly
   */
  readonly venueState: string;

  /**
   * Retrieves the home schedule of the sports team.
   *
   * @returns {Promise<Game[]>} A promise that resolves to an array of games representing the home schedule.
   */
  getHomeSchedule(): Promise<Game[]>;
}

export default SportsTeam;
