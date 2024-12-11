import axios from 'axios';
import { Game } from '../types';

/**
 * Retrieves the home schedule of a sports team.
 *
 * @param {string} url - The URL to the schedule in JSON format.
 * @param {string} arenaName - The name of the home arena, as represented on the schedule.
 * @param {string} arenaCity - The city where the arena is located, as represented on the schedule.
 * @param {string} arenaState - The state where the arena is located, as represented on the schedule.
 * @returns {Promise<Game[]>} A promise that resolves to an array of games representing the home schedule.
 */
async function getHomeSchedule(
  url: string,
  arenaName: string,
  arenaCity: string,
  arenaState: string,
): Promise<Game[]> {
  const homeSchedule: Game[] = [];
  const { data } = await axios.get(url);
  const allGames = data.data.gscd.g;
  for (const game of allGames) {
    if (game.an === arenaName && game.ac === arenaCity && game.as === arenaState) {
      const homeGame: Game = {
        date: game.gdte,
        time: game.stt,
        homeTeamCity: game.h.tc,
        homeTeamName: game.h.tn,
        awayTeamCity: game.v.tc,
        awayTeamName: game.v.tn,
      };
      homeSchedule.push(homeGame);
    }
  }

  return homeSchedule;
}

export default getHomeSchedule;
