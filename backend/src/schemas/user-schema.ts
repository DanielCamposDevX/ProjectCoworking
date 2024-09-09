import Joi from 'joi';

export const userSchema = Joi.object({
   nome: Joi.string().required().max(50).messages({
      'string.base': 'O nome deve ser uma string.',
      'string.empty': 'O campo nome é obrigatório.',
      'any.required': 'O campo nome é obrigatório.',
      'string.max': 'O nome deve ter no máximo {#limit} caracteres.',
   }),
   email: Joi.string().required().email().messages({
      'string.email': 'O email deve ser um endereço válido.',
      'string.empty': 'O campo email é obrigatório.',
      'any.required': 'O campo email é obrigatório.',
   }),
   senha: Joi.string().required().max(30).messages({
      'string.base': 'A senha deve ser uma string.',
      'string.empty': 'O campo senha é obrigatório.',
      'any.required': 'O campo senha é obrigatório.',
      'string.max': 'A senha deve ter no máximo {#limit} caracteres.',
   }),
   papel: Joi.string().required().messages({
      'string.base': 'O papel deve ser uma string.',
      'string.empty': 'O campo papel é obrigatório.',
      'any.required': 'O campo papel é obrigatório.',
   }),
});

export const loginSchema = Joi.object({
   email: Joi.string().required().max(50).messages({
      'string.email': 'O email deve ser um endereço válido.',
      'string.empty': 'O campo email é obrigatório.',
      'any.required': 'O campo email é obrigatório.',
      'string.max': 'O email deve ter no máximo {#limit} caracteres.',
   }),
   senha: Joi.string().required().max(30).messages({
      'string.base': 'A senha deve ser uma string.',
      'string.empty': 'O campo senha é obrigatório.',
      'any.required': 'O campo senha é obrigatório.',
      'string.max': 'A senha deve ter no máximo {#limit} caracteres.',
   }),
});
