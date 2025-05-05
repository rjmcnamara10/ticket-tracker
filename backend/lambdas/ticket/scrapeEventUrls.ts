/* eslint-disable import/prefer-default-export */
import { APIGatewayProxyHandler } from 'aws-lambda';
import connectToDatabase from '../database';
import { scrapeEventUrlsHandler } from '../../handlers/ticketHandlers';
import { scrapeEventUrlsSchema } from '../../utils/validation';

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

    const result = await scrapeEventUrlsHandler({ body });
    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
