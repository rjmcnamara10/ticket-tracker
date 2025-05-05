import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';
import * as http from 'http';
import ticketController from './controllers/ticket';
import gameController from './controllers/game';

dotenv.config();

const MONGO_URL = `${process.env.MONGODB_URI}/ticket_track`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

mongoose
  .connect(MONGO_URL)
  .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const server = http.createServer(app);

function startServer() {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
});

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  }),
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

app.use('/ticket', ticketController());
app.use('/game', gameController());

export default startServer;
