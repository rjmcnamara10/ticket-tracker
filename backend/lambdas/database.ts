import mongoose from 'mongoose';

const MONGO_URL = `${process.env.MONGODB_URI}/ticket_track`;

/**
 * Connects to the MongoDB database if not already connected.
 *
 * @returns {Promise<void>} A Promise that resolves to void.
 */
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URL);
  }
}

export default connectToDatabase;
