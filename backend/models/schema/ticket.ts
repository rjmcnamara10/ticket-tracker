import { Schema } from 'mongoose';

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
