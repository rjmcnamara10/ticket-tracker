import Joi from 'joi';

const scrapeTicketsSchema = Joi.object({
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

export default scrapeTicketsSchema;
