import Joi from 'joi';

export const scrapeEventUrlsSchema = Joi.object({
  app: Joi.string().valid('Tickpick', 'Gametime').required().messages({
    'any.only': 'App must be either "Tickpick" or "Gametime"',
    'any.required': 'App is required',
  }),
});

export const addHomeGamesSchema = Joi.object({
  team: Joi.string().valid('celtics').required().messages({
    'any.only': 'Team must be "celtics"',
    'any.required': 'Team is required',
  }),
});

export const addTicketAppUrlSchema = Joi.object({
  gameId: Joi.string().required().messages({
    'any.required': 'Game ID is required',
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
  gameId: Joi.string().required().messages({
    'any.required': 'Game ID is required',
  }),
  ticketQuantity: Joi.number().integer().min(1).max(20).required().messages({
    'number.base': 'Ticket quantity must be a number',
    'number.min': 'Ticket quantity must be at least 1',
    'number.max': 'Ticket quantity must be at most 20',
    'any.required': 'Ticket quantity is required',
  }),
});
