import { useEffect, useState } from 'react';
import { fetchGames } from '../services/gameService';
import { Game } from '../types';

/**
 * Hook to manage the game page state.
 *
 * @returns {Game[]} games - The list of games.
 * @returns {boolean} loading - The loading state of the games.
 */
const useGamePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const res = await fetchGames();
        setGames(res.games || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return { games, loading };
};

export default useGamePage;
