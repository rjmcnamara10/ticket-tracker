import axios from 'axios';
import SportsTeam from './SportsTeam';
import { Game } from '../types';

/**
 * Class to represent the Boston Celtics sports team
 */
class BostonCeltics implements SportsTeam {
  readonly name: string;
  readonly scheduleUrl: string;
  readonly venueName: string;
  readonly venueCity: string;
  readonly venueState: string;

  constructor() {
    this.name = 'Boston Celtics';
    this.scheduleUrl =
      'https://cdn.celtics.com/evergreen/dotcom/schedule/v2024/2024_celtics_schedule.json';
    this.venueName = 'TD Garden';
    this.venueCity = 'Boston';
    this.venueState = 'MA';
  }

  // Remove the fields from the SportsTeam interface? And just have each class implement the getHomeSchedule method?
  // If removing those fields, then probably split name field into teamCity and teamName fields
  // Allows for more flexibility, teams don't have to have a schedule URL, venue name, city, and state
  // Keep fields and move default implementation of getHomeSchedule to the SportsTeam interface?

  async getHomeSchedule(): Promise<Game[]> {
    const homeSchedule: Game[] = [];
    const { data } = await axios.get(this.scheduleUrl);
    const allGames = data.data.gscd.g;
    for (const game of allGames) {
      if (game.an === this.venueName && game.ac === this.venueCity && game.as === this.venueState) {
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
