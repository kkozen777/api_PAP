const Joi = require('joi');
// validation vai validar o vue futuramente
// validar todos os dados que entram e saiem


// Schema for creating a user
// ex: email: Joi.string()(tipo de dados) .email(oque tem de ser().required()   
const createDriverSchema = Joi.object({
    driverNumber: Joi.number().required(), 
    password: Joi.string().min(6).required(), // Minimum 6 characters
    name: Joi.string().required(), // Optional name field
    id: Joi.any().forbidden(), // Rejeita explicitamente o campo id
});

const updateDriverSchema = Joi.object({
    driverNumber: Joi.number().optional(), // Must be a valid email
    password: Joi.string().min(6).optional(), // Minimum 6 characters
    name: Joi.string().optional(), // Optional name field
});

const updateDriverPasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).optional(), // Minimum 6 characters
    newPassword: Joi.string().min(6).optional(), // Minimum 6 characters
});


module.exports = { createDriverSchema, updateDriverSchema, updateDriverPasswordSchema };