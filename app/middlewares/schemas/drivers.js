const Joi = require('joi');
// validar todos os dados que entram e saiem


// Schema para criar um driver
// ex: email: Joi.string()(tipo de dados) .email(oque tem de ser().required()  
//  //required é obrigatorio
//optional é opcional
const createDriverSchema = Joi.object({
    driverNumber: Joi.number().required(), 
    password: Joi.string().min(6).required(), // minimo 6 caracteres
    name: Joi.string().required(), //  name opcional
    id: Joi.any().forbidden(), // rejeita explicitamente o campo id
});

const updateDriverSchema = Joi.object({
    driverNumber: Joi.number().optional(),
    password: Joi.string().min(6).optional(),
    name: Joi.string().optional(),
});

const updateDriverPasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).optional(),
    newPassword: Joi.string().min(6).optional(),
});


module.exports = { createDriverSchema, updateDriverSchema, updateDriverPasswordSchema };