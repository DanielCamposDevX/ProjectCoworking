import Joi from 'joi';

export const userSchema = Joi.object({
   nome: Joi.string().required().max(50),
   email: Joi.string().required(),
   senha: Joi.string().required().max(30),
   papel: Joi.string().required(),
});

export const loginSchema = Joi.object({
   email: Joi.string().required().max(50),
   senha: Joi.string().required().max(30),
});
