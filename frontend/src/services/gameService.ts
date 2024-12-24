import { SportsTeamName, TicketAppName } from '../types';
import api from './config';

const GAME_API_URL = `${process.env.REACT_APP_SERVER_URL}/game`;

/**
 * Function to add future home games of a sports team.
 *
 * @param {SportsTeamName} team - The name of the sports team to add the home games for.
 * @throws Error if there is an issue adding the home games.
 */
const addHomeGames = async (team: SportsTeamName) => {
  const res = await api.post(`${GAME_API_URL}/addHomeGames`, team);

  if (res.status !== 200) {
    throw new Error('Error while adding home games');
  }

  return res.data;
};

/**
 * Function to add a ticket app URL to a game.
 *
 * @param {string} gameId - The unique identifier of the game to add the ticket app URL to.
 * @param {TicketAppName} app - The name of the ticket app.
 * @param {string} ticketAppUrl - The URL to the game page on the ticket app.
 * @throws Error if there is an issue adding the ticket app URL.
 */
const addTicketAppUrl = async (gameId: string, app: TicketAppName, ticketAppUrl: string) => {
  const data = { gameId, app, ticketAppUrl };
  const res = await api.post(`${GAME_API_URL}/addTicketAppUrl`, data);

  if (res.status !== 200) {
    throw new Error('Error while adding ticket app URL');
  }

  return res.data;
};

/**
 * Function to refresh the tickets for a game.
 *
 * @param {string} gameId - The unique identifier of the game to refresh the tickets for.
 * @param {number} ticketQuantity - The ticket quantity value to refresh.
 * @throws Error if there is an issue refreshing the tickets.
 */
const refreshTickets = async (gameId: string, ticketQuantity: number) => {
  const data = { gameId, ticketQuantity };
  const res = await api.post(`${GAME_API_URL}/refreshTickets`, data);

  if (res.status !== 200) {
    throw new Error('Error while refreshing tickets');
  }

  return res.data;
};

/**
 * Function to fetch games.
 *
 * @param {string} order - The order to sort the games by. Default is 'chronological'.
 * @throws Error if there is an issue fetching or sorting the games.
 */
const fetchGames = async (order: string = 'chronological') => {
  const res = await api.get(`${GAME_API_URL}/fetchGames?order=${order}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or sorting games');
  }
  return res.data;
};

export { addHomeGames, addTicketAppUrl, refreshTickets, fetchGames };
