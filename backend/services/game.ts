import TicketModel from '../models/ticket';
import GameModel from '../models/game';
import {
  Game,
  Ticket,
  TicketAppName,
  GameResponse,
  GamesResponse,
  TicketsResponse,
} from '../types';
import isMongoDuplicateKeyError from '../utils';

/**
 * Retrieves a game from the database by its unique identifier.
 *
 * @param {string} gameId - The unique identifier of the game to retrieve.
 * @returns {Promise<GameResponse>} A promise that resolves to the game with the specified identifier or an error message.
 */
export const getGameById = async (gameId: string): Promise<GameResponse> => {
  try {
    const game = await GameModel.findById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Error getting game' };
  }
};

/**
 * Saves a list of games to the database, ignoring any games that already exist.
 *
 * @param {Game[]} games - The list of games to attempt to save.
 * @returns {Promise<GamesResponse>} A promise that resolves to an array of the saved games or error message.
 */
export const saveGames = async (games: Game[]): Promise<GamesResponse> => {
  try {
    const savePromises = games.map(async game => {
      try {
        const gameFromDb = await GameModel.create(game);
        return gameFromDb;
      } catch (err: unknown) {
        if (isMongoDuplicateKeyError(err)) {
          return null; // Games that already exist will return null
        }
        throw err;
      }
    });

    const savedGames = await Promise.all(savePromises);
    const filteredSavedGames = savedGames.filter(game => game !== null);
    return filteredSavedGames;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Error saving games' };
  }
};

/**
 * Saves a list of tickets to the database.
 *
 * @param {Ticket[]} tickets - The list of tickets to save.
 * @returns {Promise<TicketsResponse>} A promise that resolves to an array of the saved tickets or error message.
 */
export const saveTickets = async (tickets: Ticket[]): Promise<TicketsResponse> => {
  try {
    const savedTickets = await TicketModel.insertMany(tickets);
    return savedTickets;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Error saving tickets' };
  }
};

/**
 * Adds a ticket app URL to a game in the database, or modifies the URL if it already exists.
 *
 * @param {string} gameId - The unique identifier of the game to add the ticket app URL to.
 * @param {TicketAppName} app - The name of the ticket app.
 * @param {string} ticketAppUrl - The URL to the game page on the ticket app.
 * @returns {Promise<GameResponse>} A promise that resolves to the updated game or an error message.
 */
export const addTicketAppUrlToGame = async (
  gameId: string,
  app: TicketAppName,
  ticketAppUrl: string,
): Promise<GameResponse> => {
  try {
    const gameFromDb = await GameModel.findOneAndUpdate(
      { '_id': gameId, 'ticketAppUrls.app': app },
      {
        $set: { 'ticketAppUrls.$.gameUrl': ticketAppUrl },
      },
      {
        new: true,
      },
    );

    if (gameFromDb) {
      return gameFromDb;
    }

    const newGameFromDb = await GameModel.findOneAndUpdate(
      { _id: gameId },
      {
        $push: { ticketAppUrls: { app, gameUrl: ticketAppUrl } },
      },
      {
        new: true,
      },
    );

    if (!newGameFromDb) {
      throw new Error('Game not found');
    }

    return newGameFromDb;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Error when adding ticket app URL to game' };
  }
};

/**
 * Adds a list of tickets to a game in the database.
 *
 * @param {string} gameId - The unique identifier of the game to add tickets to.
 * @param {Ticket[]} tickets - The list of tickets to add to the game.
 * @param {number} ticketQuantity - The quantity of tickets the listings are sold in.
 * @param {Date} scrapeDateTime - The date and time the tickets were scraped.
 * @returns {Promise<GameResponse>} A promise that resolves to the updated game or an error message.
 */
export const addTicketsToGame = async (
  gameId: string,
  tickets: Ticket[],
  ticketQuantity: number,
  scrapeDateTime: Date,
): Promise<GameResponse> => {
  try {
    const game = await GameModel.findById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const existingTicketQuantityGroup = game.ticketsByQuantity.find(
      group => group.ticketQuantity === ticketQuantity,
    );
    if (existingTicketQuantityGroup) {
      await TicketModel.deleteMany({
        _id: { $in: existingTicketQuantityGroup.tickets.map(ticket => ticket._id) },
      });
      existingTicketQuantityGroup.tickets = tickets;
      existingTicketQuantityGroup.lastUpdated = scrapeDateTime;
    } else {
      game.ticketsByQuantity.push({
        ticketQuantity,
        lastUpdated: scrapeDateTime,
        tickets,
      });
    }

    await game.save();
    return game;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Error when adding tickets to game' };
  }
};
