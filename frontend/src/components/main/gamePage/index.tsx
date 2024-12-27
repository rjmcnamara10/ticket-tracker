import { Loader } from '@aws-amplify/ui-react';
import useGamePage from '../../../hooks/useGamePage';
import GameCard from './gameCard';
import './index.css';

/**
 * Represents the page to display the games available for the user to select.
 */
const GamePage = () => {
  const { games, loading } = useGamePage();

  return (
    <div className='game-scroller-container'>
      {loading ? (
        <Loader size='large' />
      ) : (
        <div className='game-list'>
          {games.map((game, index) => (
            <GameCard game={game} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GamePage;
