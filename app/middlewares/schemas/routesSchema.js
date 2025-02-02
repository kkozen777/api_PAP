const Joi = require('joi');

const createRouteSchema = Joi.object({
    lineId: Joi.number().integer().required(),
    pathId: Joi.number().integer().required(),
    start_time: Joi.string().required(), 
    end_time: Joi.string().required(),
});

const updateRouteSchema = Joi.object({
    lineId: Joi.number().optional(), 
    pathId: Joi.number().optional(),
    start_time: Joi.string().optional(), 
    end_time: Joi.string().optional(),
    status: Joi.number().integer().min(0).max(2).optional(),
});

module.exports = { createRouteSchema, updateRouteSchema };