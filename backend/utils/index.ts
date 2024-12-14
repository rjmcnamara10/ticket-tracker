import { MongoServerError } from 'mongodb';

/**
 * Checks if the error is a duplicate key error.
 *
 * @param {unknown} error - The error to check.
 *
 * @returns {boolean} `true` if the error is a duplicate key error, otherwise `false`.
 */
function isMongoDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as MongoServerError).code === 11000
  );
}

export default isMongoDuplicateKeyError;
