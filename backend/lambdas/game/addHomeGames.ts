/* eslint-disable import/prefer-default-export */
import { APIGatewayProxyHandler } from 'aws-lambda';
import connectToDatabase from '../database';
import { addHomeGamesHandler } from '../../handlers/gameHandlers';
import { addHomeGamesSchema } from '../../utils/validation';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await connectToDatabase();

    const body = JSON.parse(event.body || '{}');
    const { error } = addHomeGamesSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const result = await addHomeGamesHandler({ body });
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error when adding home games: ${(err as Error).message}`,
      }),
    };
  }
};
