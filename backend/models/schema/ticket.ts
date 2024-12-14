import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Ticket collection. Defines the structure for storing tickets in the database.
 *
 * - section: The section number of the arena where the ticket is located.
 * - row: The row number of the section where the ticket is located.
 * - price: The price of the ticket in USD.
 * - quantity: The number of tickets available to purchase at the price and location.
 * - app: The ticket resale app where the ticket is listed.
 * - link: The link to the ticket listing.
 */
const ticketSchema: Schema = new Schema(
  {
    section: {
      type: Number,
    },
    row: {
      type: Number,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    app: {
      type: String,
      enum: ['tickpick', 'gametime'],
    },
    link: {
      type: String,
    },
  },
  { collection: 'Ticket' },
);

export default ticketSchema;
