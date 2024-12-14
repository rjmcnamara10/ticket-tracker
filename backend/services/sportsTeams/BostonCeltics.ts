import axios from 'axios';
import AbstractSportsTeam from './AbstractSportsTeam';
import { Game } from '../../types';

/**
 * Class representing the Boston Celtics sports team.
 *
 * @extends AbstractSportsTeam
 */
class BostonCeltics extends AbstractSportsTeam {
  readonly name: string = 'Boston Celtics';
  private readonly _scheduleUrl: string =
    'https://cdn.celtics.com/api/schedule/2024_celtics_schedule.json';
  private readonly _venue: string = 'TD Garden';
  private readonly _city: string = 'Boston';
  private readonly _state: string = 'MA';

  async getRemainingHomeGames(): Promise<Game[]> {
    const remainingHomeSchedule: Game[] = [];
    const now = new Date();
    const { data } = await axios.get(this._scheduleUrl);
    const allGames = data.data.gscd.g;
    for (const game of allGames) {
      const gameDay = new Date(`${game.gdte}T23:59:59`);
      const isFutureGame = gameDay > now;
      const isHomeGame =
        game.an === this._venue && game.ac === this._city && game.as === this._state;
      if (isFutureGame && isHomeGame) {
        const startDateTime = new Date(`${game.etm}-00:00`); // store EST datetime
        const futureHomeGame: Game = {
          homeTeam: this.name,
          awayTeam: `${game.v.tc} ${game.v.tn}`,
          startDateTime,
          venue: this._venue,
          city: this._city,
          state: this._state,
          tickets: [],
        };
        remainingHomeSchedule.push(futureHomeGame);
      }
    }
    return remainingHomeSchedule;
  }
}

export default BostonCeltics;
