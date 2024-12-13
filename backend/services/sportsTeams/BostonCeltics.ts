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
    const homeSchedule: Game[] = [];
    const { data } = await axios.get(
      'https://cdn.celtics.com/evergreen/dotcom/schedule/v2024/2024_celtics_schedule.json',
    );
    const allGames = data.data.gscd.g;
    for (const game of allGames) {
      if (game.an === 'TD Garden' && game.ac === 'Boston' && game.as === 'MA') {
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
}

export default BostonCeltics;
