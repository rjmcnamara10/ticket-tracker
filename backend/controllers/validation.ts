import Joi from 'joi';
import { ObjectId } from 'mongodb';

export const scrapeEventUrlsSchema = Joi.object({
  app: Joi.string().valid('Tickpick', 'Gametime').required().messages({
    'any.only': 'App must be either "Tickpick" or "Gametime"',
    'any.required': 'App is required',
  }),
});

export const scrapeTicketsSchema = Joi.object({
  app: Joi.string().valid('Tickpick', 'Gametime').required().messages({
    'any.only': 'App must be either "Tickpick" or "Gametime"',
    'any.required': 'App is required',
  }),
  url: Joi.string().uri().required().messages({
    'string.uri': 'URL must be a valid URI',
    'any.required': 'URL is required',
  }),
  ticketQuantity: Joi.number().integer().min(1).max(20).required().messages({
    'number.base': 'Ticket quantity must be a number',
    'number.min': 'Ticket quantity must be at least 1',
    'number.max': 'Ticket quantity must be at most 20',
    'any.required': 'Ticket quantity is required',
  }),
});

export const fetchTicketsSchema = Joi.object({
  order: Joi.string().valid('cheapest', 'bestValue').required().messages({
    'any.only': 'Order must be either "cheapest" or "bestValue"',
    'any.required': 'Order is required',
  }),
  gameId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('gameId.custom', {
          message: 'Invalid Game ID format',
        });
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Game ID is required',
      'gameId.custom': 'Invalid Game ID format',
    }),
  ticketQuantity: Joi.string()
    .pattern(/^\d+$/)
    .custom((value, helpers) => {
      const num = parseInt(value, 10);
      if (num < 1 || num > 20) {
        return helpers.error('ticketQuantity.custom', {
          message: 'Ticket quantity must be between 1 and 20',
        });
      }
      return value;
    })
    .required()
    .messages({
      'string.pattern.base': 'Ticket quantity must be a valid number',
      'any.required': 'Ticket quantity is required',
      'ticketQuantity.custom': 'Ticket quantity must be between 1 and 20',
    }),
});

export const addHomeGamesSchema = Joi.object({
  team: Joi.string().valid('celtics').required().messages({
    'any.only': 'Team must be "celtics"',
    'any.required': 'Team is required',
  }),
});

export const addTicketAppUrlSchema = Joi.object({
  gameId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('gameId.custom', {
          message: 'Invalid Game ID format',
        });
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Game ID is required',
      'gameId.custom': 'Invalid Game ID format',
    }),
  app: Joi.string().valid('Tickpick', 'Gametime').required().messages({
    'any.only': 'App must be either "Tickpick" or "Gametime"',
    'any.required': 'App is required',
  }),
  ticketAppUrl: Joi.string().uri().required().messages({
    'string.uri': 'Ticket app URL must be a valid URI',
    'any.required': 'Ticket app URL is required',
  }),
});

export const refreshTicketsSchema = Joi.object({
  gameId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('gameId.custom', {
          message: 'Invalid Game ID format',
        });
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Game ID is required',
      'gameId.custom': 'Invalid Game ID format',
    }),
  ticketQuantity: Joi.number().integer().min(1).max(20).required().messages({
    'number.base': 'Ticket quantity must be a number',
    'number.min': 'Ticket quantity must be at least 1',
    'number.max': 'Ticket quantity must be at most 20',
    'any.required': 'Ticket quantity is required',
  }),
});
