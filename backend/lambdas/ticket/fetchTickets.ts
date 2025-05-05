/* eslint-disable import/prefer-default-export */
import { APIGatewayProxyHandler } from 'aws-lambda';
import connectToDatabase from '../database';
import { fetchTicketsHandler } from '../../handlers/ticketHandlers';
import { fetchTicketsSchema } from '../../utils/validation';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await connectToDatabase();

    const queryStringParameters = event.queryStringParameters || {};
    const { error, value } = fetchTicketsSchema.validate(queryStringParameters);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const result = await fetchTicketsHandler({ query: value });
    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
