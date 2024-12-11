import Joi from 'joi';

export const scrapeEventUrlsSchema = Joi.object({
  app: Joi.string().valid('tickpick', 'gametime').required().messages({
    'any.only': 'App must be either "tickpick" or "gametime"',
    'any.required': 'App is required',
  }),
});

export const scrapeTicketsSchema = Joi.object({
  app: Joi.string().valid('tickpick', 'gametime').required().messages({
    'any.only': 'App must be either "tickpick" or "gametime"',
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

export const homeScheduleSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'URL must be a valid URI',
    'any.required': 'URL is required',
  }),
  arenaName: Joi.string().required().messages({
    'string.base': 'Arena name must be a string',
    'any.required': 'Arena name is required',
  }),
  arenaCity: Joi.string().required().messages({
    'string.base': 'Arena city must be a string',
    'any.required': 'Arena city is required',
  }),
  arenaState: Joi.string().required().messages({
    'string.base': 'Arena state must be a string',
    'any.required': 'Arena state is required',
  }),
});