import Joi from 'joi';

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
  gameId: Joi.string().required().messages({
    'any.required': 'Game ID is required',
  }),
});

export const homeScheduleSchema = Joi.object({
  team: Joi.string().valid('celtics').required().messages({
    'any.only': 'Team must be "celtics"',
    'any.required': 'Team is required',
  }),
});
