import TicketModel from '../models/ticket';
import GameModel from '../models/game';
import {
  Game,
  Ticket,
  TicketAppName,
  TicketOrderType,
  GameOrderType,
  SectionPointsMap,
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
    const game = await GameModel.findById(gameId).populate({
      path: 'ticketsByQuantity.tickets',
      model: TicketModel,
    });
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

/**
 * Fetches and populates a Game document.
 *
 * @param {string | undefined} gameId - The unique identifier of the game to fetch and populate.
 * @returns {Promise<GameResponse>} - A promise that resolves to the populated Game document or an error message.
 */
export const populateGameDocument = async (gameId: string | undefined): Promise<GameResponse> => {
  try {
    if (!gameId) {
      throw new Error('Provided game ID is undefined.');
    }

    const result = await GameModel.findOne({ _id: gameId }).populate([
      {
        path: 'ticketsByQuantity.tickets',
        model: TicketModel,
      },
    ]);
    if (!result) {
      throw new Error('Failed to fetch and populate the Game document');
    }
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Error when fetching and populating the Game document' };
  }
};

/**
 * Calculate a point value for a ticket based on its section and row.
 *
 * @param {number} section - The section number where the ticket is located.
 * @param {number} row - The row number where the ticket is located.
 * @returns {number} The point value of the ticket.
 */
const calculateTicketValue = (section: number, row: number): number => {
  // Maps each section number to a point value (0, 10, 20, 30, or 40)
  const sectionPointsMap: SectionPointsMap = {
    301: 40,
    302: 40,
    303: 30,
    304: 20,
    305: 10,
    306: 0,
    307: 0,
    308: 0,
    309: 0,
    310: 0,
    311: 0,
    312: 10,
    313: 20,
    314: 30,
    315: 40,
    316: 40,
    317: 40,
    318: 30,
    319: 20,
    320: 10,
    321: 0,
    322: 0,
    323: 0,
    324: 0,
    325: 0,
    326: 0,
    327: 10,
    328: 20,
    329: 30,
    330: 40,
  };

  // Rows are numbered 1 - 15
  return sectionPointsMap[section] + (15 - row);
};

/**
 * Retrieves tickets for a game from the database, sorted by the specified order.
 *
 * @param {TicketOrderType} order - The order to sort the tickets by.
 * @param {string} gameId - The unique identifier of the game to retrieve tickets for.
 * @param {number} ticketQuantity - The quantity of tickets the listings are sold in.
 * @returns {Promise<TicketsResponse>} A promise that resolves to the sorted tickets or an error message.
 */
export const fetchTicketsByOrder = async (
  order: TicketOrderType,
  gameId: string,
  ticketQuantity: number,
): Promise<TicketsResponse> => {
  try {
    const game = await getGameById(gameId);
    if ('error' in game) {
      throw new Error(game.error);
    }

    const ticketQuantityGroup = game.ticketsByQuantity.find(
      group => group.ticketQuantity === ticketQuantity,
    );
    if (!ticketQuantityGroup) {
      throw new Error('Tickets not found for the specified quantity');
    }

    const unsortedTickets = ticketQuantityGroup.tickets;
    const balconyTickets = unsortedTickets.filter(
      ticket => ticket.section >= 301 && ticket.section <= 330,
    );
    switch (order) {
      case 'cheapest':
        return balconyTickets.sort((a, b) => a.price - b.price);
      case 'bestValue':
        return balconyTickets.sort(
          (a, b) => calculateTicketValue(a.section, a.row) - calculateTicketValue(b.section, b.row),
        );
      default:
        throw new Error('Invalid ticket order');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error fetching tickets' };
  }
};

/**
 * Sorts a list of games chronologically.
 *
 * @param {Game[]} games - The list of games to sort.
 * @returns {Game[]} The list of games sorted chronologically.
 */
const sortGamesChronologically = (games: Game[]): Game[] =>
  games.sort((a, b) => {
    if (a.startDateTime > b.startDateTime) {
      return 1;
    }
    if (a.startDateTime < b.startDateTime) {
      return -1;
    }
    return 0;
  });

/**
 * Retrieves games from the database, sorted by the specified order.
 *
 * @param {GameOrderType} order - The order to sort the games by.
 * @returns {Promise<GamesResponse>} A promise that resolves to the sorted games or an error message.
 */
export const fetchGamesByOrder = async (order: GameOrderType): Promise<GamesResponse> => {
  try {
    const games = await GameModel.find().populate({
      path: 'ticketsByQuantity.tickets',
      model: TicketModel,
    });

    switch (order) {
      case 'chronological':
        return sortGamesChronologically(games);
      default:
        throw new Error('Invalid game order');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error fetching games' };
  }
};
