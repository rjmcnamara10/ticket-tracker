import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Game collection. Defines the structure for storing games in the database.
 *
 * - homeTeam: The full name of the home team.
 * - awayTeam: The full name of the away team.
 * - startDateTime: The date and time when the game starts in EST.
 * - venue: The name of the venue where the game is played.
 * - city: The city where the game is played.
 * - state: The two-letter abbreviation of the state where the game is played.
 * - tickets: The tickets available for the game.
 * - lastUpdated: The date and time when the tickets available was last updated. Optional field.
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
    tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
    lastUpdated: {
      type: Date,
    },
  },
  { collection: 'Game' },
);

export default gameSchema;
