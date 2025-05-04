/* eslint-disable import/prefer-default-export */
import { APIGatewayProxyHandler } from 'aws-lambda';
import { fetchTickets } from '../../services/database';
import { fetchTicketsSchema } from '../../controllers/validation';
import connectToDatabase from '../../db';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await connectToDatabase();

    const query = event.queryStringParameters || {};
    const { error } = fetchTicketsSchema.validate(query);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const { gameId, ticketQuantity } = query;
    if (!gameId || !ticketQuantity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'gameId and ticketQuantity are required' }),
      };
    }
    const ticketQuantityNumber = parseInt(ticketQuantity, 10);
    const fetchTixRes = await fetchTickets(gameId, ticketQuantityNumber);

    if ('error' in fetchTixRes) {
      throw new Error(fetchTixRes.error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Tickets fetched successfully',
        ...fetchTixRes,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error when fetching tickets: ${(err as Error).message}`,
      }),
    };
  }
};
