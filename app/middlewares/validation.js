const Joi = require('joi');

/**
 
Middleware to validate requests against a Joi schema.
@param {Joi.Schema} schema - The Joi schema to validate the request.
@param {'body' | 'query' | 'params'} property - The part of the request to validate (default: body).*/
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false }); // Validate against the schema
        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map((detail) => detail.message),
            });
        }
        next();
    };
};

module.exports = validate;