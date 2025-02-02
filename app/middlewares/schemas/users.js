const Joi = require('joi');
// validation vai validar o vue futuramente
// validar todos os dados que entram e saiem


// Schema for creating a user
// ex: email: Joi.string()(tipo de dados) .email(oque tem de ser().required()   
const createUserSchema = Joi.object({
    email: Joi.string().email().required(), // Must be a valid email
    password: Joi.string().min(6).required(), // Minimum 6 characters
    name: Joi.string().optional(), // Optional name field
});

const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(), // Must be a valid email
    password: Joi.string().min(6).optional(), // Minimum 6 characters
    name: Joi.string().optional(), // Optional name field
});

const updateUserPasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).optional(), // Minimum 6 characters
    newPassword: Joi.string().min(6).optional(), // Minimum 6 characters
});

module.exports = { createUserSchema, updateUserSchema, updateUserPasswordSchema };
