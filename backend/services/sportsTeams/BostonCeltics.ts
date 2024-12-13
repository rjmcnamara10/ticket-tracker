import axios from 'axios';
import SportsTeam from './SportsTeam';
import { Game } from '../../types';

/**
 * Class to represent the Boston Celtics sports team
 */
class BostonCeltics implements SportsTeam {
  readonly name: string;

  constructor() {
    this.name = 'Boston Celtics';
  }

  async getHomeSchedule(): Promise<Game[]> {
    const venue = 'TD Garden';
    const city = 'Boston';
    const state = 'MA';

    const homeSchedule: Game[] = [];
    const { data } = await axios.get(
      'https://cdn.celtics.com/evergreen/dotcom/schedule/v2024/2024_celtics_schedule.json',
    );
    const allGames = data.data.gscd.g;
    for (const game of allGames) {
      if (game.an === venue && game.ac === city && game.as === state) {
        const homeGame: Game = {
          homeTeam: this.name,
          awayTeam: `${game.v.tc} ${game.v.tn}`,
          startDateTime: new Date(game.etm),
          venue,
          city,
          state,
          tickets: [],
        };
        homeSchedule.push(homeGame);
      }
    }
    return homeSchedule;
  }
}

export default BostonCeltics;
