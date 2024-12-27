import { useNavigate } from 'react-router-dom';
import { Game } from '../../../../types';
import formatDateTime from '../../../../utils/date.utils';
import './index.css';

/**
 * Interface representing the props for the GameCard component.
 *
 * @property {Game} game - The game to display in the card.
 */
interface GameProps {
  game: Game;
}

/**
 * Represents a card component for displaying the information associated with a game.
 *
 * @param {GameProps} props - The props for the GameCard component containing the game to display.
 */
const GameCard = ({ game }: GameProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the tickets page for the game based on the game ID.
   *
   * @param gameId - The ID of the game to navigate to the tickets page for.
   */
  const handleClick = (gameId: string) => {
    navigate({
      pathname: '/tickets',
      search: `?gameId=${gameId}&ticketQuantity=2`,
    });
  };

  return (
    <div
      className='game-card'
      onClick={() => {
        if (game._id) {
          handleClick(game._id);
        }
      }}>
      <div className='game-card-header'>
        <h2>
          {game.homeTeam} vs {game.awayTeam}
        </h2>
        <p>{formatDateTime(new Date(game.startDateTime))}</p>
      </div>
      <div className='game-card-body'>
        <p>
          <strong>Venue:</strong> {game.venue}
        </p>
        <p>
          <strong>Location:</strong> {game.city}, {game.state}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
