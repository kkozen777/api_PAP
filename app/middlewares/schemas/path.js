const Joi = require('joi');

const createLineSchema = Joi.object({
    name: Joi.string().required(), 
    coordinates: Joi.string().required(),
});

const updateLineSchema = Joi.object({
    name: Joi.string().optional(), 
    schedules: Joi.string().optional(),

});

module.exports = { createLineSchema, updateLineSchema };