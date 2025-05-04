/* eslint-disable import/prefer-default-export */
import { APIGatewayProxyHandler } from 'aws-lambda';
import getTicketApp from './utils';
import { scrapeEventUrlsSchema } from '../../controllers/validation';
import connectToDatabase from '../../db';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await connectToDatabase();

    const body = JSON.parse(event.body || '{}');
    const { error } = scrapeEventUrlsSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const { app } = body;
    const ticketApp = getTicketApp(app);
    const eventUrls = await ticketApp.scrapeEventUrls();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${ticketApp.name} event URLs scraped successfully`,
        eventUrls,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error when scraping event URLs: ${(err as Error).message}`,
      }),
    };
  }
};
