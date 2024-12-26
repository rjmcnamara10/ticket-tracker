import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchTickets } from '../services/ticketService';
import { Ticket } from '../types';

/**
 * Hook to manage the game tickets page state.
 *
 * @returns {Ticket[]} cheapestTickets - The list of tickets for the game sorted by price.
 * @returns {Ticket[]} bestValueTickets - The list of tickets for the game sorted by best value.
 * @returns {boolean} loadingCheapest - The loading state of the cheapest tickets.
 * @returns {boolean} loadingBestValue - The loading state of the best value tickets.
 * @returns {string} error - An error message if there was an issue fetching the tickets.
 */
const useTicketsPage = () => {
  const [searchParams] = useSearchParams();
  const [cheapestTickets, setCheapestTickets] = useState<Ticket[]>([]);
  const [bestValueTickets, setBestValueTickets] = useState<Ticket[]>([]);
  const [loadingCheapest, setLoadingCheapest] = useState(true);
  const [loadingBestValue, setLoadingBestValue] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const gameIdQuery = searchParams.get('gameId');
    const ticketQuantityQuery = searchParams.get('ticketQuantity');

    if (!gameIdQuery || !ticketQuantityQuery) {
      setError('Missing required query parameters - "gameId" and "ticketQuantity"');
      setLoadingCheapest(false);
      setLoadingBestValue(false);
      return;
    }

    const loadTickets = async () => {
      try {
        const [cheapestRes, bestValueRes] = await Promise.all([
          fetchTickets('cheapest', gameIdQuery, ticketQuantityQuery),
          fetchTickets('bestValue', gameIdQuery, ticketQuantityQuery),
        ]);
        setCheapestTickets(cheapestRes.tickets || []);
        setBestValueTickets(bestValueRes.tickets || []);
      } catch (err) {
        setError('Error while fetching tickets');
        console.log(err);
      } finally {
        setLoadingCheapest(false);
        setLoadingBestValue(false);
      }
    };

    loadTickets();
  }, [searchParams]);

  return { cheapestTickets, bestValueTickets, loadingCheapest, loadingBestValue, error };
};

export default useTicketsPage;
