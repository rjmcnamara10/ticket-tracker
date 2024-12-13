import mongoose, { Model } from 'mongoose';
import ticketSchema from './schema/ticket';
import { Ticket } from '../types';

/**
 * Mongoose model for the `Ticket` collection.
 *
 * This model is created using the `Ticket` interface and the `ticketSchema`, representing the
 * `Ticket` collection in the MongoDB database, and provides an interface for interacting with
 * the stored tickets.
 *
 * @type {Model<Ticket>}
 */
const TicketModel: Model<Ticket> = mongoose.model<Ticket>('Ticket', ticketSchema);

export default TicketModel;
