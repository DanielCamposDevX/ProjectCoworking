import Joi from 'joi';

const statusEnum = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO'];

export const projectSchema = Joi.object({
   nome: Joi.string().required().max(50).messages({
      'string.base': 'O nome deve ser uma string.',
      'string.empty': 'O campo nome é obrigatório.',
      'any.required': 'O campo nome é obrigatório.',
      'string.max': 'O nome deve ter no máximo {#limit} caracteres.',
   }),
   descricao: Joi.string().optional().max(180).messages({
      'string.base': 'A descrição deve ser uma string.',
      'string.max': 'A descrição deve ter no máximo {#limit} caracteres.',
   }),
   data_inicio: Joi.string().isoDate().required().messages({
      'string.base': 'A data de início deve ser uma string.',
      'string.empty': 'O campo data de início é obrigatório.',
      'any.required': 'O campo data de início é obrigatório.',
      'string.isoDate': 'A data de início deve estar no formato ISO.',
   }),
   status: Joi.string()
      .valid(...statusEnum)
      .required()
      .messages({
         'any.only': 'O status deve ser um dos seguintes valores: {#valids}.',
         'any.required': 'O campo status é obrigatório.',
      }),
});

export const updateProjectSchema = Joi.object({
   nome: Joi.string().optional().max(50).messages({
      'string.base': 'O nome deve ser uma string.',
      'string.max': 'O nome deve ter no máximo {#limit} caracteres.',
   }),
   descricao: Joi.string().optional().max(180).messages({
      'string.base': 'A descrição deve ser uma string.',
      'string.max': 'A descrição deve ter no máximo {#limit} caracteres.',
   }),
   data_inicio: Joi.string().isoDate().optional().messages({
      'string.base': 'A data de início deve ser uma string.',
      'string.isoDate': 'A data de início deve estar no formato ISO.',
   }),
   data_fim: Joi.string().isoDate().optional().messages({
      'string.base': 'A data de fim deve ser uma string.',
      'string.isoDate': 'A data de fim deve estar no formato ISO.',
   }),
   status: Joi.string()
      .valid(...statusEnum)
      .optional()
      .messages({
         'any.only': 'O status deve ser um dos seguintes valores: {#valids}.',
      }),
});

export const projectUserSchema = Joi.object({
   usuario_id: Joi.number().required().messages({
      'number.base': 'O ID do usuário deve ser um número.',
      'any.required': 'O campo ID do usuário é obrigatório.',
   }),
});
