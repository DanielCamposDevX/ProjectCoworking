import Joi from 'joi';

export const taskSchema = Joi.object({
   nome: Joi.string().required().max(50).messages({
      'string.base': 'O nome deve ser uma string.',
      'string.empty': 'O campo nome é obrigatório.',
      'any.required': 'O campo nome é obrigatório.',
      'string.max': 'O nome deve ter no máximo {#limit} caracteres.',
   }),
   descricao: Joi.string().required().max(145).messages({
      'string.base': 'A descrição deve ser uma string.',
      'string.empty': 'O campo descrição é obrigatório.',
      'any.required': 'O campo descrição é obrigatório.',
      'string.max': 'A descrição deve ter no máximo {#limit} caracteres.',
   }),
   status: Joi.string().valid('PENDENTE', 'CONCLUIDO').required().messages({
      'string.base': 'O status deve ser uma string.',
      'string.empty': 'O campo status é obrigatório.',
      'any.required': 'O campo status é obrigatório.',
      'any.only': 'O status deve ser PENDENTE ou CONCLUIDO.',
   }),
});
