/* eslint-disable import/prefer-default-export */
import { APIGatewayProxyHandler } from 'aws-lambda';
import getTicketApp from './utils';
import { scrapeTicketsSchema } from '../../controllers/validation';
import connectToDatabase from '../../db';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await connectToDatabase();

    const body = JSON.parse(event.body || '{}');
    const { error } = scrapeTicketsSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const { app, url, ticketQuantity } = body;
    const ticketApp = getTicketApp(app);
    const { tickets, failedTicketsCount } = await ticketApp.scrapeTickets(url, ticketQuantity);

    return {
      statusCode: 200,
      body: JSON.stringify({
        app: ticketApp.name,
        successTicketsCount: tickets.length,
        failedTicketsCount,
        tickets,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error when scraping tickets: ${(err as Error).message}`,
      }),
    };
  }
};
