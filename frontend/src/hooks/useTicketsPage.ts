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
 * @returns {string} ticketSortOption - The selected ticket sort option.
 * @returns {function} handleTicketSortOptionChange - Function to handle ticket sort option change.
 * @returns {string} ticketViewOption - The selected ticket view option, either 'list' or 'card'.
 * @returns {function} handleTicketViewOptionToggle - Function to handle ticket view option toggle.
 * @returns {boolean} ticketViewList - Indicates if the ticket view is in list mode, true if list, false if card.
 * @returns {boolean} ticketQuantityFound - Indicates if the game in the database has tickets at the specified quantity.
 * @returns {Ticket[]} displayTickets - The sorted list of tickets to display for the game.
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
  const [ticketSortOption, setTicketSortOption] = useState('cheapest');
  const [ticketViewOption, setTicketViewOption] = useState('list');
  const [ticketViewList, setTicketViewList] = useState(true);
  const [cheapestTix, setCheapestTix] = useState<Ticket[]>([]);
  const [bestValueTix, setBestValueTix] = useState<Ticket[]>([]);
  const [displayTickets, setDisplayTickets] = useState<Ticket[]>([]);
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

  /**
   * Function to handle ticket sort option change.
   */
  const handleTicketSortOptionChange = (newTicketSortOption: string) => {
    if (newTicketSortOption === 'cheapest' || newTicketSortOption === 'bestValue') {
      setTicketSortOption(newTicketSortOption);
    } else {
      setError('Invalid ticket sort option');
      console.error(`Invalid ticket sort option: ${newTicketSortOption}`);
    }
  };

  /**
   * Function to handle ticket view option toggle.
   */
  const handleTicketViewOptionToggle = (newTicketViewOption: string) => {
    if (newTicketViewOption === 'list' || newTicketViewOption === 'card') {
      setTicketViewOption(newTicketViewOption);
    } else {
      setError('Invalid ticket view option');
      console.error(`Invalid ticket view option: ${newTicketViewOption}`);
    }
  };

  useEffect(() => {
    switch (ticketSortOption) {
      case 'cheapest':
        setDisplayTickets(cheapestTix);
        break;
      case 'bestValue':
        setDisplayTickets(bestValueTix);
        break;
      default:
        setDisplayTickets([]);
    }
  }, [ticketSortOption, cheapestTix, bestValueTix]);

  useEffect(() => {
    switch (ticketViewOption) {
      case 'list':
        setTicketViewList(true);
        break;
      case 'card':
        setTicketViewList(false);
        break;
      default:
        console.error(`Invalid ticket view option: ${ticketViewOption}`);
    }
  }, [ticketViewOption]);

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
          setCheapestTix(cheapestTickets || []);
          setBestValueTix(bestValueTickets || []);
          setDisplayTickets(cheapestTickets || []);
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
    ticketSortOption,
    handleTicketSortOptionChange,
    ticketViewOption,
    handleTicketViewOptionToggle,
    ticketViewList,
    ticketQuantityFound,
    displayTickets,
    loading,
    error,
  };
};

export default useTicketsPage;
