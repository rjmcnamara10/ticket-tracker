import { Schema } from 'mongoose';

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
