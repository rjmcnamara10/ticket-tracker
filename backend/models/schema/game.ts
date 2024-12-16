import { Schema } from 'mongoose';

/**
 * Mongoose schema for the TicketsPage type.
 *
 * - app: The ticket resale app where the tickets are listed.
 * - gameUrl: The URL of the page where the tickets are listed.
 */
const ticketsPageSchema: Schema = new Schema({
  app: {
    type: String,
    enum: ['Tickpick', 'Gametime'],
  },
  gameUrl: {
    type: String,
  },
});

/**
 * Mongoose schema for the TicketQuantityGroup type.
 *
 * - ticketQuantity: The size of the group that all the tickets are sold in.
 * - lastUpdated: The date and time when the tickets were last updated.
 * - tickets: The set of available ticket listings at the quantity.
 */
const ticketQuantityGroupSchema: Schema = new Schema({
  ticketQuantity: Number,
  lastUpdated: Date,
  tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
});

/**
 * Mongoose schema for the Game collection. Defines the structure for storing games in the database.
 *
 * - homeTeam: The full name of the home team.
 * - awayTeam: The full name of the away team.
 * - startDateTime: The date and time when the game starts in EST.
 * - venue: The name of the venue where the game is played.
 * - city: The city where the game is played.
 * - state: The two-letter abbreviation of the state where the game is played.
 * - ticketsByQuantity: The tickets available for the game.
 */
const gameSchema: Schema = new Schema(
  {
    homeTeam: {
      type: String,
    },
    awayTeam: {
      type: String,
    },
    startDateTime: {
      type: Date,
      unique: true,
    },
    venue: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    ticketAppUrls: [ticketsPageSchema],
    ticketsByQuantity: [ticketQuantityGroupSchema],
  },
  { collection: 'Game' },
);

export default gameSchema;
