import mongoose, { Model } from 'mongoose';
import gameSchema from './schema/game';
import { Game } from '../types';

/**
 * Mongoose model for the `Game` collection.
 *
 * This model is created using the `Game` interface and the `gameSchema`, representing the
 * `Game` collection in the MongoDB database, and provides an interface for interacting with
 * the stored games.
 *
 * @type {Model<Game>}
 */
const GameModel: Model<Game> = mongoose.model<Game>('Game', gameSchema);

export default GameModel;
