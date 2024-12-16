import SportsTeam from './SportsTeam';
import { Game } from '../../types';

/**
 * Abstract class representing a sports team.
 *
 * @abstract
 * @implements {SportsTeam}
 */
abstract class AbstractSportsTeam implements SportsTeam {
  abstract readonly name: string;

  abstract getRemainingHomeGames(): Promise<Game[]>;
}

export default AbstractSportsTeam;
