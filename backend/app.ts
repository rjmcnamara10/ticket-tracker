import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import * as http from 'http';
import ticketController from './controllers/ticket';
import scheduleController from './controllers/schedule';

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

const app = express();
const server = http.createServer(app);

function startServer() {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

process.on('SIGINT', () => {
  server.close(() => {
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
app.use('/schedule', scheduleController());

export default startServer;
