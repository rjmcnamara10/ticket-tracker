import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchTickets } from '../services/ticketService';
import { Ticket } from '../types';

/**
 * Hook to manage the game tickets page state.
 *
 * @returns {string} matchup - The matchup of the game.
 * @returns {string} location - The location of the game.
 * @returns {string} startDatetime - The start date and time of the game.
 * @returns {string} ticketQuantity - The selected ticket quantity.
 * @returns {function} handleTicketQuantityChange - Function to handle ticket quantity change.
 * @returns {boolean} ticketQuantityFound - Indicates if the game in the database has tickets at the specified quantity.
 * @returns {Ticket[]} cheapestTickets - The list of tickets for the game sorted by price.
 * @returns {Ticket[]} bestValueTickets - The list of tickets for the game sorted by best value.
 * @returns {boolean} loadingCheapest - The loading state of the fetch tickets request.
 * @returns {string} error - An error message if there was an issue fetching the tickets.
 */
const useTicketsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameIdQuery = searchParams.get('gameId');
  const ticketQuantityQuery = searchParams.get('ticketQuantity');

  const [gameId] = useState(gameIdQuery || '');
  const [ticketQuantity, setTicketQuantity] = useState(ticketQuantityQuery || '');

  const [matchup, setMatchup] = useState('');
  const [location, setLocation] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [ticketQuantityFound, setTicketQuantityFound] = useState(false);
  const [cheapestTix, setCheapestTickets] = useState<Ticket[]>([]);
  const [bestValueTix, setBestValueTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Function to handle navigation on ticket quantity change.
   */
  const handleTicketQuantityChange = (newTicketQuantity: string) => {
    setTicketQuantity(newTicketQuantity);
    navigate({
      pathname: '/tickets',
      search: `?gameId=${gameId}&ticketQuantity=${newTicketQuantity}`,
    });
  };

  useEffect(() => {
    if (!gameIdQuery || !ticketQuantityQuery) {
      setError('Missing required query parameters - "gameId" and "ticketQuantity"');
      setLoading(false);
      return;
    }

    const loadTickets = async () => {
      try {
        const response = await fetchTickets(gameIdQuery, ticketQuantityQuery);
        if (response.error) {
          setError(response.error);
        } else {
          const {
            homeTeam,
            awayTeam,
            startDateTime,
            venue,
            city,
            state,
            ticketQuantityGroupFound,
            cheapestTickets,
            bestValueTickets,
          } = response;
          setMatchup(`${awayTeam} at ${homeTeam}`);
          setLocation(`${venue}: ${city}, ${state}`);
          setStartDatetime(startDateTime);
          setTicketQuantityFound(ticketQuantityGroupFound);
          setCheapestTickets(cheapestTickets || []);
          setBestValueTickets(bestValueTickets || []);
        }
      } catch (err) {
        setError('Error while fetching tickets');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [searchParams, gameIdQuery, ticketQuantityQuery]);

  return {
    matchup,
    location,
    startDatetime,
    ticketQuantity,
    handleTicketQuantityChange,
    ticketQuantityFound,
    cheapestTix,
    bestValueTix,
    loading,
    error,
  };
};

export default useTicketsPage;
