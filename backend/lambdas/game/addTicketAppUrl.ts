/* eslint-disable import/prefer-default-export */
import { APIGatewayProxyHandler } from 'aws-lambda';
import connectToDatabase from '../database';
import { addTicketAppUrlHandler } from '../../handlers/gameHandlers';
import { addTicketAppUrlSchema } from '../../utils/validation';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await connectToDatabase();

    const body = JSON.parse(event.body || '{}');
    const { error } = addTicketAppUrlSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const result = await addTicketAppUrlHandler({ body });
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error when adding ticket app url: ${(err as Error).message}`,
      }),
    };
  }
};
